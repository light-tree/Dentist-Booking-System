import React, { useContext, useState } from "react";
import "./style.css";
import AccountLogin from "../../service/loginService";
import gmail_icon from "../../assets/images/google.jpg";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Col, Modal, ModalBody, Row } from "reactstrap";

export default function LoginForm(props) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [validMsg, setValidMsg] = useState({});
  const navigate = useNavigate();
  const context = useContext({});

  const validateAll = () => {
    let error = {};
    console.log(phone);
    if (phone.length < 10 || phone.length > 11) {
      console.log("phone-err");
      error.phone = "Số điện thoại không đúng";
    }
    if (password.length === 0) {
      error.password = "Mật khẩu trống";
    }
    setValidMsg(error);
  };

  const onSubmitHandle = (e) => {
    validateAll();
    let err = validMsg;
    if (err) {
      AccountLogin.login(phone, password)
        .then((response) => {
          localStorage.setItem("phone", response.data.phone);
          localStorage.setItem("accessToken", response.data.accessToken);
          localStorage.setItem("role", response.data.role);
          sessionStorage.setItem("statusLogin", "true");
          localStorage.setItem("loginSuccess", true);
          localStorage.setItem("roleName", response.data.roleName);
          console.log(response.data);
          if (response.data.roleName === "ROLE_USER") {
            window.location.reload();
            // navigate("/home");
            // props.history.push({
            //   pathname: "/page",
            //   // state: data, // your data array of objects
            // });
          } else {
            toast.warn(
              "Bạn đăng nhập không thành công. Tài khoản của bạn không tồn tại"
            );
            setPassword("");
            setPhone("");
          }
        })
        .catch((e) => {
          sessionStorage.setItem("statusLogin", "false");
          console.log(e);
          if (e.response.status === 406) {
            toast.error(
              "Tài khoản của bạn đã bị khóa. \nVui lòng liên hệ 0987654321 để biết thông tin chi tiết"
            );
          } else {
            toast.error("Đăng nhập không thành công");
          }

          setPassword("");
        });
      // AccountLogin.getBranch();
    }
  };
  return (
    <div style={{ display: `flex`, justifyContent: `center` }}>
      <div id="loginform" className="m-0">
        <h2 id="headerTitle">Đăng nhập</h2>
        <div id="login">
          <form onSubmit={() => onSubmitHandle()}>
            <div className="row">
              <label>Số điện thoại</label>
              <p style={{ color: `red` }}>{validMsg.phone}</p>
              <input
                maxLength={10}
                type="text"
                placeholder="Nhập số điện thoại"
                name="phone"
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="row">
              <label>Nhập mật khẩu</label>
              <p style={{ color: `red` }}>{validMsg.password}</p>
              <input
                type="password"
                placeholder="Nhập mật khẩu"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div id="button" className="row justify-content-center">
              <button
                type="button"
                onClick={() => onSubmitHandle()}
                style={{ maxWidth: `200px` }}
              >
                Đăng nhập
              </button>
            </div>
          </form>
          <Row className="d-flex flex-row mb-5">
            <Col lg="auto" md="auto" xs="auto">
              <p className="m-0">Nếu bạn chưa có tài khoản</p>
            </Col>
            <Col lg="auto" md="auto" xs="auto">
              <a
                style={{ fontSize: `18px`, color: `blue`, cursor: `pointer` }}
                href="/account/register"
              >
                Đăng ký
              </a>
            </Col>
          </Row>
          {/* <div id="alternativeLogin">
          <label>Hoặc đăng nhập bằng:</label>
          <div id="iconGroup">
            <a
              href="https://accounts.google.com/o/oauth2/auth?scope=email&redirect_uri=http://localhost:8080/VegetableStrore/MainController&response_type=code
                       &client_id=247126668913-fi6ogou11n56ejlfk0fuq26ublnavlv6.apps.googleusercontent.com&approval_prompt=force"
              id="googleIcon"
            >
              <img className="logo" src={gmail_icon} alt="gmail" />
            </a>
          </div>
        </div> */}
        </div>
      </div>
    </div>
  );
}
