import axios from "axios";

const instance = axios.create({
  baseURL: "https://zeloplus-backend-production.up.railway.app/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;