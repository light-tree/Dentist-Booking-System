import {
  faCaretLeft,
  faCaretRight,
  faL,
  faQuoteRight,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Col, Row } from "reactstrap";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import "./style.css";
const API_GET_ALL_SERVICE = "http://localhost:8080/rade/service/";
const API_GET_FEEDBACK = "http://localhost:8080/rade/feedback";

export default function Feedback() {
  const [serviceSelected, setServiceSelected] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [serviceList, setServiceList] = useState([]);
  const [pageFeedback, setPageFeedback] = useState(1);
  const [feedbackList, setFeedbackList] = useState([]);
  const [next, setNext] = useState(true);
  const [previous, setPrevious] = useState(true);
  const getAllService = async () => {
    const result = await axios.get(API_GET_ALL_SERVICE).catch((error) => {
      console.log("sai rồi kìa");
      console.error();
    });
    if (result.data) {
      setServiceList(result.data);
    }
  };

  const getFeedback = async () => {
    if (pageFeedback === 1) {
      setPrevious(false);
    } else {
      setPrevious(true);
    }
    //lấy trang hiện tại

    const data = {
      serviceId: serviceSelected ? serviceSelected.id : 0,
      page: pageFeedback,
    };
    console.log("data feedback", data);
    const result = await axios.post(API_GET_FEEDBACK, data).catch((error) => {
      console.log(error);
    });

    if (result.data) {
      setFeedbackList(result.data);
      console.log("list feedback", result.data);
    }

    //lấy trang tiếp theo
    const dataNext = {
      serviceId: serviceSelected ? serviceSelected.id : 0,
      page: pageFeedback + 1,
    };
    await axios
      .post(API_GET_FEEDBACK, dataNext)
      .then((res) => {
        console.log("next data", res.data);
        if (res.data.length === 0) {
          setNext(false);
        } else {
          setNext(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getAllService();
  }, []);
  //thực hiện lại khi serviceId and pageFeedback thay đổi
  useEffect(() => {
    getFeedback();
  }, [pageFeedback, serviceSelected]);

  const toggle = async () => {
    await setIsOpen(!isOpen);
  };
  return (
    <div>
      <Row>
        <h3 style={{ fontSize: `25px`, color: `#0b0b90` }}>
          Phản hồi từ khách hàng
        </h3>
      </Row>
      {/* <Row className="filter-service justify-content-center">
        <Col lg={3} md={3}>
          <h5>Xem theo loại dịch vụ</h5>
        </Col>
        <Col lg={3} md={3}>
          <Dropdown isOpen={isOpen} toggle={() => toggle()}>
            <DropdownToggle
              style={{ backgroundColor: `white`, color: `black` }}
              caret
            >
              {serviceSelected === null
                ? "Chọn loại dịch vụ"
                : serviceSelected.name}
            </DropdownToggle>
            <DropdownMenu style={{ width: `100%` }}>
              <DropdownItem
                onClick={() => {
                  setServiceSelected(null);
                }}
              >
                Chọn tất cả
              </DropdownItem>
              {serviceList.map((item, key) => {
                return (
                  <DropdownItem
                    key={item.id}
                    onClick={() => {
                      setServiceSelected(item);
                      setPageFeedback(1);
                    }}
                  >
                    {item.name}
                  </DropdownItem>
                );
              })}
            </DropdownMenu>
          </Dropdown>
        </Col>
      </Row> */}
      <Row className="justify-content-center">
        {feedbackList.map((item) => {
          return (
            <Col
              lg={3}
              className="bordered m-3 pt-3 feedback-item"
              style={{
                backgroundColor: `white`,
                position: `relative`,
              }}
            >
              <div
                style={{
                  position: `absolute`,
                  top: `10px`,
                  left: `0`,
                  right: `0`,
                }}
              >
                <FontAwesomeIcon
                  className="feedback-icon"
                  icon={faQuoteRight}
                />
              </div>
              <div className="mt-3 mb-3 p-2 box-feedback">
                <Row>
                  <h5 className="text-start m-0">
                    {item.appointment.account.fullName}
                  </h5>
                  <p className="text-start ps-4" style={{ fontSize: `10px` }}>
                    {item.time}
                  </p>
                </Row>
                <Row>
                  <p className="text-start ps-4 mb-3 text-break">
                    {item.content}
                  </p>
                </Row>
              </div>
            </Col>
          );
        })}
      </Row>
      <Row className="mb-3 justify-content-center">
        <Col lg={1}>
          <button
            className="m-0 "
            id="button-left"
            disabled={!previous}
            onClick={() => {
              setPageFeedback(pageFeedback - 1);
            }}
          >
            <FontAwesomeIcon icon={faCaretLeft} style={{ fontSize: `25px` }} />
          </button>
        </Col>
        <Col lg={1}>
          <p style={{ fontWeight: `bold` }} className="p-0 m-0">
            {pageFeedback}
          </p>
        </Col>
        <Col lg={1}>
          <button
            className="m-0 "
            id="button-right"
            disabled={!next}
            onClick={() => {
              setPageFeedback(pageFeedback + 1);
            }}
          >
            <FontAwesomeIcon icon={faCaretRight} style={{ fontSize: `25px` }} />
          </button>
        </Col>
      </Row>
      <div></div>
    </div>
  );
}
