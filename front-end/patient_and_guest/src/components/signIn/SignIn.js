import React, { useEffect, useState } from "react";
import logo from "../../logo/logo1.jpg";
import "./style.css";
import axios from "axios";
import {
  CardBody,
  CardGroup,
  CardHeader,
  CardTitle,
  Col,
  Modal,
  Row,
} from "reactstrap";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import Validate from "./Validate";
import validator from "validator";
// import logoDentist from "../../assets/images/logoDentist.svg";
import { Navigate, useNavigate } from "react-router-dom";
const API_REGIS = "http://localhost:8080/rade/account/registration";
const API_GET_PROVINCE = "http://localhost:8080/rade/province";
const API_GET_DISTRICT = "http://localhost:8080/rade/district/";
const URL_GET_OTP = "http://localhost:8080/rade/account/sendOTP";
const URL_SUBMIT_OTP = "http://localhost:8080/rade/account/verifyOTP";
const URL_CHECK_PHONE = "http://localhost:8080/rade/account/checkphone";
const genders = [
  {
    id: "1",
    value: "Nam",
  },
  {
    id: "2",
    value: "Nữ",
  },
];
export default function SignIn() {
  const [districtArr, setDistrictArr] = useState([]);
  const [provinceArr, setProvinceArr] = useState([]);

  const [validationMsg, setValidationMsg] = useState("");

  //data sign
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confrim, setConfirm] = useState("");
  const [fullName, setName] = useState("");
  const [gender, setGender] = useState("-1");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [districtID, setDistrictID] = useState("-1");
  const [province, setProvice] = useState("-1");
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [stringVerify, setStringVerify] = useState("");
  const navigate = useNavigate();
  const [time, setTime] = useState(0);

  useEffect(() => {
    axios
      .get(API_GET_PROVINCE)
      .then((res) => {
        setProvinceArr(res.data);
        console.log("gán :");
        console.log(res);
      })
      .catch()
      .then(() => {
        console.log("provinceArr");
        console.log(provinceArr);
      });
    // let interval = setInterval(() => {
    //   setTime(time - 1);
    // }, 1000);
    // return clearInterval(interval);
  }, []);

  useEffect(() => {
    if (time !== 0) {
      setTimeout(() => {
        setTime(time - 1);
      }, 1000);
    }
  }, [time]);

  const getMaxDate = (separator = "") => {
    let newDate = new Date();
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear() - 4;

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

  const clickSiginIn = () => {
    const error = validateAll();
    console.log("fasle", error);
    const data = {
      fullName: fullName,
      password: password,
      dateOfBirth: dateOfBirth,
      gender: gender,
      districtId: districtID,
      phone: phone,
      email: email,
    };
    console.log("data signin", data);
    if (error) {
      axios
        .post(URL_CHECK_PHONE, data)
        .then((res) => {
          const dataGetOTP = {
            phone: "+84" + phone.substring(1),
          };
          console.log("datagetOTP", dataGetOTP);
          axios.post(URL_GET_OTP, dataGetOTP).then((res) => {
            console.log("Get otp: ", res);
            setModalOpen(true);
            setTime(120);
          });
          setModalOpen(true);
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status === 400) {
            toast.warn("Số điện thoại của bạn đã được sử dụng");
          }
        });
    }
  };

  const reSendOTP = () => {
    const dataGetOTP = {
      phone: "+84" + phone.substring(1),
    };
    console.log("datagetOTP", dataGetOTP);
    axios
      .post(URL_GET_OTP, dataGetOTP)
      .then((res) => {
        console.log("Get otp: ", res);
        setModalOpen(true);
        setTime(120);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message);
      });
  };

  const validateAll = () => {
    let flag = true;
    if (!Validate.validatePhone(phone)) {
      setPhone("false");
      flag = false;
    }
    if (!Validate.validateLength(password, 8, 30)) {
      setPassword("false");
      flag = false;
    }
    if (!Validate.compare(password, confrim)) {
      setConfirm("false");
      flag = false;
    }
    if (!Validate.validateMinLength(fullName, 8)) {
      setName("false");
      flag = false;
    }

    if (!validator.isEmail(email) && email.length !== 0) {
      setEmailErr("false");
      console.log("fasle");
      flag = false;
    }
    if (dateOfBirth?.length === 0 || dateOfBirth === "false") {
      setDateOfBirth("false");
      flag = false;
    }
    if (gender === "-1" || gender === "false") {
      setGender("false");
      flag = false;
    }
    if (province === "-1" || province === "false") {
      setProvice("false");
      flag = false;
    }
    if (districtID === "-1" || districtID === "false") {
      setDistrictID("false");
      flag = false;
    }
    return flag;
  };

  const handleChangePro = (e) => {
    setProvice(e.target.value);
    axios.get(API_GET_DISTRICT + e.target.value).then((res) => {
      console.log(res.data);
      setDistrictArr(res.data);
    });
  };

  const compareDate = (dateOfBirth) => {
    var today = new Date();
    return Math.floor((today - dateOfBirth) / (1000 * 60 * 60 * 24));
  };

  const submitOTP = () => {
    const phoneAndOTP = {
      phone: "+84" + phone.substring(1),
      otp: stringVerify,
    };
    axios.post(URL_SUBMIT_OTP, phoneAndOTP).then((res) => {
      console.log(res);
      const data = {
        fullName: fullName,
        password: password,
        dateOfBirth: dateOfBirth,
        gender: gender,
        districtId: districtID,
        phone: phone,
        email: email,
      };
      axios
        .post(API_REGIS, data)
        .then(() => {
          console.log("thành công");
          toast.success("Đăng kí thành công.");
          navigate("/");
        })
        .catch((error) => {
          if (error.response.status === 406) {
            toast.warn("Mã OTP không hợp lệ");
            setStringVerify("");
          }
        });
    });
  };

  return (
    <div id="signForm">
      <Modal isOpen={modalOpen}>
        <div
          style={{
            margin: `auto`,
            padding: `20px`,
          }}
          className="popup-verify"
        >
          <CardGroup>
            <CardHeader
              className="d-flex justify-content-center"
              style={{ width: `100%` }}
            >
              <CardTitle tag={"h4"} className="font-weight-bold">
                Xác minh số điện thoại
              </CardTitle>
            </CardHeader>
          </CardGroup>
          <CardBody className="text-center ">
            <div>
              <Row className="text-start justify-content-center mb-3">
                Tin nhắn chứa mã OTP để xác thực cho tài khoản này đã được gửi
                đến số điện thoại: {phone}. <br /> Bạn vui lòng nhập vào đây để
                hoàn tất đăng ký trong {time} giây.
              </Row>
              {/* <Row>
                <Col>
                  <button>Gửi lại{time}</button>
                </Col>
              </Row> */}
              <input
                placeholder="OTP"
                className="text-center p-2"
                style={{
                  width: `70%`,
                  borderRadius: `30px`,
                  fontSize: `18px`,
                  border: `1px  solid gray`,
                }}
                value={stringVerify}
                onChange={(e) => setStringVerify(e.target.value)}
              />
              <Row
                style={{
                  width: `150px`,
                  justifyContent: `center`,
                  margin: `auto`,
                }}
              >
                <button
                  onClick={() => {
                    if (time === 0) {
                      reSendOTP();
                    } else {
                      submitOTP();
                    }
                  }}
                >
                  {time === 0 ? "Gửi lại" : "Xác nhận"}
                </button>
              </Row>
            </div>
          </CardBody>
        </div>
      </Modal>

      <div className="form-header">
        <img src={logo} alt="logo" />
        <h2>Rade - Nha khoa hoàn mỹ</h2>
      </div>
      <div className="form-sign">
        <div className="content-sign" style={{ maxWidth: `800px` }}>
          <Row className="justify-content-center d-flex flex-row mb-4">
            <Col lg={4} sm={5}>
              Số điện thoại{" "}
              <span style={{ color: `red`, fontSize: `25px` }}>*</span>
            </Col>
            <Col lg={5} sm={7}>
              {/* <PhoneInput */}
              <input
                style={{ width: `100%`, borderRadius: `6px` }}
                maxLength={10}
                type="number"
                name="phone"
                onChange={(e) => {
                  if (!Validate.validatePhone(e.target.value)) {
                    setPhone("false");
                    return;
                  }
                  setPhone(e.target.value);
                }}
              />
            </Col>
            {phone === "false" ? (
              <span style={{ color: `red` }}>
                <p>Số điện thoại bắt đầu bằng 0 và dài từ 10 đến 11 kí tự</p>
              </span>
            ) : null}
          </Row>

          {/* Mất khẩu */}
          <Row className="justify-content-center d-flex flex-row mb-4">
            <Col lg={4} sm={5}>
              Mật khẩu <span style={{ color: `red`, fontSize: `25px` }}>*</span>
            </Col>
            <Col lg={5} sm={7}>
              <input
                style={{ width: `100%`, borderRadius: `6px` }}
                type="password"
                name="password"
                maxLength={30}
                onChange={(e) => {
                  if (!Validate.validateLength(e.target.value, 8, 32)) {
                    setPassword("false");
                    return;
                  }
                  setPassword(e.target.value);
                }}
              />
              {password === "false" ? (
                <span style={{ color: `red` }}>
                  <p>Mật khẩu dài từ 8 đến 30 kí tự</p>
                </span>
              ) : null}
            </Col>
          </Row>
          <span style={{ color: `red`, fontSize: `15px` }}>
            <>{validationMsg.password}</>
          </span>
          {/* Nhập lại mật khẩu */}
          <Row className="justify-content-center d-flex flex-row mb-4">
            <Col lg={4} sm={5}>
              Nhập lại mật khẩu{" "}
              <span style={{ color: `red`, fontSize: `25px` }}>*</span>
            </Col>
            <Col lg={5} sm={7}>
              <input
                maxLength={30}
                style={{ width: `100%`, borderRadius: `6px` }}
                type="password"
                name="confirm"
                onChange={(e) => {
                  if (!Validate.compare(password, e.target.value)) {
                    setConfirm("false");
                    return;
                  }
                  setConfirm(e.target.value);
                }}
              />
              {confrim === "false" ? (
                <span style={{ color: `red` }}>
                  <p>Mật khẩu không trùng nhau</p>
                </span>
              ) : null}
            </Col>
          </Row>
          <span style={{ color: `red`, fontSize: `15px` }}>
            <>{validationMsg.confrim}</>
          </span>

          {/* Nhập họ và tên */}
          <Row className="justify-content-center d-flex flex-row mb-4">
            <Col lg={4} sm={5}>
              Tên <span style={{ color: `red`, fontSize: `25px` }}>*</span>
            </Col>
            <Col lg={5} sm={7}>
              <input
                maxLength={30}
                style={{ width: `100%`, borderRadius: `6px` }}
                name="fullName"
                onChange={(e) => {
                  if (!Validate.validateMinLength(e.target.value, 8)) {
                    setName("false");
                    return;
                  }
                  setName(e.target.value);
                }}
              />
              {fullName === "false" ? (
                <span style={{ color: `red` }}>
                  <p>Tên dài ít nhất 8 kí tự</p>
                </span>
              ) : null}
            </Col>
          </Row>
          {/* Email */}
          <Row className="justify-content-center d-flex flex-row mb-4">
            <Col lg={4} sm={4}>
              Email
            </Col>
            <Col lg={5} sm={8}>
              <input
                type="email"
                maxLength={50}
                style={{ width: `100%`, borderRadius: `6px` }}
                name="email"
                onChange={(e) => {
                  if (!validator.isEmail(e.target.value)) {
                    setEmailErr("false");
                  } else {
                    setEmailErr("true");
                  }
                  setEmail(e.target.value);
                }}
              />
              {email.length !== 0 && emailErr === "false" ? (
                <span style={{ color: `red` }}>
                  <p>Vui lòng nhập đúng email</p>
                </span>
              ) : null}
            </Col>
          </Row>
          <Row className="justify-content-center d-flex flex-row mb-4">
            <Col lg={4} sm={6}>
              Ngày sinh{" "}
              <span style={{ color: `red`, fontSize: `25px` }}>*</span>
            </Col>
            <Col lg={5} sm={6}>
              <input
                style={{ width: `100%`, borderRadius: `6px`, fontSize: `18px` }}
                type="date"
                name="dateOfBirth"
                min={getMinDate()}
                max={getMaxDate()}
                onChange={(e) => {
                  console.log(e.target.value);
                  setDateOfBirth(e.target.value);
                }}
              />
              {dateOfBirth === "false" ? (
                <span style={{ color: `red` }}>
                  <p>Vui lòng chọn ngày sinh</p>
                </span>
              ) : null}
            </Col>
          </Row>

          <Row className="justify-content-center d-flex flex-row mb-4">
            <Col lg={4} sm={5}>
              Giới tính{" "}
              <span style={{ color: `red`, fontSize: `25px` }}>*</span>
            </Col>
            <Col lg={5} sm={7}>
              <select
                style={{ width: `100%`, borderRadius: `6px` }}
                name="gender"
                className="optional"
                onChange={(e) => {
                  console.log(e.target.value);
                  setGender(e.target.value);
                }}
              >
                <option value="-1">Chọn giới tính</option>
                {genders.map((option) => (
                  <option value={option.id}>{option.value}</option>
                ))}
              </select>
              {gender === "false" ? (
                <span style={{ color: `red` }}>
                  <p>Vui lòng chọn giới tính của bạn</p>
                </span>
              ) : null}
            </Col>
          </Row>
          <span style={{ color: `red`, fontSize: `15px` }}>
            <>{validationMsg.gender}</>
          </span>
          {/* Tỉnh thành phố  */}
          <Row className="justify-content-center d-flex flex-row mb-4">
            <Col lg={4} sm={4}>
              Tỉnh/Thành phố{" "}
              <span style={{ color: `red`, fontSize: `25px` }}>*</span>
            </Col>
            <Col lg={5} sm={8}>
              <select
                style={{ width: `100%`, borderRadius: `6px  ` }}
                className="optional"
                onChange={(e) => handleChangePro(e)}
                placeholder="Nhập tỉnh"
              >
                <option value="-1">Chọn tỉnh/thành phố</option>
                {provinceArr.map((option) => (
                  <option value={option.id}>{option.name}</option>
                ))}
              </select>
              {province === "false" ? (
                <span style={{ color: `red` }}>
                  <p>Vui lòng chọn tỉnh/thành phố của bạn</p>
                </span>
              ) : null}
            </Col>
          </Row>
          {/* Quận Huyện  */}
          <Row className="justify-content-center d-flex flex-row mb-4">
            <Col lg={4} sm={4}>
              Quận/Huyện{" "}
              <span style={{ color: `red`, fontSize: `25px` }}>*</span>
            </Col>
            <Col lg={5} sm={8}>
              <select
                style={{ width: `100%`, borderRadius: `6px  ` }}
                className="optional"
                onChange={(e) => setDistrictID(e.target.value)}
              >
                <option value="-1">Chọn quận/huyện</option>
                {districtArr.map((option) => (
                  <option value={option.id}>{option.name}</option>
                ))}
              </select>
              {districtID === "false" ? (
                <span style={{ color: `red` }}>
                  <p>Vui lòng chọn quận/huyện của bạn</p>
                </span>
              ) : null}
            </Col>
          </Row>
          <span style={{ color: `red`, fontSize: `15px` }}>
            <>{validationMsg.districtID}</>
          </span>
        </div>
        <Row className="btn" style={{ textAlign: `center` }}>
          <button type="button" onClick={() => clickSiginIn()}>
            Đăng ký
          </button>
        </Row>
      </div>
    </div>
  );
}
