import React from "react";
import { useState } from "react";
import { Server, LogIn } from "lucide-react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    setError("");
    setLoading(true);

    const res = await api.post("/auth/login", {
      username,
      password,
    });

    const { token, user } = res.data;

    // lưu token
    localStorage.setItem("token", token);

    // lưu user (QUAN TRỌNG)
    localStorage.setItem("user", JSON.stringify(user));

    // điều hướng theo role
    if (user.role === "ADMIN") {
      navigate("/");
    } else {
      navigate("/devices");
    }

  } catch (err) {
    const message =
      err.response?.data?.message ||
      (err.code === "ERR_NETWORK"
        ? "Không kết nối được server. Hãy chạy backend (port 5000)."
        : "Đăng nhập thất bại");

    setError(message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="login-screen">
      <form className="login-panel" onSubmit={handleLogin}>
        <div className="login-brand">
          <div className="brand-mark large">
            <Server size={28} />
          </div>
          <div>
            <h1>Đăng nhập hệ thống</h1>
            <p>Quản lý thiết bị CNTT — IT Equipment Management</p>
          </div>
        </div>

        {error && <div className="form-error">{error}</div>}

        <label>
          Tên đăng nhập
          <input
            placeholder="Nhập tên đăng nhập"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </label>

        <label>
          Mật khẩu
          <input
            placeholder="Nhập mật khẩu"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>

        <button type="submit" className="primary-button" disabled={loading}>
          <span className="btn-content">
            <LogIn size={18} />
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </span>
        </button>
      </form>
    </div>
  );
}
