import React from "react";
import { DEVICE_STATUS, REPAIR_STATUS, labelOf } from "../constants/labels";

export default function StatusBadge({ status, type = "device" }) {
  const labels = type === "repair" ? REPAIR_STATUS : DEVICE_STATUS;
  const text = labelOf(labels, status);

  return (
    <span className={`status-badge status-${status}`}>{text}</span>
  );
}
