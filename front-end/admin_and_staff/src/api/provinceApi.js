import axiosClient from "./axiosClient";

class ProvinceApi {
  getProvinceList = async () => {
    const url = "province";
    const mainUrl = axiosClient.getUri().replace("admin", "") + url;
    return await axiosClient.get(mainUrl);
  };
}

const provinceApi = new ProvinceApi();
export default provinceApi;
