import React, { useEffect, useState } from "react";
import "./styleNav.css";
import "../ServiceType/style.css";
import logoDentist from "../../assets/images/logoDentist.png";
import LoginForm from "../Login-Logout/Login";
import { Link, useRoutes, useNavigate, Navigate } from "react-router-dom";
import SignIn from "../signIn/SignIn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Popup from "reactjs-popup";
import {
  faBell,
  faUser,
  faCalendarDays,
} from "@fortawesome/free-regular-svg-icons";
import { faBars, faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import Notification from "../Notification/Notification";
import axios from "axios";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import ServiceTypeList from "../../getData/ServiceTypeList";
import { Modal } from "reactstrap";
const token = localStorage.getItem("accessToken");
const phone = localStorage.getItem("phone");
const API_POST_HISTORY =
  "http://localhost:8080/rade/patient/appointment/history";
const API_CHECK_ACCOUNT = "http://localhost:8080/rade/patient/account/";

export default function Nav(props) {
  const [statusLogin, setStatusLogin] = useState(null);
  const [displayServiceType, setDisplayServiceType] = useState("none");
  const [modalLogin, setModalLogin] = useState(false);
  let navigate = useNavigate();
  // let HistoryPage = useRoutes([{ path: "/history", element: <HistoryPage /> }]);
  const [serviceType, setServiceType] = useState([]);
  useEffect(() => {
    ServiceTypeList.getSericeType()
      .then((Response) => {
        setServiceType(Response.data.serviceTypeList);
      })
      .catch((error) => console.log("Error: " + error));
  }, []);
  const clickButton = () => {
    if (document.getElementById("service-type").style.display === "none") {
      setDisplayServiceType("flex");
      // document.getElementById("abc").style.display = `block`;
    } else {
      setDisplayServiceType("none");
      // document.getElementById("abc").style.display = `none`;
    }
  };

  const clickMenuBar = () => {
    if (
      document.getElementById("show").style.animation.indexOf("slideIn") > -1
      // document.getElementById("show").style.display === "block"
    ) {
      // document.getElementById("show").style.display = "none";
      document.getElementById("show").style.animation =
        "slideOut ease-out 0.5s forwards";
    } else {
      // document.getElementById("show").style.display = "block";
      document.getElementById("show").style.animation = "slideIn ease-in 0.5s";
    }
  };
  useEffect(() => {
    var data = {
      phone: phone,
      page: 1,
    };
    axios
      .post(API_POST_HISTORY, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then()
      .catch((error) => {
        if (error.message.indexOf("401") > -1) {
          // toast.warn("Vui lòng đăng nhập lại!");
          sessionStorage.setItem("statusLogin", "false");
        }
      });
    // console.log(localStorage.getItem("statusLogin"));
    // console.log("phone: " + localStorage.getItem("phone"));
    // console.log("accessToken: " + localStorage.getItem("accessToken"));
  }, []);

  const FirstNav = () => {
    return (
      <nav>
        <ul id="show-first-nav" className="first-nav m-0 p-0">
          <li className="nav-item">
            <Link to="/home" style={{ textDecoration: "none" }}>
              <button>Trang chủ</button>
            </Link>
          </li>
          <li className="nav-item">
            <div to="/servicetype/1" style={{ textDecoration: "none" }}>
              <div className="dropdown dropdown-service-type">
                <button className="nut_dropdown" style={{ width: `160px` }}>
                  Dịch vụ
                </button>
                <div className="noidung_dropdown">
                  {serviceType.map((item) => (
                    <Link to={`/serviceType/${item.id}`} key={item.id}>
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              {/* Hiển thị khi màn hình < 950px */}
              <div id="service-type__950px">
                <button type="button" onClick={() => clickButton()}>
                  Dịch vụ
                </button>
                <div
                  id="service-type"
                  className="ms-3 flex-column"
                  style={{ display: displayServiceType }}
                >
                  {serviceType.map((item) => (
                    <button>
                      <Link
                        to={`/serviceType/${item.id}`}
                        key={item.id}
                        style={{ textDecoration: `none` }}
                      >
                        {item.name}
                      </Link>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </li>
        </ul>
      </nav>
    );
  };

  const ClickMakeAppoiment = () => {
    axios
      .get(API_CHECK_ACCOUNT + phone, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        return navigate("/user/appointment");
      })
      .catch((error) => {
        if (error.message.indexOf("406") > -1) {
          toast.warn("Tài khoản bạn không có trong hệ thống");
        } else if (error.message.indexOf("410") > -1) {
          toast.warn("Bạn có lịch hẹn chưa hoàn thành");
          return navigate("/user/history");
        } else if (error.message.indexOf("423") > -1) {
          toast.warn("Tài khoản của bạn đã bị đưa vào danh sách đen");
        }
      });
  };

  const SecondNavLogin = () => (
    <ul id="show-second-nav" className="second-nav m-0 p-0">
      <div
        to="/user/appointment"
        className="nav-item"
        style={{ textDecoration: "none" }}
      >
        <button
          type="button"
          className="btn-datlich display"
          style={{
            backgroundColor: `#0b0b90 `,
            color: `white`,
            borderRadius: `10px`,
            border: `2px solid #0b0b90`,
          }}
          onClick={() => ClickMakeAppoiment()}
        >
          Đặt lịch
        </button>
      </div>
      <div className="nav-item" style={{ textDecoration: "none" }}>
        <Notification />
      </div>
      <Link
        className="nav-item"
        to="/user/history"
        style={{ textDecoration: "none" }}
      >
        <button>
          <FontAwesomeIcon icon={faCalendarDays} />
        </button>
      </Link>
      <Link
        className="nav-item"
        to="/user/profile"
        style={{ textDecoration: "none" }}
      >
        <button>
          <FontAwesomeIcon icon={faUser} />
        </button>
      </Link>
      <Link
        className="nav-item"
        to="/logout"
        style={{ textDecoration: "none" }}
      >
        <button>
          <FontAwesomeIcon icon={faRightToBracket} />
        </button>
      </Link>
    </ul>
  );
  const SecondNav = () => (
    <ul id="show-second-nav" className="second-nav m-0 p-0">
      {/* <Popup
        modal
        trigger={
          <li className="nav-item">
            <button>Đăng nhập</button>
          </li>
        }
      >
        <LoginForm />
      </Popup> */}
      <li className="nav-item">
        <button onClick={() => setModalLogin(true)}>Đăng nhập</button>
      </li>
      <li>
        <Link to="/account/register" className="nav-item">
          <button>Đăng ký</button>
        </Link>
      </li>
    </ul>
  );

  return (
    <>
      <Modal isOpen={modalLogin} toggle={() => setModalLogin(false)}>
        <LoginForm />
      </Modal>
      <nav>
        {/* Hiển thị khi màn hình > 950px */}
        <div id="display-nav__950px" className="nav">
          <div className="logo justify-content-between">
            <div className="d-flex justify-content-start">
              <img
                src={logoDentist}
                alt="logo"
                onClick={() => {
                  navigate("/");
                }}
              />
            </div>
          </div>
          <FirstNav />
          {sessionStorage.getItem("statusLogin") === "true" ? (
            <SecondNavLogin />
          ) : (
            <SecondNav />
          )}
        </div>

        {/* Hiển thị khi màn hình < 950px */}
        <div className="nav__950px ">
          <div className="d-flex flex-column">
            <div className="logo__950px justify-content-between">
              <div
                className="logo-icon__950px"
                style={{ width: `15vw`, display: `flex`, margin: `auto 0` }}
              >
                <FontAwesomeIcon
                  className="icon-menu"
                  icon={faBars}
                  style={{
                    margin: `auto 0`,
                    fontSize: `30px`,
                    width: `100%`,
                    cursor: `pointer`,
                  }}
                  onClick={() => clickMenuBar()}
                />
              </div>

              <div className="d-flex ">
                <img
                  src={logoDentist}
                  alt="logo"
                  onClick={() => {
                    navigate("/");
                  }}
                />
              </div>

              <div
                to="/user/appointment"
                className="nav-item"
                style={{ textDecoration: "none" }}
              >
                <button
                  type="button"
                  className="btn-datlich me-3 display-max-width"
                  style={{
                    backgroundColor: `#0b0b90 `,
                    color: `white`,
                    borderRadius: `10px`,
                    border: `2px solid #0b0b90`,
                  }}
                  onClick={() => ClickMakeAppoiment()}
                >
                  Đặt lịch
                </button>
              </div>
            </div>
            {/* ============ */}
            <div id="show" className="nav-side-bar">
              <FirstNav />
              {sessionStorage.getItem("statusLogin") === "true" ? (
                <SecondNavLogin />
              ) : (
                <SecondNav />
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
