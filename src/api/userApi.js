import axios from "./axios";

export const getUsers = () => {
  return axios.get("/users");
};

export const createUser = (data) => {
  return axios.post("/users", data);
};

export const updateUser = (id, data) => {
  return axios.put(`/users/${id}`, data);
};

export const deleteUser = (id) => {
  return axios.delete(`/users/${id}`);
};
