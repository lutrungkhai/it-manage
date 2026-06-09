import React from "react";
import { useEffect, useState } from "react";

import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../api/userApi";

import { getUnits } from "../../api/unitApi";

function Users() {
  const [users, setUsers] = useState([]);
  const [units, setUnits] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "UNIT",
    unitId: "",
  });

  useEffect(() => {
    fetchUsers();
    fetchUnits();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getUsers();

      setUsers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUnits = async () => {
    try {
      const res = await getUnits();

      setUnits(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      username: "",
      password: "",
      role: "UNIT",
      unitId: "",
    });

    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        const payload = {
          role: formData.role,
          unitId: formData.unitId,
        };

        if (formData.password.trim()) {
          payload.password = formData.password;
        }

        await updateUser(editingId, payload);
      } else {
        await createUser(formData);
      }

      resetForm();
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra");
    }
  };

  const handleEdit = (user) => {
    setEditingId(user._id);

    setFormData({
      username: user.username,
      password: "",
      role: user.role,
      unitId: user.unitId?._id || "",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Bạn có chắc muốn xóa user này?"
    );

    if (!confirmed) return;

    try {
      await deleteUser(id);

      fetchUsers();
    } catch (error) {
      console.error(error);
      alert("Xóa thất bại");
    }
  };

  return (
    <div className="container">
      <h2>Quản lý User</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Tên đăng nhập</label>

          <input
            type="text"
            value={formData.username}
            disabled={editingId}
            onChange={(e) =>
              setFormData({
                ...formData,
                username: e.target.value,
              })
            }
            required
          />
        </div>

        <div>
          <label>Mật khẩu</label>

          <input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({
                ...formData,
                password: e.target.value,
              })
            }
            required={!editingId}
          />
        </div>

        <div>
          <label>Vai trò</label>

          <select
            value={formData.role}
            onChange={(e) =>
              setFormData({
                ...formData,
                role: e.target.value,
              })
            }
          >
            <option value="UNIT">UNIT</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>

        <div>
          <label>Đơn vị</label>

          <select
            value={formData.unitId}
            onChange={(e) =>
              setFormData({
                ...formData,
                unitId: e.target.value,
              })
            }
          >
            <option value="">
              Chọn đơn vị
            </option>

            {units.map((unit) => (
              <option
                key={unit._id}
                value={unit._id}
              >
                {unit.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">
          {editingId ? "Cập nhật" : "Thêm User"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={resetForm}
          >
            Hủy
          </button>
        )}
      </form>

      <hr />

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Unit</th>
            <th>Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="4">
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user._id}>
                <td>{user.username}</td>

                <td>{user.role}</td>

                <td>
                  {user.unitId?.name || "-"}
                </td>

                <td>
                  <button
                    onClick={() =>
                      handleEdit(user)
                    }
                  >
                    Sửa
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(user._id)
                    }
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Users;