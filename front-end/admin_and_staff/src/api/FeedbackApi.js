import axiosClient from "./axiosClient";

class FeedbackApi {
  getFeedback(data) {
    const url = "/feedback/filter";
    const tmpUrl = axiosClient.getUri().replace("/admin", "/staff") + url;
    return axiosClient.post(tmpUrl, data);
  }

  approveFeedback(id) {
    const url = "/feedback/approve/" + id;
    const tmpUrl = axiosClient.getUri().replace("/admin", "/staff") + url;
    return axiosClient.post(tmpUrl);
  }

  disapproveFeedback(id) {
    const url = "/feedback/disapprove/" + id;
    const tmpUrl = axiosClient.getUri().replace("/admin", "/staff") + url;
    return axiosClient.post(tmpUrl);
  }

  //admin
  getFeedbackForAdmin(data) {
    const url = "/feedback/filter";
    return axiosClient.post(url, data);
  }

  approveFeedbackForAdmin(id) {
    const url = "/feedback/approve/" + id;
    return axiosClient.post(url);
  }

  disapproveFeedbackForAdmin(id) {
    const url = "/feedback/disapprove/" + id;
    return axiosClient.post(url);
  }
}

export default new FeedbackApi();
