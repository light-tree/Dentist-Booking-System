import axios from "axios";
const API_GET_SERVICE_OF_SERVICETYPE = "http://localhost:8080/rade/service/";
const token = localStorage.getItem("accessToken");
class ServiceList {
  getSericeType(id) {
    return axios.get(API_GET_SERVICE_OF_SERVICETYPE + id);
  }
}
export default new ServiceList();
