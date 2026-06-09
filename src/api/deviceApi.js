import axios from "./axios";

export const getDevices = () =>
  axios.get("/devices");

export const createDevice = (data) =>
  axios.post("/devices", data);