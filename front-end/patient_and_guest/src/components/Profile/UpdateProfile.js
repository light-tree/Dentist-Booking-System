import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Button,
  Col,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import Validate from "../signIn/Validate";
import validator from "validator";
const API_GET_ACCOUNT_PROFILE =
  "http://localhost:8080/rade/patient/account/profile?phone=";
const API_GET_PROVINCE = "http://localhost:8080/rade/province";
const API_GET_DISTRICT = "http://localhost:8080/rade/district/";
const URL_CHECK_ACCOUNT_UPDATE =
  "http://localhost:8080/rade/patient/account/confirmPassword";
const URL_UPDATE_PROFILE =
  "http://localhost:8080/rade/patient/account/profile/edit";
const token = localStorage.getItem("accessToken");
const phone = localStorage.getItem("phone");
const genders = [
  {
    id: 1,
    value: "Nam",
  },
  {
    id: 2,
    value: "Nữ",
  },
];
export default function UpdateProfile() {
  const [account, setAccount] = useState([]);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [district, setDistrict] = useState(null);
  const [province, setProvince] = useState(null);
  const [gender, setGender] = useState(null);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [modalConfirm, setModalConfirm] = useState(false);

  const [passwordValidate, setPasswordValidate] = useState(false);
  const [newPasswordValidate, setNewPasswordValidate] = useState(false);
  const [confirmValidate, setConfirmValidate] = useState(false);
  const [emailValidate, setEmailValidate] = useState(false);
  const [nameValidate, setNameValidate] = useState(false);
  const [dateOfBirthValidate, setDateOfBirthValidate] = useState(false);
  const [districtValidate, setDistrictValidate] = useState(false);
  const [provinceValidate, setProvinceValidate] = useState(false);
  const [genderValidate, setGenderValidate] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);

  //
  const [provinceList, setProvinceList] = useState([]);
  const [districtList, setDistrictList] = useState([]);

  let navigate = useNavigate();
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
      setName(result.data.fullName);
      setEmail(result.data.email);
      setGender(result.data.gender);
      setDistrict(result.data.district.id);
      setProvince(result.data.district.province.id);
      setDateOfBirth(result.data.dateOfBirth);
    }
  };

  const getMaxDate = (separator = "") => {
    let newDate = new Date();
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear() - 15;

    return `${year}${separator}-${
      month < 10 ? `0${month}` : `${month}`
    }-${separator}${date}`;
  };
  const getMinDate = (separator = "") => {
    let newDate = new Date();
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear() - 80;

    return `${year}${separator}-${
      month < 10 ? `0${month}` : `${month}`
    }-${separator}${date}`;
  };

  const getProvince = async () => {
    const result = await axios.get(API_GET_PROVINCE);
    console.log("province", result.data);
    if (result.data) {
      setProvinceList(result.data);
    }
  };

  const getDistrict = async () => {
    if (province.length === 0) {
      console.log("không có province");
      return;
    }
    const result = await axios.get(API_GET_DISTRICT + province);

    if (result.data) {
      setDistrictList(result.data);
    }
  };

  useEffect(() => {
    getAccount();
    getProvince();
  }, []);

  useEffect(() => {
    getDistrict();
  }, [province]);

  const validateAll = () => {
    let flag = true;

    if (!Validate.validateLength(password, 8, 32)) {
      flag = false;
      setPasswordValidate(true);
    }
    if (newPassword.length > 0) {
      if (!Validate.validateLength(newPassword, 8, 32)) {
        flag = false;
        setNewPasswordValidate(true);
      } else {
        setNewPasswordValidate(false);
      }
      if (!Validate.validateLength(confirm, 8, 32)) {
        flag = false;
        setConfirmValidate(true);
      } else if (!Validate.compare(newPassword, confirm)) {
        setConfirmValidate(true);
        flag = false;
      } else {
        setConfirmValidate(false);
      }
    }

    if (!Validate.validateLength(name, 8, 32)) {
      flag = false;
      setNameValidate(true);
    } else {
      setNameValidate(false);
    }
    if (email.length > 0) {
      if (!validator.isEmail(email)) {
        setEmailValidate(true);
        flag = false;
      } else {
        setEmailValidate(false);
      }
    }
    var dob = new Date(dateOfBirth);
    var now = new Date();
    if (dateOfBirth.length === 0) {
      setDateOfBirthValidate(true);
      flag = false;
      console.log(1);
    } else if (
      dob.getFullYear() < now.getFullYear() - 80 ||
      dob.getFullYear() >= now.getFullYear() - 15
    ) {
      console.log(2);
      setDateOfBirthValidate(true);
      flag = false;
    } else {
      setDateOfBirthValidate(false);
    }
    if (gender == -1) {
      setGenderValidate(true);
      flag = false;
    } else {
      setGender(false);
    }
    if (province == -1) {
      setProvinceValidate(true);
      flag = false;
    } else {
      setProvinceValidate(false);
    }
    if (district == -1) {
      setDistrictValidate(true);
      flag = false;
    } else {
      setDistrictValidate(false);
    }
    return flag;
  };

  const clickChangeProfile = () => {
    if (validateAll()) {
      updateProfile();
    } else {
      toast.error("Thay đổi thông tin không thành công ");
    }
  };

  const updateProfile = async () => {
    var dataCheckUpdate = {
      phone: account.phone,
      password: password,
    };
    console.log("adata", dataCheckUpdate);
    // const result = await axios
    //   .post(URL_CHECK_ACCOUNT_UPDATE, dataCheckUpdate, {
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${token}`,
    //     },
    //   })
    //   .then((res) => {
    const dataUpdate = {
      fullName: name,
      confirmPassword: password,
      password: newPassword.length > 0 ? newPassword : password,
      dateOfBirth: dateOfBirth,
      gender: gender ? 1 : 2,
      districtId: district,
      phone: account.phone,
      email: email,
    };
    console.log("dataUpdate", dataUpdate);
    axios
      .post(URL_UPDATE_PROFILE, dataUpdate, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
        navigate("/user/profile");
      })
      .catch((error) => {
        if (error.response.status === 406) {
          toast.error("Sai mật khẩu. Vui lòng nhập lại");
        }
      });
    // })
    // .catch((error) => {
    //   if (error.response.status === 406) {
    //     toast.error("Sai mật khẩu. Vui lòng nhập lại");
    //   }
    // });
  };

  return (
    <div
      style={{ backgroundColor: `white`, padding: `20px`, paddingTop: `0px` }}
    >
      <Row className="header-profile">
        <h3>Chỉnh sửa thông tin của bạn</h3>
      </Row>
      <div>
        {/* Phone  */}
        <Row className="justify-content-center">
          <Col md={2} className="text-start">
            <label style={{ color: `black`, textAlign: `left` }}>
              Số điện thoại:{" "}
            </label>
          </Col>
          <Col md={5}>
            <Input
              style={{
                width: `100%`,
                border: `1px solid gray`,
                borderRadius: `4px`,
              }}
              value={account.phone}
            />
          </Col>
        </Row>

        {/* password  */}
        <Row className="justify-content-center">
          <Col md={2} className="text-start">
            <label style={{ color: `black`, textAlign: `left` }}>
              Mật khẩu cũ{" "}
              <span style={{ color: `red`, fontSize: `25px` }}>*</span>:
            </label>
          </Col>
          <Col md={5}>
            <Input
              maxLength={30}
              style={{
                width: `100%`,
                border: `1px solid gray`,
                borderRadius: `4px`,
              }}
              type="password"
              value={password}
              onChange={(e) => {
                if (!Validate.validateLength(e.target.value, 8, 32)) {
                  setPasswordValidate(true);
                } else {
                  setPasswordValidate(false);
                }
                setPassword(e.target.value);
              }}
            />
          </Col>
          {passwordValidate ? (
            <Col md={7} className=" text-end">
              <span style={{ color: `red`, fontSize: `15px` }}>
                Mật khẩu phải dài ít nhất 8 kí tự và tối đa là 32 kí tự.
              </span>
            </Col>
          ) : null}
        </Row>

        {/* New password  */}
        <Row className="justify-content-center">
          <Col md={2} className="text-start">
            <label style={{ color: `black`, textAlign: `left` }}>
              Nhập mật khẩu mới:{" "}
            </label>
          </Col>
          <Col md={5}>
            <Input
              maxLength={30}
              style={{
                width: `100%`,
                border: `1px solid gray`,
                borderRadius: `4px`,
              }}
              placeholder="Nhập mật khẩu mới"
              value={newPassword}
              type="password"
              onChange={(e) => {
                if (!Validate.validateLength(e.target.value, 8, 32)) {
                  setNewPasswordValidate(true);
                } else {
                  setNewPasswordValidate(false);
                }
                setNewPassword(e.target.value);
              }}
            />
          </Col>
          {newPasswordValidate ? (
            <Col md={7} className=" text-end">
              <span style={{ color: `red`, fontSize: `15px` }}>
                Mật khẩu phải dài ít nhất 8 kí tự và tối đa là 32 kí tự.
              </span>
            </Col>
          ) : null}
        </Row>

        {/* Confirm  */}
        <Row className="justify-content-center">
          <Col md={2} className="text-start">
            <label style={{ color: `black`, textAlign: `left` }}>
              Nhập lại mật khẩu:
            </label>
          </Col>
          <Col md={5}>
            <Input
              maxLength={30}
              style={{
                width: `100%`,
                border: `1px solid gray`,
                borderRadius: `4px`,
              }}
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={confirm}
              onChange={(e) => {
                if (!Validate.validateLength(e.target.value, 8, 32)) {
                  setConfirmValidate(true);
                } else {
                  setConfirmValidate(false);
                }
                setConfirm(e.target.value);
              }}
            />
          </Col>
          {confirmValidate ? (
            <Col md={7} className=" text-end">
              <span style={{ color: `red`, fontSize: `15px` }}>
                Mật khẩu nhập lại không trùng khớp với mật khẩu mới.
              </span>
            </Col>
          ) : null}
        </Row>

        {/* Tên  */}
        <Row className="justify-content-center">
          <Col md={2} className="text-start">
            <label style={{ color: `black`, textAlign: `left` }}>
              Tên <span style={{ color: `red`, fontSize: `25px` }}>*</span>:{" "}
            </label>
          </Col>
          <Col md={5}>
            <Input
              maxLength={30}
              style={{
                width: `100%`,
                border: `1px solid gray`,
                borderRadius: `4px`,
              }}
              placeholder="Nhập tên của bạn"
              value={name}
              onChange={(e) => {
                if (!Validate.validateLength(e.target.value, 8, 32)) {
                  setNameValidate(true);
                } else {
                  setNameValidate(false);
                }
                setName(e.target.value);
              }}
            />
          </Col>
          {nameValidate ? (
            <Col md={7} className=" text-end">
              <span style={{ color: `red`, fontSize: `15px` }}>
                Tên phải dài ít nhất 8 kí tự và tối đa là 32 kí tự
              </span>
            </Col>
          ) : null}
        </Row>
        {/* Email  */}
        <Row className="justify-content-center" md={5}>
          <Col md={2} className="text-start">
            <label style={{ color: `black`, textAlign: `left` }}>Email: </label>
          </Col>
          <Col md={5}>
            <Input
              maxLength={50}
              style={{
                width: `100%`,
                border: `1px solid gray`,
                borderRadius: `4px`,
              }}
              placeholder="Nhập email của bạn"
              type="email"
              value={email}
              onChange={(e) => {
                if (!validator.isEmail(email)) {
                  setEmailValidate(true);
                } else {
                  setEmailValidate(false);
                }
                setEmail(e.target.value);
              }}
            />
          </Col>
          {email.length !== 0 && emailValidate ? (
            <Col md={7} className=" text-end">
              <span style={{ color: `red`, fontSize: `15px` }}>
                Email không hợp lệ.
              </span>
            </Col>
          ) : null}
        </Row>

        {/* Date of birth  */}
        <Row className="justify-content-center">
          <Col md={2} className="text-start">
            <label style={{ color: `black`, textAlign: `left` }}>
              Ngày sinh{" "}
              <span style={{ color: `red`, fontSize: `25px` }}>*</span>:
            </label>
          </Col>
          <Col md={5}>
            <Input
              style={{
                width: `100%`,
                border: `1px solid gray`,
                borderRadius: `4px`,
              }}
              min={getMinDate()}
              max={getMaxDate()}
              placeholder="Nhập email của bạn"
              type="date"
              value={dateOfBirth}
              onChange={(e) => {
                // console.log(e.target.value);
                let separator = "";
                let date = e.target.valueAsDate.getDate();
                let month = e.target.valueAsDate.getMonth() + 1;
                let year = e.target.valueAsDate.getFullYear();

                let day = `${year}${separator}-${
                  month < 10 ? `0${month}` : `${month}`
                }-${date < 10 ? `0${date}` : `${date}`}`;
                console.log(day);
                setDateOfBirth(day);
              }}
            />
          </Col>
          {dateOfBirthValidate ? (
            <Col md={7} className=" text-end">
              <span style={{ color: `red`, fontSize: `15px` }}>
                Vui lòng chọn ngày sinh của bạn.
              </span>
            </Col>
          ) : null}
        </Row>
        {/* Giới tính  */}
        <Row className="justify-content-center">
          <Col md={2} className="text-start">
            <label style={{ color: `black`, textAlign: `left` }}>
              Giới tính{" "}
              <span style={{ color: `red`, fontSize: `25px` }}>*</span>:
            </label>
          </Col>
          <Col md={5}>
            <select
              style={{
                width: `100%`,
                border: `1px solid gray`,
                borderRadius: `4px`,
              }}
              defaultValue={gender}
              onChange={(e) => {
                setGender(e.target.value);
              }}
            >
              {genders.map((item, key) => {
                if (gender === item.id) {
                  return (
                    <option key={item.id} value={item.id} selected={true}>
                      {item.value}
                    </option>
                  );
                } else {
                  return (
                    <option key={item.id} value={item.id}>
                      {item.value}
                    </option>
                  );
                }
              })}
            </select>
          </Col>
          {genderValidate ? (
            <Col md={7} className=" text-end">
              <span style={{ color: `red`, fontSize: `15px` }}>
                Vui lòng chọn giới tính của bạn.
              </span>
            </Col>
          ) : null}
        </Row>
        {/* province  */}
        <Row className="justify-content-center">
          <Col md={2} className="text-start">
            <label style={{ color: `black`, textAlign: `left` }}>
              Tỉnh/thành phố{" "}
              <span style={{ color: `red`, fontSize: `25px` }}>*</span>:
            </label>
          </Col>
          <Col md={5}>
            <select
              style={{
                width: `100%`,
                border: `1px solid gray`,
                borderRadius: `4px`,
              }}
              defaultValue={province}
              onChange={(e) => {
                console.log(e.target.value);
                setProvince(e.target.value);

                setDistrict(-1);
              }}
            >
              <option value="-1">--- Chọn tỉnh/thành phố --- </option>
              {provinceList.map((item, key) => {
                if (province === item.id) {
                  return (
                    <option key={item.id} value={item.id} selected={true}>
                      {item.name}
                    </option>
                  );
                } else {
                  return (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  );
                }
              })}
            </select>
          </Col>
          {provinceValidate ? (
            <Col md={7} className=" text-end">
              <span style={{ color: `red`, fontSize: `15px` }}>
                Vui lòng chọn tỉnh/thành phố bạn đang ở.
              </span>
            </Col>
          ) : null}
        </Row>
        {/* District  */}
        <Row className="justify-content-center">
          <Col md={2} className="text-start">
            <label style={{ color: `black`, textAlign: `left` }}>
              Quận/huyện{" "}
              <span style={{ color: `red`, fontSize: `25px` }}>*</span>:
            </label>
          </Col>
          <Col md={5}>
            <select
              style={{
                width: `100%`,
                border: `1px solid gray`,
                borderRadius: `4px`,
              }}
              defaultValue={district}
              onChange={(e) => {
                setDistrict(e.target.value);
              }}
            >
              <option value="-1">--- Chọn quận/huyện --- </option>
              {districtList.map((item, key) => {
                if (district === item.id) {
                  return (
                    <option key={item.id} value={item.id} selected={true}>
                      {item.name}
                    </option>
                  );
                } else {
                  return (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  );
                }
              })}
            </select>
          </Col>
          {districtValidate ? (
            <Col md={7} className=" text-end">
              <span style={{ color: `red`, fontSize: `15px` }}>
                Vui lòng chọn quận/huyện bạn đang ở.
              </span>
            </Col>
          ) : null}
        </Row>
        <Row className="justify-content-around">
          <Col xs={3} md={2}>
            <Row>
              <button
                onClick={() => {
                  if (validateAll()) {
                    setModalUpdate(true);
                  }
                }}
              >
                Thay đổi
              </button>
            </Row>
          </Col>
          <Col xs={3} md={2}>
            <Row>
              <button onClick={() => setModalConfirm(true)}>Hủy bỏ</button>
            </Row>
          </Col>
        </Row>
      </div>
      <Modal isOpen={modalUpdate}>
        <ModalHeader tag={"h3"}>Nhắc nhở</ModalHeader>
        <ModalBody>
          <p>Bạn có chắc chắn muốn lưu thay đổi này?</p>
        </ModalBody>
        <ModalFooter>
          <Col md={2} className="me-5">
            <Row>
              <Button
                style={{ fontSize: `18px`, padding: `5px` }}
                onClick={() => {
                  clickChangeProfile();
                }}
              >
                Đồng ý
              </Button>
            </Row>
          </Col>
          <Col md={2} className="me-3">
            <Row>
              <Button
                style={{ fontSize: `18px`, padding: `5px` }}
                onClick={() => {
                  setModalUpdate(false);
                }}
              >
                Hủy
              </Button>
            </Row>
          </Col>
        </ModalFooter>
      </Modal>
      <Modal isOpen={modalConfirm} toggle={() => setModalConfirm(false)}>
        <ModalHeader tag={"h3"}>Nhắc nhở</ModalHeader>
        <ModalBody>
          <p>Bạn có chắc chắn muốn hủy bỏ thay đổi này?</p>
        </ModalBody>
        <ModalFooter>
          <Col md={2} className="me-5">
            <Row>
              <Button
                style={{ fontSize: `18px`, padding: `5px` }}
                onClick={() => {
                  setModalConfirm(false);
                  navigate("/user/profile");
                }}
              >
                Đồng ý
              </Button>
            </Row>
          </Col>
          <Col md={2} className="me-3">
            <Row>
              <Button
                style={{ fontSize: `18px`, padding: `5px` }}
                onClick={() => {
                  setModalUpdate(false);
                  setModalConfirm(false);
                }}
              >
                Hủy
              </Button>
            </Row>
          </Col>
        </ModalFooter>
      </Modal>
    </div>
  );
}
