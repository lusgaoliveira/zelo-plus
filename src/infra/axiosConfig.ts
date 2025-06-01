import axios from "axios";

const instance = axios.create({
  baseURL: "http://10.0.2.2:8080/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;