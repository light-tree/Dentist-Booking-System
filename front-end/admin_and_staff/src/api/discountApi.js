import axios from "axios";
import axiosClient from "./axiosClient";
const token = sessionStorage.getItem("user");
class DiscountApi {
  BASE_URL = "/discount";
  getDiscountList = () => {
    const url = this.BASE_URL + "/list";
    return axiosClient.get(url);
  };
  insert = async (data) => {
    const url = this.BASE_URL + "/add";
    return await axiosClient.post(url, data).then((res) => {
      return res;
    });
  };
  disableDiscount = async (id) => {
    const url = this.BASE_URL + "/delete/" + id;
    return await axiosClient.get(url).then((res) => {
      console.log(res);
    });
  };

  filterDiscount(data) {
    const url = "/discount/filter";
    console.log("data", data);
    return axiosClient.post(url, data);
  }

  getDiscountById(id) {
    const url = "http://localhost:8080/rade/admin/discount/" + id;
    return axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        if (error.response.status === 401) {
          window.location.replace("/auth/login-page");
        }
      });
  }

  updateDiscount(data) {
    const url = "http://localhost:8080/rade/admin/discount/edit";
    return axios
      .post(url, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        if (error.response.status === 401) {
          window.location.replace("/auth/login-page");
        }
      });
  }
}

const discountApi = new DiscountApi();
export default discountApi;
