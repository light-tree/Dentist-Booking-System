import axios from "axios";

const API = "http://localhost:8080/rade/admin/branch/list";
// axios.interceptors.request.use(
//   (config) => {
//     config.headers.Authorization = `Bearer ${localStorage.getItem(
//       "accessToken"
//     )}`;
//     return config;
//   },
//   (error) => Promise.reject(error)
// );
// let config = {
//   headers: {
//     Authorization:
//       "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIwOTg3NjU0MzIxLCQyeSQxMCQuMkJUWDNZVDFGcE9uZTYydkRTVkp1V2tCaDRETlhLZWdhazJYNS5ieVNvNUVBZC42Y2N2VyIsInJvbGUiOiJST0xFX0FETUlOIiwiaXNzIjoiQ29kZUphdmEiLCJpYXQiOjE2NTQxODM0MzgsImV4cCI6MTY1NDE4NDYzOH0.eeEjRk9bNNW4tFq4MzUiMJhV1AnMgjytw8vHR_MLwDFCeAguqNhhF7615jQD3Rk2LTph4vlWFdC-ayJY2vpTsQ",
//   },
// };

// const config = {
//   headers: {
//     Authorization: `Bearer Token ${localStorage.getItem("accessToken")}`,
//   },
// };

// let instance = axios.create({
//   Authorization: `Bearer Token ${localStorage.getItem("accessToken")}`,
// });
const data = {
  appointmentDTO: {
    branch_id: "1",
    name: "bao",
    phone: "0123456789",
    date: "2022-05-30",
    time: "11:00",
  },

  serviceIdList: ["4", "5"],
  doctorIdList: ["3", "0"],
};

const token = localStorage.getItem("accessToken");
class pushAppointment {
  postData() {
    //   .post(API, data, {
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   })
    //   .catch(console.error());

    console.log("accessToken -> " + token);
    // return axios({
    //   method: "get",
    //   url: API,
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //     "Access-Control-Allow-Origin": "*",
    //     "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
    //     "Access-Control-Allow-Headers":
    //       "Content-Type, Authorization, X-Requested-With",
    //   },

    // })
    // axios
    //   .get(API, {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //       "Access-Control-Allow-Origin": "*",
    //       "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
    //       "Access-Control-Allow-Headers":
    //         "Content-Type, Authorization, X-Requested-With",
    //     },
    //     // })
    //     // fetch(API, {
    //     //   headers: { Authentication: `Bearer ${token}` },
    //   })
    //   .then(function (response) {
    //     alert("Đặt lịch thành công!!!");
    //     console.log(response);
    //   });
    // .catch(function (error) {
    //   console.log("Error push: " + error);
    // });

    // axios.interceptors.request.use(function (config) {
    //   config.headers.Authorization = `Bearer ${token}`;

    //   return config;
    // });
    return axios({
      method: "get",
      url: API,
      headers: {
        Authorization: `Bearer ${token}`,
        // "Access-Control-Allow-Origin": "*",
        // "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
        // "Access-Control-Allow-Headers":
        //   "Content-Type, Authorization, X-Requested-With",
      },
    }).then((res) => console.log(res));
  }
}

export default new pushAppointment();
