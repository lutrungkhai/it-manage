import axios from "./axios";

export const getUnits = () => axios.get("/units");

export const createUnit = (data) =>
  axios.post("/units", data);

export const updateUnit = (id, data) =>
  axios.put(`/units/${id}`, data);

export const deleteUnit = (id) =>
  axios.delete(`/units/${id}`);