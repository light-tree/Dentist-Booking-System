import axios from "axios";
import axiosClient from "./axiosClient";

class DistrictApi {
  getDistrictList = async (provinceId) => {
    if (provinceId !== -1) {
      const url = "district/" + provinceId;
      const mainUrl = axiosClient.getUri().replace("admin", "") + url;
      console.log("url", mainUrl);
      // return await axiosClient.get(mainUrl);
      return await axios.get(mainUrl);
    }
    return null;
  };
}

const districtApi = new DistrictApi();
export default districtApi;
