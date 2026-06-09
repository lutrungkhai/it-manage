import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDevice } from "../api/deviceApi";
import {getUser} from "../utils/auth";
import {getUnits} from "../api/unitApi";
// Import các tùy chọn từ constants
import {
  DEVICE_TYPE_OPTIONS,
  DEVICE_PURPOSE_OPTIONS,
  DEVICE_STATUS_OPTIONS,
  DEVICE_OS_OPTIONS,
  MONITOR_BRAND_OPTIONS,
  MONITOR_SIZE_OPTIONS
} from "../constants/deviceOptions";


export default function CreateDevice() {
  const navigate = useNavigate();
  const currentUser = getUser();
  const [units, setUnits] = useState([]);
  const [unitName, setUnitName] = useState("");

  

  const [formData, setFormData] = useState({
  unitId: "",

  deviceCode: "",
  name: "",
  type: "PC",
  purpose: "QLVB",
  serialNumber: "",

  specifications: {
    cpu: "",
    ram: "",
    storage: [
    { type: "SSD", capacity: "" }
  ],
    os: "",
    monitor: "",
  },
});

useEffect(() => {
  loadUnits();
}, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSpecChange = (e) => {
    setFormData({
      ...formData,
      specifications: {
        ...formData.specifications,
        [e.target.name]: e.target.value,
      },
    });
  };
//hàm LoadUnis
const loadUnits = async () => {
  try {

    const res = await getUnits();

    const unitList =
      res.data.data || res.data;

    setUnits(unitList);

    if (
      currentUser?.role === "UNIT"
    ) {

      const unit = unitList.find(
        (u) =>
          u._id === currentUser.unitId
      );

      if (unit) {
        setUnitName(unit.name);
      }
    }

  } catch (error) {
    console.error(error);
  }
};


const handleStorageChange = (index, field, value) => {
  const newStorage = [...formData.specifications.storage];
  newStorage[index][field] = value;

  setFormData({
    ...formData,
    specifications: {
      ...formData.specifications,
      storage: newStorage,
    },
  });
};

const addStorage = () => {
  setFormData({
    ...formData,
    specifications: {
      ...formData.specifications,
      storage: [
        ...formData.specifications.storage,
        { type: "SSD", capacity: "" },
      ],
    },
  });
};

const removeStorage = (index) => {
  const newStorage = formData.specifications.storage.filter(
    (_, i) => i !== index
  );

  setFormData({
    ...formData,
    specifications: {
      ...formData.specifications,
      storage: newStorage,
    },
  });
};




  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createDevice(formData);

      alert("Thêm thiết bị thành công");

      navigate("/devices");
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Có lỗi xảy ra"
      );
    }
  };
// Chỉ admin mới chọn được đơn vị, người dùng đơn vị sẽ tự động gán vào thiết bị
  return (
    <div className="card">
      <h2>Thêm thiết bị</h2>

      <form onSubmit={handleSubmit}>
        <div>
        <div>
    
        <label>Đơn vị</label>

        {currentUser?.role === "ADMIN" ? (
        <select
            name="unitId"
            value={formData.unitId}
            onChange={handleChange}
            required
        >
        <option value="">Chọn đơn vị</option>
        {units.map((unit) => (
        <option key={unit._id} value={unit._id}>{unit.name}   </option>
      ))}
    </select>
  ) : (
    <input
      value={unitName}
      disabled
    />
  )}
</div>
          <label>Mã thiết bị</label>
          <input
            name="deviceCode"
            value={formData.deviceCode}
            onChange={(e) =>
              setFormData({
                ...formData,
                deviceCode: e.target.value.toUpperCase()
              })
            }
            placeholder="VD: PC-001"
          />
        </div>

        <div>
          <label>Tên thiết bị</label>

          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label>Loại thiết bị</label>
        <select name="type" value={formData.type} onChange={handleChange}>
                <option value="">-- Chọn loại thiết bị --</option>
                {DEVICE_TYPE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
        </div>

        <div>
          <label>Mục đích sử dụng</label>

          <select name="purpose" value={formData.purpose} onChange={handleChange}>
              <option value="">-- Chọn mục đích sử dụng --</option>
              {DEVICE_PURPOSE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
        </div>

        <div>
          <label>CPU</label>

          <input
            placeholder="VD: Intel i5-8500 / Ryzen 5 3600"
            name="cpu"
            value={formData.specifications.cpu}
            onChange={handleSpecChange}
          />
        </div>

        <div>
          <label>RAM</label>

          <select name="ram">
          <option>4GB</option>
          <option>8GB</option>
          <option>16GB</option>
          <option>32GB</option>
        </select>
        </div>

        <div>
  <h4>Ổ cứng</h4>

  {formData.specifications.storage.map((item, index) => (
    <div key={index} style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
      
      <select
        value={item.type}
        onChange={(e) =>
          handleStorageChange(index, "type", e.target.value)
        }
      >
        <option value="SSD">SSD</option>
        <option value="HDD">HDD</option>
      </select>

      <input
        placeholder="Dung lượng (VD: 256GB, 1TB)"
        value={item.capacity}
        onChange={(e) =>
          handleStorageChange(index, "capacity", e.target.value)
        }
      />

      <button
        type="button"
        onClick={() => removeStorage(index)}
      >
        X
      </button>
    </div>
  ))}

  <button type="button" onClick={addStorage}>
    + Thêm ổ cứng
  </button>
</div>

        <div>
          <label>Hệ điều hành</label>

          <select
            name="os"
            value={formData.specifications.os}
            onChange={handleSpecChange}
          >
            <option value="">-- Chọn hệ điều hành --</option>

            {DEVICE_OS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
            <label>Màn hình</label>

      <div style={{ display: "flex", gap: "10px" }}>

        <select
          name="monitorBrand"
          value={formData.specifications.monitor?.brand || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              specifications: {
                ...formData.specifications,
                monitor: {
                  ...formData.specifications.monitor,
                  brand: e.target.value,
                },
              },
            })
          }
        >
          <option value="">-- Hãng --</option>
          {MONITOR_BRAND_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          name="monitorSize"
          value={formData.specifications.monitor?.size || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              specifications: {
                ...formData.specifications,
                monitor: {
                  ...formData.specifications.monitor,
                  size: e.target.value,
                },
              },
            })
          }
        >
          <option value="">-- Kích thước --</option>
          {MONITOR_SIZE_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

      </div>
    </div>

        <button type="submit">
          Lưu thiết bị
        </button>
      </form>
    </div>
  );
}