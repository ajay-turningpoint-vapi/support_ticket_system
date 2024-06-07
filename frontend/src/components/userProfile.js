import React, { Component } from "react";
import jwt_decode from "jwt-decode";
import { getProfile } from "./UserFunctions";

class userProfile extends Component {
  constructor() {
    super();
    this.state = {
      userName: "",
      department: "",
      emailID: "",
      role: "",
      createdStamp: "00",
      errors: {},
    };
  }

  componentDidMount() {
    const token = localStorage.usertoken;
    getProfile(token)
      .then((users) => {
        console.log(users.data.userName);
        this.setState({
          userName: users.data.userName,
          department: users.data.department,
          emailID: users.data.emailID,
          role: users.data.role,
          createdStamp: users.data.createdStamp,
        });
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }

  render() {
    return (
      <div className="container">
        <div className="jumbotron mt-5">
          <div className="col-sm-8 mx-auto">
            <h1 className="text-center">PROFILE</h1>
          </div>
          <table className="table col-md-6 mx-auto">
            <tbody>
              <tr>
                <td>User Name</td>
                <td>{this.state.userName}</td>
              </tr>
              <tr>
                <td>Department</td>
                <td>{this.state.department}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{this.state.emailID}</td>
              </tr>
              <tr>
                <td>role</td>
                <td>{this.state.role === 0 ? "User" : "Admin"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default userProfile;
