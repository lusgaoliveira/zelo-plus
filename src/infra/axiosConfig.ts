import axios from "axios";

const instance = axios.create({
  baseURL: "https://zeloplus-backend.onrender.com/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;