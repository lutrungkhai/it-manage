import React from "react";
import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  Monitor,
  CheckCircle2,
  Wrench,
  AlertTriangle,
  Archive,
} from "lucide-react";
import api from "../api/axios";
import PageHeader from "../components/PageHeader";
import LoadingState from "../components/LoadingState";
import { DEVICE_STATUS, DEVICE_PURPOSE, labelOf } from "../constants/labels";

const CHART_COLORS = ["#2563eb", "#f59e0b", "#ef4444", "#94a3b8", "#10b981"];

const STATS = [
  { key: "totalDevices", label: "Tổng thiết bị", tone: "tone-blue", icon: Monitor },
  { key: "activeDevices", label: "Hoạt động", tone: "tone-green", icon: CheckCircle2 },
  { key: "repairingDevices", label: "Đang sửa", tone: "tone-orange", icon: Wrench },
  { key: "brokenDevices", label: "Hỏng", tone: "tone-purple", icon: AlertTriangle },
  { key: "liquidatedDevices", label: "Thanh lý", tone: "tone-blue", icon: Archive },
];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("");
  const [purpose, setPurpose] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (purpose) params.append("purpose", purpose);

    api
      .get(`/dashboard?${params.toString()}`)
      .then((res) => setData(res.data.data))
      .catch(() => setData({}));
  }, [status, purpose]);

  if (!data) return <LoadingState />;

  const statusData = [
    { name: labelOf(DEVICE_STATUS, "ACTIVE"), value: data.activeDevices || 0 },
    { name: labelOf(DEVICE_STATUS, "REPAIRING"), value: data.repairingDevices || 0 },
    { name: labelOf(DEVICE_STATUS, "BROKEN"), value: data.brokenDevices || 0 },
    { name: labelOf(DEVICE_STATUS, "LIQUIDATED"), value: data.liquidatedDevices || 0 },
  ].filter((item) => item.value > 0);

  const typeData = (data.devicesByType || []).map((item) => ({
    ...item,
    label: item._id,
  }));

  const purposeData = (data.devicesByPurpose || []).map((item) => ({
    ...item,
    label: labelOf(DEVICE_PURPOSE, item._id),
  }));

  return (
    <>
      <PageHeader
        eyebrow="Tổng quan"
        title="Bảng điều khiển"
        description="Thống kê thiết bị theo trạng thái, loại và mục đích sử dụng."
      />

      <div className="filters filters--2">
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Tất cả trạng thái</option>
          {Object.entries(DEVICE_STATUS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <select value={purpose} onChange={(e) => setPurpose(e.target.value)}>
          <option value="">Tất cả mục đích</option>
          {Object.entries(DEVICE_PURPOSE).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="stat-grid stat-grid--5">
        {STATS.map(({ key, label, tone, icon: Icon }) => (
          <div key={key} className={`stat-card ${tone}`}>
            <div>
              <span>{label}</span>
              <strong>{data[key] ?? 0}</strong>
            </div>
            <div className="stat-icon">
              <Icon size={28} color="var(--tone)" />
            </div>
          </div>
        ))}
      </div>

      <div className="chart-grid">
        <section className="panel">
          <div className="panel-heading">
            <h2>Phân bố trạng thái</h2>
          </div>
          {statusData.length === 0 ? (
            <p className="muted-text">Không có dữ liệu</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {statusData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </section>

        <section className="panel">
          <div className="panel-heading">
            <h2>Thiết bị theo loại</h2>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={typeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#edf1f7" />
              <XAxis dataKey="label" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" name="Số lượng" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section className="panel panel--full">
          <div className="panel-heading">
            <h2>Thiết bị theo mục đích</h2>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={purposeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#edf1f7" />
              <XAxis dataKey="label" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" name="Số lượng" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>
      </div>
    </>
  );
}
