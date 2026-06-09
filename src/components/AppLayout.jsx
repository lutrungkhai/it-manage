import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Monitor,
  Wrench,
  LogOut,
  Server,
  Users,
  Building2,
} from "lucide-react";

import { getRole, getUser } from "../utils/auth";
import { ROLE_LABEL } from "../constants/labels";

import {
  getPendingRepairCount,
} from "../api/repairApi";

export default function AppLayout() {

  const navigate = useNavigate();

  const role = getRole();
  //const user = getUser();
  const user = JSON.parse(localStorage.getItem("user"));

  const [
    pendingRepairCount,
    setPendingRepairCount,
  ] = useState(0);

  useEffect(() => {
    loadPendingRepairCount();
  }, []);

  const loadPendingRepairCount =
    async () => {

      try {

        const res =
          await getPendingRepairCount();

        setPendingRepairCount(
          res.data.count || 0
        );

      } catch (error) {

        console.error(
          "Load repair count error:",
          error
        );

      }
    };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const NAV_ITEMS = [
    {
      to: "/",
      icon: LayoutDashboard,
      label: "Tổng quan",
      end: true,
    },

    {
      to: "/devices",
      icon: Monitor,
      label: "Thiết bị",
      end: true,
    },

    {
      to: "/devices/create",
      icon: Monitor,
      label: "Thêm thiết bị",
    },

    {
      to: "/repairs",
      icon: Wrench,
      label: "Sửa chữa",
    },

    {
      to: "/admin/units",
      icon: Building2,
      label: "Đơn vị",
      adminOnly: true,
    },

    {
      to: "/admin/users",
      icon: Users,
      label: "Người dùng",
      adminOnly: true,
    },
  ];

  const visibleNav = NAV_ITEMS.filter(
    (item) =>
      !item.adminOnly ||
      role === "ADMIN"
  );

  return (
    <div className="app-shell">

      <aside className="sidebar">

        <div className="brand-block">

          <img
            src="/logo-ca.png"
            alt="Logo Công an"
            className="brand-logo"
          />

          <div>
            <div className="brand-title">
              IT Device Management
            </div>

            <span className="brand-subtitle">
              CAT TUYÊN QUANG
            </span>
          </div>

        </div>

        <p className="nav-heading">
          Menu
        </p>

        <nav className="nav-group">

          {visibleNav.map(
            ({
              to,
              icon: Icon,
              label,
              end,
            }) => (

              <NavLink
                key={to}
                to={to}
                end={end}
                className={({
                  isActive,
                }) =>
                  `nav-item ${
                    isActive
                      ? "active"
                      : "muted"
                  }`
                }
              >
                <Icon size={20} />

                <span>
                  {to === "/repairs"
                    ? pendingRepairCount >
                      0
                      ? `Sửa chữa (${pendingRepairCount})`
                      : "Sửa chữa"
                    : label}
                </span>

              </NavLink>

            )
          )}

        </nav>

        <div className="admin-nav">

          <button
            type="button"
            className="nav-item muted"
            onClick={logout}
          >
            <LogOut size={20} />
            <span>
              Đăng xuất
            </span>
          </button>

        </div>

      </aside>

      <div className="main-area">

        <header className="topbar">

          <div>

            <div className="topbar-title">
              Hệ thống quản lý thiết bị CNTT
            </div>

            <div className="topbar-subtitle">
              Theo dõi, bảo trì và sửa chữa thiết bị
            </div>

          </div>

          <div className="user-pill">

            <div className="avatar">
    {user?.unitId?.code?.charAt(0) || "U"}
  </div>

  <div>
    <div>
  <strong>
    {user?.role === "ADMIN"
      ? "Quản trị hệ thống"
      : user?.unitId?.name}
  </strong>


    
</div>

    <span>
      {user?.unitId?.code || user?.role}
    </span>
  </div>

          </div>

        </header>

        <main className="content">
          <Outlet />
        </main>

      </div>

    </div>
  );
}