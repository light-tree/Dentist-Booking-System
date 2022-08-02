// api/axiosClient.js
import axios from "axios";
import queryString from "query-string";
import authApi from "./AuthApi";
// Set up default config for http requests here

// Please have a look at here `https://github.com/axios/axios#request-
//config` for the full list of configs

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,

  headers: {
    "Content-Type": "application/json",
    Accept: "multipart/form-data",
    "Access-Control-Allow-Origin": "http://localhost:3000",
    "Access-Control-Allow-Methods": "Get, PUT, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    // "Authorization": "Bearer " + token,
  },
  paramsSerializer: (params) => queryString.stringify(params),
});
axiosClient.interceptors.request.use(
  async (config) => {
    const currentUser = sessionStorage.getItem("user");
    if (currentUser) {
      config.headers = {
        ...axiosClient.headers,
        Authorization: "Bearer " + currentUser,
      };
      return config;
    }
    // return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
// const cors = require('cors');
// var express = require('express');
// var app = express();
// app.use(cors());
axiosClient.interceptors.response.use(
  (response) => {
    console.log("++++", response);
    if (response && response.data) {
      return response.data;
    }
    return response.status;
  },
  (error) => {
    console.log("error here", error);
    if (error.response.status == 401) {
      authApi.logoutz();
    }
    return error;
  }
);
export default axiosClient;
