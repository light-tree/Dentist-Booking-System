import axios from "axios";
import { idText } from "typescript";
import axiosClient from "./axiosClient";

const token = sessionStorage.getItem("user");
class ServiceTypeApi {
  BASE_URL = "/service_type";
  getAll = () => {
    const url = this.BASE_URL + "/list";
    return axiosClient.get(url);
  };
  insert = (data) => {
    const url = "http://localhost:8080/rade/admin/service_type/add";

    return axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  };

  getServiceTypeById(id) {
    const url = "http://localhost:8080/rade/admin/service_type/" + id;
    return axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  editServiceType(data) {
    const url = "http://localhost:8080/rade/admin/service_type/edit";
    return axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
const serviceTypeApi = new ServiceTypeApi();
export default serviceTypeApi;
