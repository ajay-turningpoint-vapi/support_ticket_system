import React, { Component } from "react";
import axios from "axios";
import { getUsers } from "./UserFunctions";
import { ip } from "../services";
import axiosInstance from "../utils/axiosConfig";
class Ticket extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      messages: "",
      status: "",
      assignToUsers: [],
      users: [], // To store the list of users
      priority: "", // New state for priority
      TAT: "", // New state for TAT
      errors: {},
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handlePriorityChange = this.handlePriorityChange.bind(this);
  }
  validateForm() {
    const { name, assignToUsers, priority, TAT } = this.state;
    const errors = {};

    if (!name) errors.name = "Name is required";
    if (assignToUsers.length === 0)
      errors.assignToUsers = "Assign to Users is required";
    if (!priority) errors.priority = "Priority is required";
    if (!TAT) errors.TAT = "TAT is required";

    return errors;
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
    const { name, value, type, selectedOptions } = e.target;
    if (type === "select-multiple") {
      const values = Array.from(selectedOptions, (option) => option.value);
      this.setState({ [name]: values });
    } else {
      this.setState({ [name]: value });
    }
  }

  handlePriorityChange(e) {
    const priority = e.target.value;
    let TAT;
    if (priority === "High") {
      TAT = 1;
    } else if (priority === "Medium") {
      TAT = 2;
    } else if (priority === "Low") {
      TAT = 3;
    }
    this.setState({ priority, TAT });
  }

  onSubmit(e) {
    e.preventDefault();
    const errors = this.validateForm();
    if (Object.keys(errors).length > 0) {
      this.setState({ errors });
      return;
    }
    const { name, assignToUsers, priority, TAT } = this.state;
    const ticketData = {
      name,
      assignToUsers,
      priority,
      TAT,
    };

    console.log("ticketData", ticketData);

    axiosInstance({
      method: "post",
      url: `${ip}/tickets`,
      data: ticketData,
    })
      .then((response) => {
        this.setState({
          name: "",
          messages: "",
          status: "",
          assignToUsers: [],
          priority: "",
          TAT: "",
          errors: {},
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    const { users, priority, TAT, name, assignToUsers, errors } = this.state;

    return (
      <div className="container">
        <div className="jumbotron mt-5">
          <div className="col-sm-8 mx-auto">
            <h1 className="text-center">ADD TICKET</h1>
          </div>
          <form
            encType="multipart/form-data"
            noValidate
            onSubmit={this.onSubmit}
          >
            <div className="form-group">
              <label htmlFor="name">Ticket Desc.</label>
              <input
                type="text"
                id="name"
                className="form-control"
                placeholder="Enter ticket desc."
                value={this.state.name}
                onChange={this.onChange}
                name="name"
                required
              />{" "}
              {errors.name && <div style={{ color: "red" }}>{errors.name}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="assignToUsers">Assign To Users</label>
              <select
                className="form-control"
                name="assignToUsers"
                required
                multiple
                value={this.state.assignToUsers}
                onChange={this.onChange}
              >
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.userName}
                  </option>
                ))}
              </select>{" "}
              {errors.assignToUsers && (
                <div style={{ color: "red" }}>{errors.assignToUsers}</div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                className="form-control"
                name="priority"
                value={priority}
                required
                onChange={this.handlePriorityChange}
              >
                <option value="" disabled>
                  Please select
                </option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>{" "}
                {errors.priority && (
                  <div style={{ color: "red" }}>{errors.priority}</div>
                )}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="TAT">Turnaround Time (TAT)</label>
              <input
                type="text"
                id="TAT"
                className="form-control"
                placeholder="TAT"
                value={TAT}
                readOnly
              />
            </div>

            <div className="form-group text-center">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Ticket;
