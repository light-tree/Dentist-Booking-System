import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table, Row, Col, Container, Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBandage,
  faCaretDown,
  faCaretLeft,
  faCaretRight,
  faCaretUp,
  faIdBadge,
  faTag,
  faTags,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import "./style.css";
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2,
} from "react-html-parser";
const token = localStorage.getItem("accessToken");
const phone = localStorage.getItem("phone");
// const API_SEND_FEEDBACK = "http://localhost:8080/rade/patient/feedback/send/";
// const API_GET_FEEDBACK = "http://localhost:8080/rade/feedback";
const API_GET_DISCOUNT_FOLLOW_SERVICEID =
  "http://localhost:8080/rade/discount/";
// var feedback = [];
var today = new Date();
export default function ServiceInfo() {
  const [serviceList, setServiceList] = useState([]);
  const [serviceSelected, setServiceSelected] = useState([]);
  const [nameServiceType, setNameServiceType] = useState("");
  const [serviceAndDiscount, setServiceAndDiscount] = useState([]);
  const [serviceIDSelected, setServiceIDSelected] = useState("");
  const { id } = useParams();
  const [discount, setDiscount] = useState({});
  const API_GET_SERVICE_BY_SERVICETYPE_ID =
    "http://localhost:8080/rade/service/discount/";
  useEffect(() => {
    console.log("render");
    setTimeout(() => {
      axios.get(API_GET_SERVICE_BY_SERVICETYPE_ID + id).then((res) => {
        console.log(res.data);
        let serviceList = res.data;
        let tmp = [];
        serviceList.map((item) => {
          tmp = [...tmp, item.service];
        });
        setServiceAndDiscount(res.data);
        console.log(tmp);
        setServiceList(tmp);
        setNameServiceType(tmp.at(0).serviceType.name);
        setServiceIDSelected(tmp.at(0).id);
        setServiceSelected([res.at(0)]);
        // setServiceList(res.data);
      });
    }, 0);
  }, [id]);

  // var formatMinPrice = Intl.NumberFormat("vi-VN", {
  //   style: "currency",
  //   currency: "VND",
  // }).format(service.minPrice);
  // var formatMaxPrice = Intl.NumberFormat("vi-VN", {
  //   style: "currency",
  //   currency: "VND",
  // }).format(service.maxPrice);

  useEffect(() => {
    setTimeout(() => {
      let tmpDiscount = {};
      axios
        .get(API_GET_DISCOUNT_FOLLOW_SERVICEID + serviceIDSelected)
        .then((res) => {
          if (res.data !== null) {
            tmpDiscount.name = res.data.name;
            tmpDiscount.percentage = res.data.percentage + "%";
            tmpDiscount.description = res.data.description;
            tmpDiscount.start_date = res.data.startDate;
            tmpDiscount.end_date = res.data.endDate;
          }
          setDiscount(tmpDiscount);
        });
    }, 0);
  }, [serviceIDSelected]);

  // const getServiceSelected = (e) => {};
  const MapServiceType = () => {
    return (
      <ul style={{ padding: `0px` }}>
        {serviceList.map((item, key) => {
          return (
            <li className="d-flex flex-row justify-content-center">
              <button
                className="d-flex flex-row justify-content-center"
                id={item.id}
                value={item.id}
                onClick={(e) => {
                  setServiceSelected([item]);
                  let tmp = {};
                  axios
                    .get(API_GET_DISCOUNT_FOLLOW_SERVICEID + item.id)
                    .then((res) => {
                      // console.log(res.data);
                      // setDiscount({
                      if (res.data !== null) {
                        tmp.name = res.data.name;
                        tmp.percentage = res.data.percentage + "%";
                        tmp.description = res.data.description;
                        tmp.start_date = res.data.startDate;
                        tmp.end_date = res.data.endDate;
                      }
                      setDiscount(tmp);
                      // });
                    })
                    .then(() => {
                      // console.log(tmp.name);
                      console.log("discount");
                      console.log(discount);
                    });
                }}
              >
                <p className="m-0">{item.name}</p>
                {serviceAndDiscount.at(key).discount ? (
                  <div className="ps-3 icon-tag">
                    <FontAwesomeIcon icon={faTags} />
                  </div>
                ) : (
                  ""
                )}
              </button>
            </li>
          );
        })}
      </ul>
    );
  };

  //=========================================
  //ước tính thòi gian
  const estimateTime = (time) => {
    time = time * 60;
    let time_minute = time % 60;
    if (time < 60) {
      return `${time_minute} phút`;
    }
    let time_hour = (time - time_minute) / 60;

    if (time_minute === 0) {
      return `${time_hour} giờ `;
    } else {
      return `${time_hour} giờ ${time_minute} phút`;
    }
  };

  const [icon, setIncon] = useState(true); // true: down      false: up
  const onClickFuction = async () => {
    if (icon) {
      // document.getElementById("discount-info").style.display = "none";
      setIncon(!icon);
    } else {
      // document.getElementById("discount-info").style.display = "block";
      setIncon(!icon);
    }
  };

  const ShowDiscount = (idServiceSelected) => {
    if (discount.name === null || discount.name === undefined) {
      return;
    } else {
      return (
        <div
          className="p-2"
          style={{
            border: `2px solid black`,
            borderRadius: `7px`,
            backgroundColor: `white`,
          }}
        >
          <div className="d-flex flex-row">
            <h5 className="d-flex flex-row">
              <h5 style={{ color: `red` }} className="ms-1 me-1">
                {discount.name}
              </h5>
              <h5 className="ms-1" style={{ color: `red` }}>
                Khuyến mãi {discount.percentage}
              </h5>
            </h5>
            {/* <button
              // id="btn-view-more"
              style={{
                marginLeft: `20px`,
                backgroundColor: `white`,
                padding: `5px`,
                paddingTop: 0,
              }}
              onClick={() => onClickFuction()}
            >
              {icon ? (
                <FontAwesomeIcon icon={faCaretDown} />
              ) : (
                <FontAwesomeIcon icon={faCaretUp} />
              )}
            </button> */}
          </div>
          <div style={{ display: `block` }}>
            <Row className="d-flex flex-row justify-content-start">
              <Col style={{ fontSize: `18px`, paddingLeft: `20px` }} lg={3}>
                Thời gian áp dụng :{" "}
              </Col>
              <Col style={{ paddingLeft: `4px`, display: `flex` }} lg={8}>
                <p className="m-0" style={{ paddingRight: `10px` }}>
                  Từ
                </p>
                <p
                  className="m-0"
                  style={{ color: `red`, paddingRight: `10px` }}
                >
                  {discount.start_date}
                </p>
                <p className="m-0" style={{ paddingRight: `10px` }}>
                  đến
                </p>{" "}
                <p
                  className="m-0"
                  style={{ color: `red`, paddingRight: `10px` }}
                >
                  {" "}
                  {discount.end_date}
                </p>
              </Col>
            </Row>
            <Row>
              <Col style={{ fontSize: `18px`, paddingLeft: `20px` }} lg={3}>
                Mô tả :
              </Col>
              <Col style={{ paddingLeft: `4px` }} lg={8}>
                {discount.description}
              </Col>
            </Row>
          </div>
        </div>
      );
    }
  };

  const ShowServiceDetail = () => {
    var lengthServiceSElected = serviceSelected.length;
    var tmp = serviceList.at(0);
    if (lengthServiceSElected === 0) {
      if (typeof tmp !== "undefined" && tmp != null) {
        setServiceIDSelected(tmp.id);
        console.log("tmp", tmp);
        return (
          <>
            <div>
              <h2 style={{ textAlign: `left` }}>{tmp.name}</h2>
              <div className="d-flex flex-row p-1">
                <h5>Thời gian làm việc ước tính: </h5>
                <p style={{ paddingLeft: `5px` }}>
                  {estimateTime(tmp.estimatedTime)}
                </p>
              </div>
              <div className="d-flex flex-row p-1">
                <h5>Tầm giá: </h5>
                <p style={{ paddingLeft: `5px` }}>
                  {Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(tmp.minPrice)}{" "}
                  -{" "}
                  {Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(tmp.maxPrice)}
                  {/* {tmp.minPrice} (VNĐ) - {tmp.maxPrice} (VNĐ) */}
                </p>
              </div>
              {ShowDiscount(tmp.id)}
              <div
                style={{
                  width: `100%`,
                  textAlign: `center`,
                  margin: `10px 10px`,
                }}
              >
                <img
                  style={{ width: `40vw` }}
                  src={`https://drive.google.com/uc?id=${
                    serviceList.at(0).url
                  }`}
                  className="img-service"
                ></img>
              </div>
              {ReactHtmlParser(serviceList.at(0).description)}
            </div>
          </>
        );
      }
    } else {
      return (
        <>
          {serviceSelected.map((item) => {
            setServiceIDSelected(item.id);
            return (
              <div>
                <h2 style={{ textAlign: `left` }}>{item.name}</h2>
                <div className="d-flex flex-row p-1">
                  <h5>Thời gian làm việc ước tính:</h5>
                  <p style={{ paddingLeft: `5px` }}>
                    {estimateTime(item.estimatedTime)}
                  </p>
                </div>
                <div className="d-flex flex-row p-1">
                  <h5>Tầm giá: </h5>
                  <p style={{ paddingLeft: `5px` }}>
                    {Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(tmp.minPrice)}{" "}
                    -{" "}
                    {Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(tmp.maxPrice)}
                    {/* {tmp.minPrice} (VNĐ) - {tmp.maxPrice} (VNĐ) */}
                  </p>
                  {/* <p style={{ paddingLeft: `5px` }}>
                    {tmp.minPrice} (VNĐ) - {tmp.maxPrice} (VNĐ)
                  </p> */}
                </div>
                {ShowDiscount(tmp.id)}
                <div
                  style={{
                    width: `100%`,
                    textAlign: `center`,
                    margin: `10px 10px`,
                  }}
                >
                  <img
                    style={{ width: `40vw` }}
                    src={`https://drive.google.com/uc?id=${item.url}`}
                  ></img>
                </div>

                {ReactHtmlParser(item.description)}
              </div>
            );
          })}
        </>
      );
    }
  };

  // =======================

  //==============================
  return (
    <div className="service-detail-container">
      <div className="side-bar">
        <div>
          <h4>{nameServiceType}</h4>
        </div>
        <MapServiceType />
      </div>
      <div className="service-detail">
        <div className="desc">
          <ShowServiceDetail />
        </div>
      </div>

      <div></div>
    </div>
  );
}
