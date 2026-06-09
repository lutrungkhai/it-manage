import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import api from "../api/axios";
import PageHeader from "../components/PageHeader";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";
import {getRole, getUser} from "../utils/auth";
import {
  DEVICE_STATUS,
  DEVICE_TYPE,
  DEVICE_PURPOSE,
  labelOf,
} from "../constants/labels";

export default function Devices() {
  const [devices, setDevices] = useState(null);
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const role = getRole();
  const user = getUser(); 

  useEffect(() => {
  let url = "/devices";

  if (role === "UNIT") {
    url = `/devices?unitId=${user?.unitId}`;
  }

  api.get(url).then((res) => {
    setDevices(res.data.data);
  });
}, []);

  useEffect(() => {
    const delay = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(delay);
  }, [search]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (type) params.append("type", type);
    if (status) params.append("status", status);
    if (debouncedSearch) params.append("search", debouncedSearch);

    api
      .get(`/devices?${params.toString()}`)
      .then((res) => setDevices(res.data.data));
  }, [type, status, debouncedSearch]);

  const hasFilter = type || status || debouncedSearch;

  if (!devices) return <LoadingState />;

  return (
    <>
      <PageHeader
        eyebrow="Danh sách"
        title="Thiết bị"
        description="Tìm kiếm và lọc thiết bị theo mã, tên, loại và trạng thái."
      />

      <div className="filters filters--search">
        <div className="search-field">
          <Search size={18} />
          <input
            placeholder="Tìm theo mã, tên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Tất cả loại</option>
          {Object.entries(DEVICE_TYPE).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Tất cả trạng thái</option>
          {Object.entries(DEVICE_STATUS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {devices.length === 0 ? (
        <EmptyState
          title={
            hasFilter
              ? "Không tìm thấy thiết bị phù hợp"
              : "Không có thiết bị nào"
          }
          hint={
            hasFilter
              ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
              : undefined
          }
        />
      ) : (
        <div className="device-grid">
          {devices.map((d) => (
            <article key={d._id} className="device-card">
              <div className="device-card-header">
                <h3>
                  {d.deviceCode} — {d.name}
                </h3>
                <StatusBadge status={d.status} />
              </div>

              <div className="device-card-meta">
                <span>Loại: {labelOf(DEVICE_TYPE, d.type)}</span>
                <span>Mục đích: {labelOf(DEVICE_PURPOSE, d.purpose)}</span>
              </div>

              <Link to={`/devices/${d._id}`} className="link-action">
                Xem chi tiết
                <ArrowRight size={16} />
              </Link>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
