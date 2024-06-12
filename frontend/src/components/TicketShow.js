import React, { Component } from "react";
import jwt_decode from "jwt-decode";
import AdminTicketShow from "./AdminTicketShow";
import UserTicketShow from "./UserTicketShow";

class ShowTickets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      whoLoggedIn: null,
    };
  }

  componentDidMount() {
    const token = localStorage.usertoken;
    if (token) {
      const decoded = jwt_decode(token);
      const whoLoggedIn = decoded.role;
      this.setState({ whoLoggedIn });
    }
  }

  render() {
    const { whoLoggedIn } = this.state;
    return (
      <div>{whoLoggedIn === 1 ? <AdminTicketShow /> : <UserTicketShow />}</div>
    );
  }
}

export default ShowTickets;
