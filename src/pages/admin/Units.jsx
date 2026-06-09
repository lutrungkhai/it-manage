import React from "react";
import { useEffect, useState } from "react";
import {
  getUnits,
  createUnit,
  updateUnit,
  deleteUnit,
} from "../../api/unitApi";

function Units() {
  const [units, setUnits] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    isActive: true,
  });

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      const res = await getUnits();
      setUnits(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setEditingId(null);

    setFormData({
      code: "",
      name: "",
      description: "",
      isActive: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateUnit(editingId, formData);
      } else {
        await createUnit(formData);
      }

      resetForm();
      fetchUnits();
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra");
    }
  };

  const handleEdit = (unit) => {
    setEditingId(unit._id);

    setFormData({
      code: unit.code,
      name: unit.name,
      description: unit.description || "",
      isActive: unit.isActive,
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Bạn có chắc muốn xóa đơn vị này?"
    );

    if (!confirmed) return;

    try {
      await deleteUnit(id);
      fetchUnits();
    } catch (error) {
      console.error(error);
      alert("Xóa thất bại");
    }
  };

  return (
    <div className="container">
      <h2>Quản lý Đơn vị</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Mã đơn vị</label>
          <input
            value={formData.code}
            onChange={(e) =>
              setFormData({
                ...formData,
                code: e.target.value,
              })
            }
            required
          />
        </div>

        <div>
          <label>Tên đơn vị</label>
          <input
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
            required
          />
        </div>

        <div>
          <label>Mô tả</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                description: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label>Trạng thái</label>

          <select
            value={formData.isActive}
            onChange={(e) =>
              setFormData({
                ...formData,
                isActive:
                  e.target.value === "true",
              })
            }
          >
            <option value={true}>
              Hoạt động
            </option>

            <option value={false}>
              Ngừng hoạt động
            </option>
          </select>
        </div>

        <button type="submit">
          {editingId
            ? "Cập nhật"
            : "Thêm đơn vị"}
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
            <th>Mã</th>
            <th>Tên đơn vị</th>
            <th>Mô tả</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {units.length === 0 ? (
            <tr>
              <td colSpan="5">
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            units.map((unit) => (
              <tr key={unit._id}>
                <td>{unit.code}</td>

                <td>{unit.name}</td>

                <td>
                  {unit.description}
                </td>

                <td>
                  {unit.isActive
                    ? "Hoạt động"
                    : "Ngừng"}
                </td>

                <td>
                  <button
                    onClick={() =>
                      handleEdit(unit)
                    }
                  >
                    Sửa
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(unit._id)
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

export default Units;