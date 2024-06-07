import { ip } from "../services";
import axiosInstance from "../utils/axiosConfig";

// export const register = (newUser) => {
//   return axiosInstance
//     .post(`${ip}/users/register`, {
//       first_name: newUser.first_name,
//       last_name: newUser.last_name,
//       email: newUser.email,
//       password: newUser.password,
//       role: newUser.role,
//     })
//     .then((response) => {
//       console.log("Registered");
//     });
// };
export const register = (newUser) => {
  return axiosInstance
    .post(`${ip}/users/register`, {
      userName: newUser.userName,
      department: newUser.department,
      emailID: newUser.emailID,
      password: newUser.password,
      role: newUser.role,
      reportingManager: newUser.reportingManager,
    })
    .then((response) => {
      console.log("Registered");
    });
};

export const login = (user) => {
  return axiosInstance
    .post(`${ip}/users/login`, {
      emailID: user.emailID,
      password: user.password,
    })
    .then((response) => {
      localStorage.setItem("usertoken", response.data.token);
      return response.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getProfile = (token) => {
  return axiosInstance
    .get(`${ip}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      console.log(response);
      return response;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getUsers = (user) => {
  return axiosInstance
    .get(`${ip}/users/getReportingMangers`, {
      // headers: { Authorization: ` ${this.getToken()}` }
    })
    .then((response) => {
      console.log(response);
      return response.data;
    })
    .catch((err) => {
      console.log(err);
    });
};
