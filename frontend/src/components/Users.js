import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import api from "../utils/api";

function Users() {
  const location = useLocation();
  const [data, setData] = useState([]);
  const history = useNavigate();

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
    const decoded = jwtDecode(tok);
    if (decoded.role === "admin") {
      return (
        <>
          <h1 style={{ textAlign: "center", margin: "20px" }}>Users</h1>
          <div
            className="homepage"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "10px",
            }}
          >
            <table
              style={{
                maxWidth: "100%",
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
    history("/login");
  }
}

export default Users;
