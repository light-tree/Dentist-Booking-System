import { faBell, faBellSlash } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { Col, Modal, ModalBody, div, ModalHeader, Row } from "reactstrap";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./style.css";
import { Button } from "bootstrap";
import {
  faBellConcierge,
  faCaretLeft,
  faCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import { tada } from "react-animations";
import Radium, { StyleRoot } from "radium";
const notification = [
  {
    id: "1",
    name: "avsd",
  },
];
const token = localStorage.getItem("accessToken");
const phone = localStorage.getItem("phone");
let render = false;
const API_GET_NOTIFY_POST = "http://localhost:8080/rade/patient/notification";
export default function Notification() {
  const [notificationList, setNotificationList] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPage, setNextPage] = useState(true);
  const [fullHeight, setFullHeight] = useState(false);

  const getCurrentDate = (d) => {
    let separator = "";
    let newDate = new Date(d);
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    // console.log(
    //   `${year}${separator}-${month < 10 ? `0${month}` : `${month}`}-${
    //     date < 10 ? `0${date}` : `${date}`
    //   }`
    // );
    return `${year}${separator}-${month < 10 ? `0${month}` : `${month}`}-${
      date < 10 ? `0${date}` : `${date}`
    }`;
  };
  const getNotification = async () => {
    const data = {
      phone: phone,
      page: currentPage,
    };

    try {
      const result = await axios.post(API_GET_NOTIFY_POST, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("thông báo", result);
      console.log("date");
      setNotificationList(result.data);
      setFullHeight(false);
    } catch (error) {
      if (error.response.status === 401) {
        window.location.reload();
      }
    }
    //next data
    const data1 = {
      phone: phone,
      page: currentPage + 1,
    };

    const result1 = await axios.post(API_GET_NOTIFY_POST, data1, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (result1.data.length === 0) {
      setNextPage(false);
    } else {
      setNextPage(true);
    }
  };

  useEffect(() => {
    if (render) {
      console.log("render lại thông báo");
      getNotification();
    }
  }, [currentPage]);

  return (
    <>
      <div>
        <button
          onClick={() => {
            setShowNotification(true);
            getNotification();
            render = true;
            setCurrentPage(1);
          }}
        >
          <FontAwesomeIcon icon={faBell} className="bell" />
        </button>
      </div>
      <Modal
        isOpen={showNotification}
        toggle={() => {
          setShowNotification(false);
          render = false;
        }}
        size="lg"
      >
        <ModalHeader
          tag={"h3"}
          style={{ color: `#0b0b90` }}
          className="justify-content-center"
        >
          Thông báo của bạn
        </ModalHeader>
        <ModalBody style={{ height: `450px` }}>
          {notificationList.map((item) => (
            <div
              key={item.id}
              className="text-start"
              style={{ color: `black` }}
            >
              <p
                className="p-0 mb-0 text-notification box-notification"
                style={{
                  height: `${fullHeight ? `100%` : `80px`}`,
                }}
                onClick={() => setFullHeight(!fullHeight)}
              >
                {item.description}
              </p>
              <p
                className="text-end"
                style={{
                  color: `gray`,
                }}
              >
                {getCurrentDate(item.date)}
              </p>
              <hr />
            </div>
          ))}
        </ModalBody>
        <div className="text-center d-flex flex-column pb-3">
          <Row className="justify-content-center">
            <Col md={1} ld={1}>
              <button
                style={{
                  width: `20px`,
                  fontSize: `20px`,
                  backgroundColor: `white`,
                }}
                onClick={() => {
                  if (currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                  }
                }}
                disabled={currentPage === 1}
              >
                <FontAwesomeIcon icon={faCaretLeft} />
              </button>
            </Col>
            <Col md={1} ld={1}>
              <button
                style={{
                  width: `10px`,
                  fontSize: `20px`,
                  backgroundColor: `white`,
                }}
              >
                {currentPage}
              </button>
            </Col>
            <Col md={1} ld={1}>
              <button
                style={{
                  width: `20px`,
                  fontSize: `20px`,
                  backgroundColor: `white`,
                }}
                onClick={() => {
                  setCurrentPage(currentPage + 1);
                }}
                disabled={!nextPage}
              >
                <FontAwesomeIcon icon={faCaretRight} />
              </button>
            </Col>
          </Row>
          <Row md={7} style={{ margin: `auto` }}>
            <button
              className="m-0"
              onClick={() => {
                setShowNotification(false);
              }}
            >
              Close
            </button>
          </Row>
        </div>
      </Modal>
    </>
  );
}
