import React, { useState, useEffect } from "react";
import { useLocation, userNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import api from "../utils/api";

// function deleteUser(id, name) {
//   if (window.confirm(`Are you sure you want to delete ${name}`)) {
//     fetch(`http://localhost:8080/user/delete/${id}`, {
//       method: "DELETE",
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         console.log(data.data);
//       });
//   } else {
//   }
// }

function Users() {
  // document.body.backgroundColor = "#6AD8B1";
  // document.body.style = "background: #B3FFCC";
  const location = useLocation();
  const [data, setData] = useState([]);

  async function deleteUser(id, name) {
    if (window.confirm(`Are you sure you want to delete ${name}`)) {
      await api.delete(`user/delete/${id}`);
      const { data } = await api.get("/user");
      setData(data);
    } else {
    }
  }

  //   Fetching users from the backend server
  useEffect(() => {
    api.get("/user").then(({ data }) => setData(data));
  }, []);
  try {
    const tok = localStorage.getItem("login");
    console.log(tok);
    const decoded = jwtDecode(tok);
    console.log(data);
    console.log(decoded);
    if (decoded.role == "admin") {
      return (
        <>
          <h1>List of Users currently signed up:</h1>
          <div
            className="homepage"
            style={{ display: "flex", alignItems: "center" }}
          >
            <table
              style={{
                width: 500,
                border: "1px solid",
                backgroundColor: "white",
              }}
            >
              <tr style={{ textAlign: "center", border: "1px solid" }}>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Delete</th>
              </tr>
              {data.map((dt) => (
                <tr style={{ textAlign: "center", border: "1px solid" }}>
                  <td>{dt.name}</td>
                  <td>{dt.email}</td>
                  <td>{dt.role}</td>
                  <td>
                    <FontAwesomeIcon
                      icon={faTrash}
                      onClick={() => deleteUser(dt._id, dt.name)}
                    />
                  </td>
                </tr>
              ))}
            </table>

            {/* {data.map((dt) => (
            <div>
              <h1>
                {dt.name}{" "}
                <FontAwesomeIcon
                  icon={faTrash}
                  onClick={() => deleteUser(dt._id, dt.name)}
                />
              </h1>
              <h3>{dt.role}</h3>
              <div>
              </div>
            </div>
          ))} */}
          </div>
        </>
      );
    } else {
      return (
        <div className="homepage">
          <h1>
            Sorry, you do not have the persmissions to get the list of users
          </h1>
        </div>
      );
    }
  } catch (error) {
    alert("Please login");
    window.location.href = "http://localhost:3000/login";
  }
}

export default Users;
