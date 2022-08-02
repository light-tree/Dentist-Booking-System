import axios from "axios";
import axiosClient from "./axiosClient";

class DoctorApi {
  PATH = "/doctor";
  getDoctorList = () => {
    const url = this.PATH + "/list";
    return axiosClient.get(url);
  };

  disableDoctor = async (id) => {
    const url = this.PATH + "/delete/" + id;
    return await axiosClient.get(url).then((res) => {
      console.log("Mess: ", res);
    });
  };

  //staff
  getDoctorByBranchId = (branchId) => {
    const url = "/doctor/" + branchId;
    const api = axiosClient.getUri().replace("/admin", "/staff") + url;
    console.log(api);
    return axiosClient.get(api);
  };

  addImageDoctor = (image) => {
    const url = "http://localhost:8080/rade/admin/doctor/add-image";
    // return axiosClient.post(url, image);
    return axios.post(url, image, {
      headers: {
        "Content-Type": "multipart/form-data",
        // "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("user")}`,
      },
    });
  };

  insertDoctor = (data) => {
    // const url = "/doctor/add";
    const url = "http://localhost:8080/rade/admin/doctor/add";
    return axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("user")}`,
      },
    });
    // return axiosClient.post(url, data);
  };

  getDoctorById(id) {
    const url = "/doctor/" + id;
    return axiosClient.get(url);
  }

  editDoctor(data) {
    const url = "http://localhost:8080/rade/admin/doctor/edit";
    return axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("user")}`,
      },
    });
  }

  deleteDoctor(id) {
    const url = "/doctor/delete/" + id;
    return axiosClient.get(url);
  }

  filterDoctor(data) {
    const url = "/doctor/filter";
    console.log(data);
    return axiosClient.post(url, data);
  }
}
const doctorApi = new DoctorApi();
export default doctorApi;
