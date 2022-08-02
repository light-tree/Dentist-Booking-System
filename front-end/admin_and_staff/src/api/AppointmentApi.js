import axios from "axios";
import axiosClient from "./axiosClient";
const token = sessionStorage.getItem("user");
class AppointmentApi {
  getAppointList = () => {
    const url = "/appointment/1";
    return axiosClient.get(url);
  };

  getAppointListForAdmin = async (data) => {
    console.log("getAppointListForStaff", data);
    const url = "http://localhost:8080/rade/admin/appointment/filter/";
    return await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("user")}`,
      },
    });
  };
  getAppointListForStaff = async (data) => {
    console.log("getAppointListForStaff", data);
    const url = "http://localhost:8080/rade/staff/appointment/filter/";
    return await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("user")}`,
      },
    });
  };

  getAppointmentDetailForStaff = (data) => {
    const url = "/appointment/find/" + data;
    const mainUrl = axiosClient.getUri().replace("admin", "staff") + url;
    console.log(mainUrl);
    return axiosClient.post(mainUrl);
  };

  getAppointmentDetailForAdmin = (data) => {
    const url = "/appointment/find/" + data;
    return axiosClient.post(url);
    // const url = "http://localhost:8080/rade/admin/appointment/find/" + data;
    // console.log("url", url);
    // return axios.post(url, {
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${sessionStorage.getItem("user")}`,
    //   },
    // });
  };

  checkMarkDone = (id) => {
    const url = "/appointment/markdone/" + id;
    const mainUrl = axiosClient.getUri().replace("admin", "staff") + url;
    console.log(mainUrl);
    return axiosClient.post(mainUrl);
  };

  deleteAppointmentForStaff = (data) => {
    const url = "/appointment/cancel";
    const mainUrl = axiosClient.getUri().replace("admin", "staff") + url;
    console.log(mainUrl);
    return axiosClient.post(mainUrl, data);
  };

  getHistoryAppointmentForStaff(phone) {
    const url = "http://localhost:8080/rade/staff/appointment/history";
    // const url = "/appointment/history";
    // return axiosClient.post(url, phone);
    return axios.post(url, phone, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  submitAddNoteForAppointment(data) {
    const url = "http://localhost:8080/rade/staff/appointment/note";
    return axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getReportForAdminByMonth(month, year) {
    const url =
      "http://localhost:8080/rade/admin/appointment/month/" +
      month +
      "/" +
      year;
    return axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getReportForAdminByYear(year) {
    const url = "http://localhost:8080/rade/admin/appointment/year/" + year;
    return axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
const appointmentApi = new AppointmentApi();
export default appointmentApi;
