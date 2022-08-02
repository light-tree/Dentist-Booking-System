import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import axios from "axios";
import { toast } from "react-toastify";
import { Col, Row } from "reactstrap";
const API_GET_ACCOUNT_PROFILE =
  "http://localhost:8080/rade/patient/account/profile?phone=";
const token = localStorage.getItem("accessToken");
const phone = localStorage.getItem("phone");
const gender = [
  {
    id: 1,
    value: "Nam",
  },
  {
    id: 2,
    value: "Nữ",
  },
];
export default function Profile() {
  const [account, setAccount] = useState([]);
  const navigate = useNavigate();

  const getAccount = async () => {
    console.log("getAccount");
    const data = {
      phone: phone,
    };
    const result = await axios
      .get(API_GET_ACCOUNT_PROFILE + phone, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        if (result.status === 401) {
          toast.warn("Bạn không có quyền truy cập");
        }
      });
    console.log(result.data.district.province.name);
    if (result.data) {
      setAccount(result?.data);
    }
  };

  useEffect(() => {
    getAccount();
  }, []);
  const FormInfo = (props) => (
    <form className="form-profile">
      <FormText name="name" value={account.fullName} label="Tên: " />
      <FormText name="phone" value={account.phone} label="Số điện thoại: " />
      <FormText
        name="dayOfBirth"
        value={account.dateOfBirth}
        label="Ngày sinh: "
      />

      <FormText
        name="gender"
        value={account.gender === 1 ? "Nam" : "Nữ"}
        label="Giới tính: "
      />
      <FormText name="Email" value={account.email} label="Email: " />
      <FormText
        name="distric"
        value={account.district?.name}
        label="Quận/Huyện: "
      />
      <FormText
        name="province"
        value={account.district?.province?.name}
        label="Tỉnh/Thành phố: "
      />
      <FormButton />
    </form>
  );

  const FormText = (props) => (
    <div className="profile-item">
      <label>{props.label}</label>
      <input
        name={props.name}
        value={props.value}
        onChange={(e) => changeInfo(e)}
      ></input>
    </div>
  );

  const FormButton = () => (
    <Row className="justify-content-around" lg="auto">
      <Col lg={3} className="justify-content-start">
        <Row lg={12}>
          <button
            type="button"
            onClick={() => {
              navigate("/user/profile/update");
            }}
          >
            Thay đổi
          </button>
        </Row>
      </Col>

      <Col lg={3} className="justify-content-end">
        <Row lg={12} className="text-center">
          <button type="button" onClick={() => navigate("/")}>
            Hủy
          </button>
        </Row>
      </Col>
    </Row>
  );

  //fucntion

  const changeInfo = (e) => {
    var name = e.target.name;
    var value = e.target.value;
  };

  return (
    <div className="pb-5">
      <Row className="header-profile">
        <h3>Thông tin của bạn </h3>
      </Row>

      <FormInfo />
    </div>
  );
}
