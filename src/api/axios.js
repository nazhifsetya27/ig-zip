import axios from "axios";
export const api = axios.create({
  baseURL: "https://mock-api-instagram.glitch.me/",
});
