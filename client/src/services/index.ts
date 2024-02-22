import axios from "axios";
import { config } from "../../config";

const API_KEY = config.server.API_KEY;
const BASE_URL = config.server.BASE_URL;

export const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 2000,
  headers: {
    // Authorization: `Bearer ${API_KEY}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
