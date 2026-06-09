import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Send, Cpu } from "lucide-react";
import { toast } from "react-toastify";
import api from "../api/axios";
import { getRole } from "../utils/auth";

import PageHeader from "../components/PageHeader";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";
import "../styles/deviceDetail.css";


import {
  DEVICE_TYPE,
  DEVICE_PURPOSE,
  labelOf,
} from "../constants/labels";

import {
  DEVICE_LOG_LABEL,
  DEVICE_LOG_STYLE,
} from "../constants/deviceLogAction";

export default function DeviceDetail() {
  const { id } = useParams();

  const [device, setDevice] = useState(null);
  const [repairs, setRepairs] = useState([]);
  const [logs, setLogs] = useState([]);

  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const [tab, setTab] = useState("info");
  const role = getRole();

  const OS_LABEL = {
  WINDOWS_10: "Windows 10",
  WINDOWS_11: "Windows 11",
};

  // =====================
  // LOAD DATA
  // =====================
  const loadData = async () => {
    setLoading(true);
    setLoadingLogs(true);

    try {
      const [deviceRes, repairsRes, logsRes] = await Promise.all([
        api.get(`/devices/${id}`),
        api.get(`/repairs/device/${id}`),
        api.get(`/devices/${id}/logs`),
      ]);

      setDevice(deviceRes.data.data);
      setRepairs(repairsRes.data.data || []);
      setLogs(logsRes.data.data || []);
    } catch (err) {
      toast.error("Không tải được dữ liệu");
    } finally {
      setLoading(false);
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  // =====================
  // CREATE REPAIR
  // =====================
  const sendRepairRequest = async () => {
    if (!reason.trim()) {
      toast.warning("Vui lòng nhập lý do");
      return;
    }

    try {
      await api.post("/repairs", { deviceId: id, reason });
      toast.success("Đã gửi yêu cầu");
      setReason("");
      loadData();
    } catch (err) {
      toast.error("Gửi thất bại");
    }
  };

  // =====================
  // GROUP LOGS
  // =====================
  const groupLogsByDate = (logs) => {
    return logs.reduce((acc, log) => {
      const date = new Date(log.createdAt).toISOString().split("T")[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push(log);
      return acc;
    }, {});
  };

  if (loading) return <LoadingState />;
  if (!device) return <EmptyState title="Không tìm thấy thiết bị" />;

  const specs = device.specifications;

  const groupedLogs = groupLogsByDate(logs);
  const sortedDates = Object.keys(groupedLogs).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  return (
    <>
      {/* HEADER */}
      <PageHeader
        eyebrow="Chi tiết thiết bị"
        title={device.name}
        description={device.deviceCode}
      >
        <Link to="/devices">
          <ArrowLeft size={16} /> Quay lại
        </Link>
      </PageHeader>

      {/* TABS */}
      <div className="tab-bar">
          <button
            className={`tab-item ${tab === "info" ? "active" : ""}`}
            onClick={() => setTab("info")}
          >
            Thông tin
          </button>

          <button
            className={`tab-item ${tab === "repairs" ? "active" : ""}`}
            onClick={() => setTab("repairs")}
          >
            Sửa chữa
          </button>

          <button
            className={`tab-item ${tab === "logs" ? "active" : ""}`}
            onClick={() => setTab("logs")}
          >
            Nhật ký
          </button>
        </div>

      {/* INFO */}
      {tab === "info" && (
        <div className="panel">
          <div>Mã: {device.deviceCode}</div>
          <div>Tên: {device.name}</div>
          <div>Loại: {labelOf(DEVICE_TYPE, device.type)}</div>
          <div>Mục đích: {labelOf(DEVICE_PURPOSE, device.purpose)}</div>
          <div>
            Trạng thái: <StatusBadge status={device.status} />
          </div>
        </div>
      )}

      {/* REPAIRS */}
      {tab === "repairs" && (
        <div className="panel">
          {repairs.length === 0 ? (
            <EmptyState title="Không có dữ liệu" />
          ) : (
            repairs.map((r) => (
              <div key={r._id} className="border-b py-2">
                <b>{r.reason}</b>
                <div>{r.requestedBy?.username}</div>
                <StatusBadge status={r.status} />
              </div>
            ))
          )}
        </div>
      )}

      {/* LOGS TIMELINE */}
      {tab === "logs" && (
  <div className="panel">
    {loadingLogs ? (
      <div>Đang tải...</div>
    ) : logs.length === 0 ? (
      <EmptyState title="Không có nhật ký" />
    ) : (
      sortedDates.map((date) => (
        <div key={date} className="mb-6">

          <div className="text-sm font-bold mb-3 text-gray-500">
            {new Date(date).toLocaleDateString("vi-VN")}
          </div>

          <div className="timeline">

            {groupedLogs[date].map((log) => {
              const type = log.action;

              const dotClass =
                type === "CREATE"
                  ? "dot-create"
                  : type.includes("REPAIR")
                  ? "dot-repair"
                  : type === "UPDATE"
                  ? "dot-update"
                  : type === "COMPLETED_REPAIR"
                  ? "dot-success"
                  : type === "REJECTED_REPAIR"
                  ? "dot-error"
                  : "";

              return (
                <div key={log._id} className="timeline-item">

                  <div className={`timeline-dot ${dotClass}`} />

                  <div className="timeline-time">
                    {new Date(log.createdAt).toLocaleTimeString("vi-VN")}
                  </div>

                  <div className="timeline-title">
                     {DEVICE_LOG_STYLE?.[log.action]?.icon && (
                        <span className="mr-1">
                          {DEVICE_LOG_STYLE[log.action].icon}
                        </span>
                      )}

                      {DEVICE_LOG_LABEL[log.action] || log.action}
                  </div>

                  <div className="timeline-desc">
                    {log.description}
                  </div>

                  <div className="timeline-user">
                    {log.userId?.username || "Hệ thống"} (
                    {log.userId?.role || "SYSTEM"})
                  </div>

                </div>
              );
            })}

          </div>
        </div>
      ))
    )}
  </div>
)}

      {/* DETAIL */}
      <div className="detail-grid">
        <section className="panel">
          <div className="panel-heading">
            <h2>Thông tin thiết bị</h2>
            <StatusBadge status={device.status} />
          </div>

          <div className="info-grid">
            <span>Mã</span>
            <strong>{device.deviceCode}</strong>

            <span>Tên</span>
            <strong>{device.name}</strong>

            <span>Loại</span>
            <strong>{labelOf(DEVICE_TYPE, device.type)}</strong>

            <span>Mục đích</span>
            <strong>{labelOf(DEVICE_PURPOSE, device.purpose)}</strong>

            <span>Đơn vị</span>
            <strong>
              {device.unitId
                ? `${device.unitId.code} - ${device.unitId.name}`
                : "—"}
            </strong>
          </div>

          {specs && (
            <div className="spec-block">
              <div className="spec-title">
                <Cpu size={16} /> Cấu hình
              </div>

              <div className="info-grid">
                <span>CPU</span>
                <strong>{specs.cpu || "—"}</strong>

                <span>RAM</span>
                <strong>{specs.ram || "—"}</strong>

                <span>Ổ cứng</span>
                <strong>
                  {Array.isArray(specs.storage) && specs.storage.length > 0
                    ? specs.storage.map((s, i) => (
                        <div key={i}>
                          {s.type} - {s.capacity}
                        </div>
                      ))
                    : "—"}
                </strong>

                <span>Hệ điều hành</span>
                <strong>{OS_LABEL[specs.os] || specs.os || "—"}</strong>

                <span>Màn hình</span>
                <strong>
                  {specs.monitor && typeof specs.monitor === "object"
                    ? `${specs.monitor.brand || ""} ${specs.monitor.size || ""}`.trim()
                    : specs.monitor || "—"}
                </strong>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* REPAIR FORM */}
      {role === "UNIT" && (
        <div className="panel">
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Lý do"
          />
          <button onClick={sendRepairRequest}>
            <Send size={16} /> Gửi
          </button>
        </div>
      )}
    </>
  );
}