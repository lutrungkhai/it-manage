import axios from "./axios";
export const getRepairs =
  (params) =>
    axios.get(
      "/repairs",
      { params }
    );
export const getPendingRepairCount =
  () =>
    axios.get(
      "/repairs/pending-count"
    );