import React from "react";
import { useEffect, useState } from "react";
import { Check, X, CircleCheck } from "lucide-react";
import { toast } from "react-toastify";
import api from "../api/axios";
import { getRole } from "../utils/auth";
import PageHeader from "../components/PageHeader";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";
import { getRepairs } from "../api/repairApi";
const ACTION_LABELS = {
  APPROVED: "duyệt",
  REJECTED: "từ chối",
  COMPLETED: "hoàn thành",
};

export default function Repairs() {
  const [repairs, setRepairs] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const role = getRole();
  const [fromDate, setFromDate] =  useState("");
  const [toDate, setToDate] =  useState("");


  const loadRepairs =async () => {
  const res =
    await getRepairs({
      fromDate,
      toDate,
    });

  setRepairs(
    res.data.data
  );
};




  const fetchData = async () => {
    try {
      const res = await api.get("/repairs");
      setRepairs(res.data.data || []);
    } catch {
      toast.error("Không tải được danh sách yêu cầu");
      setRepairs([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      setLoadingId(id);
      await api.put(`/repairs/${id}`, { status });
      toast.success("Cập nhật thành công");
      loadRepairs();
    } catch {
      toast.error("Cập nhật thất bại");
    } finally {
      setLoadingId(null);
    }
  };

  const confirmAction = (id, status) => {
    const label = ACTION_LABELS[status] || status;
    if (!window.confirm(`Xác nhận ${label} yêu cầu này?`)) return;
    updateStatus(id, status);
  };

  const isDisabled = (repair, action) => {
    if (repair.status === "COMPLETED" || repair.status === "REJECTED") {
      return true;
    }
    if (action === "APPROVED" && repair.status !== "PENDING") return true;
    if (action === "REJECTED" && repair.status !== "PENDING") return true;
    if (action === "COMPLETED" && repair.status === "PENDING") return true;
    return false;
  };

  if (!repairs) return <LoadingState />;

  return (
    <>
      <PageHeader
        eyebrow="Quản lý"
        title="Yêu cầu sửa chữa"
        description="Duyệt, từ chối hoặc đánh dấu hoàn thành các yêu cầu bảo trì thiết bị."
      />
      <div className="filter-bar">

  <input
    type="date"
    value={fromDate}
    onChange={(e) =>
      setFromDate(
        e.target.value
      )
    }
  />

  <input
    type="date"
    value={toDate}
    onChange={(e) =>
      setToDate(
        e.target.value
      )
    }
  />

  <button
    onClick={loadRepairs}
  >
    Lọc
  </button>

</div>

      {repairs.length === 0 ? (
        <EmptyState title="Không có yêu cầu sửa chữa" />
      ) : (
        <div className="repair-list">
          {repairs.map((r) => (
            <article key={r._id} className="repair-card">
              <div className="repair-card-body">
                <strong>
                  {r.deviceId?.deviceCode} — {r.deviceId?.name}
                </strong>
                <span>
                  Đơn vị: {r.unitId?.code} — {r.unitId?.name}
                </span>
                <p>Lý do: {r.reason}</p>
                <span>
                  Người gửi: {r.requestedBy?.username || "—"}
                  {r.resolvedAt &&
                    ` · ${new Date(r.resolvedAt).toLocaleString("vi-VN")}`}
                </span>
              </div>

              <div className="repair-card-actions">
                <StatusBadge status={r.status} type="repair" />

                {role === "ADMIN" && (
                  <div className="button-group">
                    <button
                      type="button"
                      className="action-btn action-btn--approve"
                      disabled={
                        isDisabled(r, "APPROVED") || loadingId === r._id
                      }
                      onClick={() => confirmAction(r._id, "APPROVED")}
                    >
                      <Check size={16} />
                      Duyệt
                    </button>

                    <button
                      type="button"
                      className="action-btn action-btn--reject"
                      disabled={
                        isDisabled(r, "REJECTED") || loadingId === r._id
                      }
                      onClick={() => confirmAction(r._id, "REJECTED")}
                    >
                      <X size={16} />
                      Từ chối
                    </button>

                    <button
                      type="button"
                      className="action-btn action-btn--complete"
                      disabled={
                        isDisabled(r, "COMPLETED") || loadingId === r._id
                      }
                      onClick={() => confirmAction(r._id, "COMPLETED")}
                    >
                      <CircleCheck size={16} />
                      Hoàn thành
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
