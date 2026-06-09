export const DEVICE_STATUS = {
  ACTIVE: "Hoạt động",
  REPAIRING: "Đang sửa chữa",
  BROKEN: "Hỏng",
  LIQUIDATED: "Thanh lý",
};

export const REPAIR_STATUS = {
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Từ chối",
  COMPLETED: "Hoàn thành",
};

export const DEVICE_TYPE = {
  DESKTOP: "Máy bàn",
  LAPTOP: "Laptop",
  PRINTER: "Máy in",
};

export const DEVICE_PURPOSE = {
  DLDC: "DLDC",
  QLVB: "QLVB",
  DKX: "Đăng ký xe",
  OTHER: "Khác",
};

export const ROLE_LABEL = {
  ADMIN: "Quản trị viên",
  UNIT: "Đơn vị",
};

export const labelOf = (map, key) => map[key] || key;
