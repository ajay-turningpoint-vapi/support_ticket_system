import axios from "axios";
import { ip } from "../services";
import axiosInstance from "../utils/axiosConfig";

export const ticket = (newTicket) => {
  return axiosInstance
    .post(`${ip}tickets/addTickets`, {
      name: newTicket.name,
      img: this.state.file,
      content: newTicket.content,
      messages: newTicket.messages,
    })
    .then((response) => {
      console.log("New ticket success");
    });
};

export const getTicket = (test) => {
  return axiosInstance
    .get(`${ip}/tickets/getTicketAll`, {
      //headers: { Authorization: ` ${this.getToken()}` }
    })
    .then((response) => {
      console.log(response);
      return response.data;
    })
    .catch((err) => {
      console.log(err);
    });
};
