import React, { Component, useState } from "react";
import jwt_decode from "jwt-decode";
import "../App.css";
import Table from "@material-ui/core/Table";
import dummy from "../assests/user.jpg";
import { Dropdown, Badge, Modal, Spinner } from "react-bootstrap";
import { Button, Form } from "react-bootstrap";
import { ip } from "../services";
import axiosInstance from "../utils/axiosConfig";
import {
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@material-ui/core";
import moment from "moment";
class UserTicketShow extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      filteredData: [],
      show: false,
      message: "",
      id: "",
      search: "",
      role: 0,
      userId: "",
      img: "",
      file: null,
      loading: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
  }

  getUsersTicket = (status) => {
    let url = `${ip}/tickets/usersTickets`;
    if (status !== undefined) {
      url += `?status=${status}`;
    }

    return axiosInstance
      .get(url)
      .then((response) => {
        this.setState({ data: response.data, filteredData: response.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    this.filterData(e.target.value);
  }

  handleFileChange(e) {
    const file = e.target.files[0];
    this.setState({ file });
    console.log("Selected file:", file); // Log the selected file
  }

  handleClose = () => {
    this.setState({ show: false });
  };

  handleShow = (id) => {
    this.setState({ show: true, id: id });
  };

  handleAddMessage = (id, message) => {
    this.setState({ loading: true });
    this.addMessage(id, message)
      .then(() => {
        return this.getUsersTicket(); // Fetch the updated ticket data
      })
      .then(() => {
        this.setState({ loading: false, message: "", file: null });
      });
  };

  changeStatus(id, status) {
    console.log("status", status);
    return axiosInstance
      .put(`${ip}/tickets/${id}`, {
        status,
      })
      .then((response) => {
        this.getUsersTicket();
        return response.data;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  statusFilter(status) {
    this.getUsersTicket(status);
  }

  componentDidMount() {
    const token = localStorage.usertoken;
    const decoded = jwt_decode(token);
    this.getUsersTicket();
    this.setState({ role: decoded.role, userId: decoded._id });
  }

  addMessage(id, message) {
    const formData = new FormData();
    if (this.state.file) {
      formData.append("img", this.state.file);
    }
    formData.append("id", id);
    formData.append("messages", message);
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    return axiosInstance
      .post(`${ip}/tickets/addMessages`, formData)
      .then((response) => {
        this.setState({ data: response.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  filterData(status) {
    const filteredData = this.state.data.filter(
      (ticket) => ticket.status === status
    );
    this.setState({ filteredData });
  }

  statusName(status) {
    switch (status) {
      case 0:
        return (
          <Badge pill variant="primary">
            Opening
          </Badge>
        );
      case 1:
        return (
          <Badge pill variant="danger">
            Waiting
          </Badge>
        );
      case 2:
        return (
          <Badge pill variant="success">
            Closed
          </Badge>
        );
      default:
        return (
          <Badge pill variant="primary">
            Opening
          </Badge>
        );
    }
  }

  render() {
    return (
      <div className="container">
        <div className="jumbotron mt-5">
          <div className="col-sm-8 mx-auto">
            <h1 className="text-center">
              USER PAGE
              <br />
              TICKETS
            </h1>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <div className="mb-3">
              <Button
                variant="primary"
                className="mx-1"
                onClick={() => this.statusFilter(0)}
              >
                Opening
              </Button>
              <Button
                variant="danger"
                className="mx-1"
                onClick={() => this.statusFilter(1)}
              >
                Waiting
              </Button>
              <Button
                variant="success"
                className="mx-1"
                onClick={() => this.statusFilter(2)}
              >
                Closed
              </Button>
              <Button
                variant="dark"
                className="mx-1"
                onClick={() => this.getUsersTicket()}
              >
                ALL
              </Button>
            </div>
            <div className="col-xs-3 mb-3">
              <input
                className="form-control"
                style={{ float: "right" }}
                value={this.state.search}
                placeholder="Search TicketName"
                type="text"
                onChange={this.editSearchTerm}
              />
            </div>
          </div>
          <TableContainer component={Paper}>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell>Ticket ID</TableCell>
                  <TableCell>Ticket Desc.</TableCell>
                  <TableCell>Created By</TableCell>

                  <TableCell align="right">Status</TableCell>
                  <TableCell align="right">Change Status</TableCell>
                  <TableCell align="right">Add Message</TableCell>
                  <TableCell align="right">Created TimeStamp</TableCell>
                  <TableCell align="right">Updated TimeStamp</TableCell>
                  <TableCell align="right">Closing TimeStamp</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.data.length > 0 &&
                  this.state.filteredData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        #{index + 1}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.createdBy.userName}
                      </TableCell>

                      <TableCell align="right">
                        {this.statusName(row.status)}
                      </TableCell>
                      <TableCell align="right">
                        <Dropdown>
                          <Dropdown.Toggle
                            size="sm"
                            variant="success"
                            id="dropdown-basic"
                          >
                            Change Status
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item
                              onClick={() => this.changeStatus(row._id, 0)}
                            >
                              Opening
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => this.changeStatus(row._id, 1)}
                            >
                              Waiting
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => this.changeStatus(row._id, 2)}
                            >
                              Closed
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </TableCell>
                      <TableCell align="right">
                        <i
                          className="fa-solid fa-comment-dots fa-2xl text-primary"
                          onClick={() => this.handleShow(row._id)}
                        ></i>
                      </TableCell>
                      <TableCell>
                        {moment(row.createdTimeStamp).fromNow()}
                      </TableCell>
                      <TableCell>
                        {moment(row.updatedTimeStamp).fromNow()}
                      </TableCell>
                      <TableCell>
                        {row.closingTimeStamp === null
                          ? "Not Closed"
                          : moment(row.closingTimeStamp).fromNow()}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Messages</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.loading ? ( // Show loader when loading state is true
              <div className="d-flex justify-content-center align-items-center">
                <Spinner animation="border" role="status">
                  <span className="sr-only">Loading...</span>
                </Spinner>
              </div>
            ) : (
              <>
                <div className="comments-section">
                  {this.state.data.length > 0 &&
                    this.state.data
                      .filter((ticket) => ticket._id === this.state.id)[0]
                      ?.messages.map((message, index) => (
                        <div key={index} className="col-md-12">
                          <div
                            className="card"
                            style={{ marginBottom: "10px" }}
                          >
                            <div className="card-body">
                              <div className="d-flex flex-start align-items-center">
                                <img
                                  className="rounded-circle shadow-1-strong me-3 mr-2"
                                  src={dummy}
                                  alt="avatar"
                                  width="60"
                                  height="60"
                                />
                                <div>
                                  <h6 className="fw-bold text-primary mb-1">
                                    {message.userName}
                                  </h6>
                                  <p className="text-muted small mb-0">
                                    Shared publicly -{" "}
                                    {moment(message.date).fromNow()}
                                  </p>
                                </div>
                              </div>

                              <p className="mt-3 mb-4 pb-2">{message.text}</p>

                              {message.img && (
                                <div className="mt-3 mb-4 pb-2">
                                  <img
                                    src={`http://localhost:5000/public/${message.img}`}
                                    alt={`attachment`}
                                    style={{ maxWidth: "30%", height: "auto" }}
                                  />
                                </div>
                              )}

                              <div className="small d-flex justify-content-start">
                                <a
                                  href="#!"
                                  className="d-flex align-items-center me-3"
                                ></a>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                </div>
                <div
                  className="card-footer py-3 border-0"
                  style={{ backgroundColor: "#f8f9fa" }}
                >
                  <div className="d-flex flex-start w-100">
                    <img
                      className="rounded-circle shadow-1-strong me-3 mr-2"
                      src={dummy}
                      alt="avatar"
                      width="40"
                      height="40"
                    />
                    <div data-mdb-input-init className="form-outline w-100">
                      <textarea
                        className="form-control"
                        id="textAreaExample"
                        rows="3"
                        style={{ background: "#fff" }}
                        name="message"
                        placeholder="Add Message..."
                        value={this.state.message}
                        onChange={this.handleChange}
                        required
                      ></textarea>

                      <label>
                        <input
                          type="file"
                          class="hidden"
                          name="file"
                          onChange={this.handleFileChange}
                          style={{ display: "none" }}
                        />

                        <i class="fa-solid fa-paperclip fa-lg mt-3"></i>
                      </label>
                    </div>
                  </div>
                  <div className="float-end mt-2 pt-1">
                    <Button
                      variant="primary"
                      size="sm"
                      className="mr-3"
                      onClick={() =>
                        this.handleAddMessage(this.state.id, this.state.message)
                      }
                    >
                      Add Message
                    </Button>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={this.handleClose}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default UserTicketShow;
