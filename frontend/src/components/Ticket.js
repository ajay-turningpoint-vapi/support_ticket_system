import React, { Component } from "react";
import axios from "axios";
import { getUsers } from "./UserFunctions";
import { ip } from "../services";
class Ticket extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      messages: "",
      status: "",
      img: "",
      file: "",
      imagePreviewUrl: "",
      assignToUsers: [],
      users: [], // To store the list of users
      priority: "", // New state for priority
      TAT: "", // New state for TAT
      errors: {},
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this._handleImageChange = this._handleImageChange.bind(this);

    this.handlePriorityChange = this.handlePriorityChange.bind(this);
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

  _handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result,
      });
    };

    reader.readAsDataURL(file);
  }

  onSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("img", this.state.file);
    formData.append("name", this.state.name);

    formData.append("messages", JSON.stringify(this.state.messages));
    formData.append("assignToUsers", JSON.stringify(this.state.assignToUsers));
    formData.append("priority", this.state.priority);
    formData.append("TAT", this.state.TAT);

    axios({
      method: "post",
      url: `${ip}/tickets`,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NWFiOGZjMDAzNTJjM2VkOGYwMDQ5ZCIsInJvbGUiOjEsImlhdCI6MTcxNzIzMzg5MywiZXhwIjoxNzE5ODI1ODkzfQ.TaijGJQf3SBqA2oSuBMfgnJvTJzjDMfRPtclGGpQwrA`,
      },
    })
      .then((response) => {
        console.log(response);
        // Handle success, e.g., redirect or clear form
      })
      .catch((error) => {
        console.error(error);
        // Handle error, e.g., show error message
      });
  }

  render() {
    const { imagePreviewUrl, users, priority, TAT } = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = <img src={imagePreviewUrl} alt="Image Preview" />;
    } else {
      $imagePreview = (
        <div className="previewText">Please select an Image for Preview</div>
      );
    }

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
              <label htmlFor="name">Ticket Name</label>
              <input
                type="text"
                id="name"
                className="form-control"
                placeholder="Enter ticket name"
                value={this.state.name}
                onChange={this.onChange}
                name="name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="messages">Messages</label>
              <textarea
                id="messages"
                className="form-control"
                name="messages"
                rows="2"
                placeholder="Enter Messages"
                value={this.state.messages}
                onChange={this.onChange}
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="assignToUsers">Assign To Users</label>
              <select
                className="form-control"
                name="assignToUsers"
                multiple
                value={this.state.assignToUsers}
                onChange={this.onChange}
              >
                <option value="Self">Self</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.userName}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                className="form-control"
                name="priority"
                value={priority}
                onChange={this.handlePriorityChange}
              >
                <option value="" disabled>
                  Please select
                </option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
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
            <div className="form-group">
              <label htmlFor="imageUpload">Upload Image</label>
              <input
                type="file"
                className="form-control-file"
                id="imageUpload"
                onChange={this._handleImageChange}
              />
              <small className="form-text text-muted">
                Upload an image for the ticket.
              </small>
            </div>
            <div className="form-group text-center">{$imagePreview}</div>
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
