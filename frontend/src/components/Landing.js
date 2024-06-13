import React, { Component } from "react";
import {
  Chart,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css"; // Assuming you have a Landing.css for custom styles

// Register the necessary components
Chart.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

class Landing extends Component {
  render() {
    // Data for the Pie Chart (ticket statuses)
    const pieData = {
      labels: ["Pending", "Closed", "Waiting"],
      datasets: [
        {
          data: [10, 20, 5], // Example data: replace with your own data
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
          hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        },
      ],
    };

    // Data for the Bar Chart (tickets in a month)
    const barData = {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"], // Example labels: replace with your own data
      datasets: [
        {
          label: "Total Tickets",
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          borderWidth: 1,
          hoverBackgroundColor: "rgba(75,192,192,0.6)",
          hoverBorderColor: "rgba(75,192,192,1)",
          data: [65, 59, 80, 81], // Example data: replace with your own data
        },
      ],
    };

    // Data for the Users Chart
    const usersData = {
      labels: ["January", "February", "March", "April", "May", "June"],
      datasets: [
        {
          label: "Number of Users",
          backgroundColor: "rgba(153, 102, 255, 0.6)",
          borderColor: "rgba(153, 102, 255, 1)",
          borderWidth: 1,
          hoverBackgroundColor: "rgba(153, 102, 255, 0.8)",
          hoverBorderColor: "rgba(153, 102, 255, 1)",
          data: [150, 200, 180, 220, 170, 210], // Example data: replace with your own data
        },
      ],
    };

    // Ticket counts (example data: replace with your own data)
    const ticketCounts = {
      pending: 10,
      closed: 20,
      waiting: 5,
    };

    // Recent tickets data (example data: replace with your own data)
    const recentTickets = [
      { id: 1, subject: "Login Issue", status: "Pending", date: "2024-06-10" },
      {
        id: 2,
        subject: "Password Reset",
        status: "Closed",
        date: "2024-06-09",
      },
      {
        id: 3,
        subject: "Unable to access account",
        status: "Waiting",
        date: "2024-06-08",
      },
      {
        id: 4,
        subject: "Error on dashboard",
        status: "Closed",
        date: "2024-06-07",
      },
      {
        id: 5,
        subject: "Page not loading",
        status: "Pending",
        date: "2024-06-06",
      },
    ];

    return (
      <div className="container">
        <div className="jumbotron mt-5">
          <div className="col-sm-12 mx-auto">
            <h1 className="text-center">
              DASHBOARD
            </h1>
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-md-4 mb-4">
            <div className="card text-white bg-info">
              <div className="card-body">
                <h2 className="text-center card-title">Pending Tickets</h2>
                <p className="text-center display-4">{ticketCounts.pending}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card text-white bg-success">
              <div className="card-body">
                <h2 className="text-center card-title">Closed Tickets</h2>
                <p className="text-center display-4">{ticketCounts.closed}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card text-white bg-warning">
              <div className="card-body">
                <h2 className="text-center card-title">Waiting Tickets</h2>
                <p className="text-center display-4">{ticketCounts.waiting}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-md-6 mb-4">
            <div className="card">
              <div className="card-body">
                <h2 className="text-center card-title">Ticket Statuses</h2>
                <Pie data={pieData} />
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="card">
              <div className="card-body">
                <h2 className="text-center card-title">
                  Total Tickets in a Month
                </h2>
                <Bar data={barData} />
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-md-12 mb-4">
            <div className="card">
              <div className="card-body">
                <h2 className="text-center card-title">Number of Users</h2>
                <Bar data={usersData} />
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-md-12 mb-4">
            <div className="card">
              <div className="card-body">
                <h2 className="text-center card-title">Recent Tickets</h2>
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Subject</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTickets.map((ticket) => (
                      <tr key={ticket.id}>
                        <td>{ticket.id}</td>
                        <td>{ticket.subject}</td>
                        <td>{ticket.status}</td>
                        <td>{ticket.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Landing;
