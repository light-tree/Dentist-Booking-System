import axios from "axios";
import React, { Component } from "react";
import axiosClient from "./axiosClient";

const token = sessionStorage.getItem("user");
class AccountApi {
  GetAccountByRoleIdAndStatus(roleId, status, phone) {
    const url = "/account/list/" + roleId + "/" + status + "/phone=" + phone;
    console.log(url);
    return axiosClient.get(url);
  }

  AddStaff(data) {
    const url = "/account/register";
    return axiosClient.post(url, data);
  }

  getAccountByPhone(phone) {
    const url = "/" + phone;
    return axiosClient.get(url);
  }
  getAccountByID(id) {
    const url = "/account/" + id;
    return axiosClient.get(url);
  }

  banAccount(phone) {
    const url = "/account/ban";
    return axiosClient.post(url, phone);
  }

  unbanAccount(phone) {
    const url = "/account/unban";
    return axiosClient.post(url, phone);
  }

  getAccount(phone) {
    let url = "http://localhost:8080/rade/staff/account/profile?phone=" + phone;
    if (window.location.href.includes("admin")) {
      url = "http://localhost:8080/rade/admin/account/profile?phone=" + phone;
    } else {
      url = "http://localhost:8080/rade/staff/account/profile?phone=" + phone;
    }
    return axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  checkAccount(data) {
    let URL_CHECK_ACCOUNT_UPDATE =
      "http://localhost:8080/rade/patient/account/confirmPassword";
    if (window.location.href.includes("admin")) {
      URL_CHECK_ACCOUNT_UPDATE =
        "http://localhost:8080/rade/patient/account/confirmPassword";
    } else {
      URL_CHECK_ACCOUNT_UPDATE =
        "http://localhost:8080/rade/patient/account/confirmPassword";
    }
    return axios.post(URL_CHECK_ACCOUNT_UPDATE, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  updateAccount(data) {
    let URL_UPDATE_PROFILE =
      "http://localhost:8080/rade/staff/account/profile/edit";
    if (window.location.href.includes("admin")) {
      URL_UPDATE_PROFILE =
        "http://localhost:8080/rade/admin/account/profile/edit";
    } else {
      URL_UPDATE_PROFILE =
        "http://localhost:8080/rade/staff/account/profile/edit";
    }
    return axios.post(URL_UPDATE_PROFILE, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export default new AccountApi();
