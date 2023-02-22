import axios from "axios";
const { API } = require("../config");

export default axios.create({
  baseURL: API.baseURL,
});

export const apiPrivate = axios.create({
  baseURL: API.baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
