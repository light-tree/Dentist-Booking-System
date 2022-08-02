import axiosClient from "./axiosClient";

// api/productApi.js
class ProductApi  {
  getAll = () => {
    const url = '/admin/branch/list';
    return axiosClient.get(url);
  };
  get = (id) => {
      const url = `/posts/${id}`;
      return axiosClient.get(url);
  }
}
const productApi = new ProductApi();
export default productApi;
