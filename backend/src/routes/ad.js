const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const multer = require("multer");
const path = require("path");
const aws = require("aws-sdk");
const s3BucketName = "advistaprojectbucket";
const defaultImage = "default.png";
aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "ca-central-1",
});
const s3 = new aws.S3();
const upload = multer();
const {
  authenticateOwnerToken,
  authenticateUserToken,
} = require("../middleware");
const postModel = require("../models/postModel");

// Models image data for s3
const getImageData = (image) => {
  return [
    Buffer.from(image.buffer, "binary"),
    Date.now() + path.extname(image.originalname),
  ];
};

const getImageType = (imageName) =>
  `image/${path.extname(imageName).replace(".", "")}`;

//To get an image uploaded by the user for the ads
router.get(
  "/upload/:imageName/:timestamp",
  authenticateUserToken,
  async (req, res, next) => {
    try {
      const { imageName } = req.params;
      const params = { Bucket: s3BucketName, Key: imageName };
      s3.getObject(params, (err, data) => {
        if (err) {
          next(createError(500, err.message));
        }
        if (data) {
          imageBufferToBase64 = Buffer.from(data.Body).toString("base64");
          res.json({
            image_type: getImageType(imageName),
            image_data: imageBufferToBase64,
          });
        }
      });
    } catch (err) {
      next(createError(500, err.message));
    }
  }
);

//To add a new post in the database
router.post(
  "/",
  upload.single("image"),
  authenticateUserToken,
  async function (req, res, next) {
    try {
      const image = req.file;
      let newPost;
      const { title, description, post_person_id, price, category } = req.body;
      if (image) {
        const [imageBufferToBinary, imageName] = getImageData(image);
        const uploadParams = {
          Bucket: s3BucketName,
          Key: imageName,
          Body: imageBufferToBinary,
        };
        s3.upload(uploadParams, function (err, data) {
          if (err) {
            console.log("Errorthis", err);
          }
          if (data) {
            console.log("Upload Success", data.Location);
          }
        });
        newPost = new postModel({
          title: title,
          description: description,
          image_name: imageName,
          post_person_id: post_person_id,
          price: price,
          category: category,
        });
      } else {
        newPost = new postModel({
          title: title,
          description: description,
          image_name: defaultImage,
          post_person_id: post_person_id,
          price: price,
          category: category,
        });
      }
      const savedPost = await newPost.save();
      res.status(200).json(savedPost);
    } catch (error) {
      next(createError(500, error.message));
    }
  }
);

//To update an ad in the database
router.put(
  "/:id/:post_person_id",
  upload.single("image"),
  authenticateOwnerToken,
  async function (req, res, next) {
    try {
      const { id } = req.params;
      const { title, description, price, category } = req.body;
      const image = req.file;
      let post;
      if (image) {
        const oldPost = await postModel.findById(id);
        if (oldPost.image_name != "default.png") {
          const deleteParams = {
            Bucket: s3BucketName,
            Key: oldPost.image_name,
          };
          s3.deleteObject(deleteParams, (err) => {
            if (err) {
              next(createError(500, err.message));
            }
          });
        }
        const [imageBufferToBinary, imageName] = getImageData(image);
        const uploadParams = {
          Bucket: s3BucketName,
          Key: imageName,
          Body: imageBufferToBinary,
        };
        s3.upload(uploadParams, (err) => {
          if (err) {
            next(createError(500, err.message));
          }
        });
        post = await postModel.findByIdAndUpdate(id, {
          title: title,
          description: description,
          image_name: imageName,
          price: price,
          category: category,
        });
      } else {
        post = await postModel.findByIdAndUpdate(id, {
          title: title,
          description: description,
          price: price,
          category: category,
        });
      }
      res.status(200).json(post);
    } catch (error) {
      if (error.kind === "ObjectId") {
        next(createError(404, "User not found"));
      } else {
        next(createError(500, "Failed attempt"));
      }
    }
  }
);

//To get all the ads from the database
router.get("/", authenticateUserToken, async function (req, res, next) {
  try {
    const posts = await postModel.find({});
    res.status(200).json(posts);
  } catch (error) {
    next(createError(500, error.message));
  }
});

//To delete an ad from the database
router.delete(
  "/:id/:post_person_id",
  authenticateOwnerToken,
  async function (req, res, next) {
    try {
      const { id } = req.params;
      const post = await postModel.findById(id);
      if (post.image_name != "default.png") {
        const deleteParams = {
          Bucket: s3BucketName,
          Key: post.image_name,
        };
        s3.deleteObject(deleteParams, (err) => {
          if (err) {
            next(createError(500, err.message));
          }
        });
      }
      await postModel.deleteOne({ _id: id });
      res.sendStatus(200);
    } catch (error) {
      if (error.kind === "ObjectId") {
        next(createError(404, "User not found"));
      } else {
        next(createError(500, "Failed attempt"));
      }
    }
  }
);

module.exports = router;
