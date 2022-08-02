import axios from "axios";
import axiosClient from "./axiosClient";

class ServiceApi {
  SERVICE_PATH = "/service";
  getAll = (service_type_id) => {
    const url = "/service/" + service_type_id;
    return axiosClient.get(url);
  };
  getServiceList = () => {
    const url = this.SERVICE_PATH + "/list";
    return axiosClient.get(url);
  };

  getServiceListForStaff = () => {
    const url = this.SERVICE_PATH + "/list";
    const tmp = axiosClient.getUri().replace("/admin", "/staff") + url;
    console.log(tmp);
    return axiosClient.get(tmp);
  };
  getService = (service_id) => {
    const url = "/service/" + service_id;
    return axiosClient.get(url);
  };
  insertService = (data, image) => {
    const urlService = this.SERVICE_PATH + "/add-service";
    const urlImage = this.SERVICE_PATH + "/add-image?image";
    axiosClient
      .post(urlImage, image)
      .then((res) => {
        console.log("Image: ", res);
      })
      .then(() => {
        return axiosClient.post(urlService, data).then((res) => {
          console.log("response: ", res);
        });
      });
  };

  addImageService = (image) => {
    const url = "http://localhost:8080/rade/admin/service/add-image";
    // return axiosClient.post(url, image);
    return axios.post(url, image, {
      headers: {
        "Content-Type": "multipart/form-data",
        // "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("user")}`,
      },
    });
  };

  insertService = (data) => {
    // const url = "/doctor/add";
    const url = "http://localhost:8080/rade/admin/service/add-service";
    return axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("user")}`,
      },
    });
    // return axiosClient.post(url, data);
  };

  disableService = async (id) => {
    const url = this.SERVICE_PATH + "/delete/" + id;
    return await axiosClient.get(url).then((res) => {
      console.log(res);
    });
  };
  editService = async (data) => {
    // const url = this.SERVICE_PATH + "/edit";
    const url = "http://localhost:8080/rade/admin/service/edit";
    // return await axiosClient.post(url, data).then((res) => {
    //   console.log("edit: ", res);
    //   console.log("service url", res.url);
    // });
    return axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("user")}`,
      },
    });
  };

  filterService(data) {
    const url = "/service/filter";
    return axiosClient.post(url, data);
  }
}

const serviceApi = new ServiceApi();
export default serviceApi;
