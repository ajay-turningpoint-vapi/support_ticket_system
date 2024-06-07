import React, { Component } from "react";
import { getUsers, register } from "./UserFunctions"; // Assuming the getUsers function is defined in a separate file

class Register extends Component {
  constructor() {
    super();
    this.state = {
      userName: "",
      department: "",
      emailID: "",
      password: "",
      reportingManager: "Self",
      users: [], // Store users fetched from the server
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    // Fetch users when the component mounts
    getUsers()
      .then((users) => {
        this.setState({ users });
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const newUser = {
      userName: this.state.userName,
      department: this.state.department,
      emailID: this.state.emailID,
      password: this.state.password,
      reportingManager: this.state.reportingManager,
    };

    register(newUser).then((res) => {
      this.props.history.push(`/login`);
    });
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6 mt-5 mx-auto">
            <form noValidate onSubmit={this.onSubmit}>
              <h1 className="h3 mb-3 font-weight-normal">Register</h1>

              <div className="form-group">
                <label htmlFor="userName">Username</label>
                <input
                  type="text"
                  className="form-control"
                  name="userName"
                  required
                  placeholder="Enter your username"
                  value={this.state.userName}
                  onChange={this.onChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="department">Department</label>
                <select
                  className="form-control"
                  name="department"
                  required
                  value={this.state.department}
                  onChange={this.onChange}
                >
                  <option value="" disabled>
                    Please select
                  </option>
                  <option value="Admin">Admin</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="Sales">Sales</option>
                  <option value="IT">IT</option>
                  <option value="Service">Service</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="emailID">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  name="emailID"
                  placeholder="Enter email"
                  required
                  value={this.state.emailID}
                  onChange={this.onChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  required
                  className="form-control"
                  name="password"
                  placeholder="Enter password"
                  value={this.state.password}
                  onChange={this.onChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="reportingManager">Reporting Manager</label>
                <select
                  className="form-control"
                  name="reportingManager"
                  value={this.state.reportingManager}
                  onChange={this.onChange}
                >
                  <option value="Self">Self</option>
                  {this.state.users.map((user) => (
                    <option key={user._id} value={user.userName}>
                      {user.userName}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-lg btn-primary btn-block"
              >
                Register!
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;
