import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Col,
  Row,
  Table,
  Button,
  Modal,
  ModalFooter,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import "./style.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import { toast } from "react-toastify";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import "./style.css";

const token = localStorage.getItem("accessToken");
const phone = localStorage.getItem("phone");
const API_GET_APPOINTMENT_TO_UPDATE =
  "http://localhost:8080/rade/patient/appointment/load-update";
const API_GET_DISCOUNT_FOLLOW_SERVICEID =
  "http://localhost:8080/rade/discount/";
const API_GET_TIME_POST =
  "http://localhost:8080/rade/patient/appointment/check-doctor";
const API_UPDATE_APPOINTMENT =
  "http://localhost:8080/rade/patient/appointment/update";
const API_CANCEL_APPOINTMENT =
  "http://localhost:8080/rade/patient/appointment/cancel";
export default function UpdateAppointment() {
  const [isOpen, setIsOpen] = useState(false);
  const [serviceList, setServiceList] = useState([]);
  const [appointment, setAppointment] = useState();
  const [discount, setDiscount] = useState([]);
  const [doctorList, setDoctorList] = useState([]);
  const [date, setDate] = useState("");
  const [timeCome, setTimeCome] = useState("");
  const [doctorSelected, setDoctorSelected] = useState(null);
  const [serviceIdList, setServiceIdList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  //
  const [slotSelected, setSlotSelected] = useState([]);
  const [isActive, setIsActive] = useState("");
  const [today, setToday] = useState("");
  const [maxdate, setMaxdate] = useState("");

  const getToday = (separator = "") => {
    let newDate = new Date();
    newDate.setDate(newDate.getDate() + 1);
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    setToday(
      `${year}${separator}-${month < 10 ? `0${month}` : `${month}`}-${
        date < 10 ? `0${date}` : `${date}`
      }`
    );
    return `${year}${separator}-${
      month < 10 ? `0${month}` : `${month}`
    }-${separator}${date}`;
  };

  const maxday = (separator = "") => {
    let newDate = new Date();
    newDate.setDate(newDate.getDate() + 7);
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    setMaxdate(
      `${year}${separator}-${month < 10 ? `0${month}` : `${month}`}-${
        date < 10 ? `0${date}` : `${date}`
      }`
    );
    return `${year}${separator}-${
      month < 10 ? `0${month}` : `${month}`
    }-${separator}${date}`;
  };
  const location = useLocation();
  const navigate = useNavigate();
  const getSlot = async (e) => {
    // if (date === null || date.length === 0) {
    //   toast.warn("Bạn vui lòng chọn ngày");
    //   return;
    // }
    setSlotSelected([]);
    const data = {
      appointmentId: appointment.id,
      branchId: 1,
      doctorId: doctorSelected.id,
      date: date,
      serviceId: serviceIdList,
    };
    console.log("data", data);
    const result = await axios
      .post(API_GET_TIME_POST, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        // console.log(error);
        if (error.message.indexOf("401") > -1) {
          // window.location.replace("/");
        }
      });

    if (result.data) {
      setSlotSelected(result.data);
    } else {
      setSlotSelected([]);
    }
  };

  // useEffect(() => {
  //   setTimeCome("Vui lòng chọn thời gian");
  // }, [doctorSelected, date]);

  useEffect(() => {
    getAppointment();
    getToday();
    maxday();
  }, []);

  useEffect(() => {
    getSlot();
  }, [date, doctorSelected]);

  const getAppointment = async () => {
    console.log("render");
    const data = {
      phone: phone,
      appointmentId: location.state.id,
    };
    let tmpDiscount = [];
    //lấy thông tin appointmetnt
    const result = await axios.post(API_GET_APPOINTMENT_TO_UPDATE, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log("result.data", result);
    // console.log("result.data.status", result.status);
    if (result) {
      setServiceList(result.data.serviceList);
      setAppointment(result.data.appointment);
      setDoctorList(result.data.doctorList);
      setDoctorSelected(result.data.appointment.doctor);
      setDate(result.data.appointment.appointmentDate);
      setTimeCome(result.data.appointment.appointmentTime);
      setIsActive(result.data.appointment.appointmentTime);
    }
    let tmpServiceList = [];
    result.data.serviceList.map(async (item, key) => {
      tmpServiceList = [...tmpServiceList, item.id];
      setServiceIdList(tmpServiceList);
      const discountResult = await axios.get(
        API_GET_DISCOUNT_FOLLOW_SERVICEID + item.id
      );
      let x = {};
      if (discountResult) {
        if (
          discountResult.data.percentage !== null ||
          discountResult.data.percentage !== undefined
        ) {
          x.percentage = discountResult.data.percentage + "%";
          x.id = item.id;
          x.name = item.name;
        }
        tmpDiscount = [...tmpDiscount, x];
        //   console.log(tmpDiscount);
        setDiscount(tmpDiscount);
      }
    });
  };
  // đóng mở dropdown
  const toggle = async () => {
    await setIsOpen(!isOpen);
  };

  const submitUpdateAppointment = async () => {
    const dataUpdate = {
      appointmentDTO: {
        id: appointment.id,
        branchId: appointment.branch.id,
        doctorId: doctorSelected.id,
        date: date,
        time: timeCome,
      },

      phone: phone,
      serviceIdList: serviceIdList,
    };

    console.log(dataUpdate);
    const result = await axios
      .post(API_UPDATE_APPOINTMENT, dataUpdate, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
        toast.success("Thay đổi lịch hẹn thành công");
        navigate("/user/history");
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 410) {
          toast.warn("Thao tác chỉ được thực hiện trước lịch hẹn 1 ngày.");
        }
      });

    // if (result.response?.status === 200) {

    // } else {
    // }
  };

  const CancelAppointment = (e) => {
    // if (checkAccount()) {
    const data = {
      phone: phone,
      appointmentId: location.state.id,
    };
    console.log(data);
    axios
      .post(API_CANCEL_APPOINTMENT, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        toast.success("Hủy lịch thành công");
        navigate("/user/history");
      })
      .catch((error) => {
        if (error.response.status === 423) {
          toast.warn("Bạn đã sử dụng quá 3 lần hủy trong 1 tháng.");
        }
        if (error.response.status === 410) {
          toast.warn("Thao tác chỉ được thực hiện trước lịch hẹn 1 ngày.");
        }
      });
    // }
  };

  return (
    <>
      {appointment ? (
        <div className="pb-4">
          <div
            className="p-2 pt-4"
            style={{ color: `#0b0b90`, fontSize: `25px` }}
          >
            <h3>Cập nhật thông tin lịch hẹn</h3>
          </div>
          <div>
            <Row className="justify-content-start p-0">
              <Col className="p-0" sm={3} lg={2} md={3}>
                <h5 className="text-start ps-5" style={{ color: "gray" }}>
                  Địa chỉ:
                </h5>
              </Col>
              <Col className="text-start" sm={9} lg={9} md={9}>
                <p>
                  {/* {appointment.map((item) => item.branch.name)} */}
                  {appointment.branch.name}-{appointment.branch.district.name},{" "}
                  {appointment.branch.district.province.name}
                </p>
              </Col>
            </Row>
            <Row>
              <h5 className="text-start ps-5" style={{ color: "gray" }}>
                Dịch vụ bạn đã chọn:
              </h5>
            </Row>
            <Row className="justify-content-center">
              <Col lg={8} className="p-0">
                {" "}
                <Table bordered hover className="table-history bordered">
                  <thead>
                    <th>Dịch vụ</th>
                    <th>Giá</th>
                    <th>Khuyến mãi</th>
                  </thead>
                  <tbody>
                    {serviceList.map((item, keyI) => {
                      return (
                        <tr key={item.id}>
                          <td>{item.name}</td>
                          <td>
                            {item.minPrice}(VNĐ) ~ {item.maxPrice}(VNĐ)
                          </td>

                          {discount.map((e, key) => {
                            if (e.id === item.id) {
                              return (
                                <td>
                                  {e.percentage === "undefined%"
                                    ? "Không có khuyến mãi"
                                    : e.percentage}
                                </td>
                              );
                            }
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Col>
            </Row>
            <Row className="justify-content-center p-0">
              <Col lg={6} md={6}>
                <Row className="justify-content-between">
                  <Col className="p-0" sm="auto" lg={3} md={3}>
                    <h5
                      className="text-start ps-5"
                      style={{ color: "gray", fontSize: `20px` }}
                    >
                      Bác sĩ:
                    </h5>
                  </Col>
                  <Col className="text-start" sm="auto" lg={8} md={9}>
                    <Dropdown
                      isOpen={isOpen}
                      toggle={() => toggle()}
                      className="text-start"
                    >
                      <DropdownToggle
                        className="text-center"
                        style={{
                          backgroundColor: `white`,
                          color: `black`,
                          width: `100%`,
                          fontSize: `19px`,
                        }}
                        caret
                      >
                        {doctorSelected.name}
                      </DropdownToggle>
                      <DropdownMenu style={{ width: `100%` }}>
                        {doctorList.map((item, key) => {
                          return (
                            <DropdownItem
                              key={item.id}
                              onClick={() => {
                                setTimeCome("Vui lòng chọn thời gian");
                                setDoctorSelected(item);
                                setIsActive("");
                              }}
                            >
                              {item.name}
                            </DropdownItem>
                          );
                        })}
                      </DropdownMenu>
                    </Dropdown>
                  </Col>
                </Row>
              </Col>
              <Col lg={6} md={6}>
                <Row>
                  <Col className="p-0" sm="auto" lg={3} md={3}>
                    <h5 className="text-start ps-5" style={{ color: "gray" }}>
                      Chọn ngày:
                    </h5>
                  </Col>
                  <Col lg={6} md={9}>
                    <input
                      style={{
                        border: `1px solid black`,
                        borderRadius: `5px`,
                        padding: `0.375rem 0.75rem`,
                      }}
                      className="text-center input-time"
                      type="date"
                      value={date}
                      pattern="\d{4}-\d{2}-\d{2}"
                      min={today}
                      max={maxdate}
                      onChange={(e) => {
                        setTimeCome("Vui lòng chọn thời gian");
                        // var day = new Date(e.currentTarget.valueAsDate).getUTCDay();
                        if (
                          [0].includes(e.currentTarget.valueAsDate.getUTCDay())
                        ) {
                          toast.warn(
                            "Bạn vui lòng không được chọn ngảy Chủ Nhật. Bạn vui lòng chọn ngày khác"
                          );
                          setDate("");
                        } else {
                          let separator = "";
                          let date = e.target.valueAsDate.getDate();
                          let month = e.target.valueAsDate.getMonth() + 1;
                          let year = e.target.valueAsDate.getFullYear();

                          let dateBooking = `${year}${separator}-${
                            month < 10 ? `0${month}` : `${month}`
                          }-${date < 10 ? `0${date}` : `${date}`}`;
                          console.log("date", dateBooking);
                          setDate(dateBooking);
                          setIsActive("");
                          // getSlot(e);
                        }
                      }}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className="justify-content-start p-0">
              {/* <Col className="d-flex">
                <h5 style={{ color: "gray" }}>Thời gian dự kiến: </h5>
                <p className="ps-3">{timeCome}</p>
              </Col> */}
            </Row>
            <Row>
              <Col className="p-0" sm="auto" lg={2} md={3}>
                <h5 className="text-start ps-5" style={{ color: "gray" }}>
                  Chọn thời gian:
                </h5>
              </Col>
            </Row>
            <Row className="justify-content-center p-0">
              <Col lg={8} className="p-0">
                {" "}
                <div className="slot" style={{ textAlign: `left` }}>
                  <Row lg="auto">
                    {slotSelected.map((item, key) => {
                      let tmp = item.option.split("-");

                      return (
                        <Col
                          lg={2}
                          md={3}
                          xs={4}
                          style={{ color: `black` }}
                          className="btn-select-time"
                        >
                          <Button
                            style={
                              isActive === item.option
                                ? {
                                    backgroundColor: `#0b0b90`,
                                    color: `white`,
                                  }
                                : null
                            }
                            onClick={() => {
                              setTimeCome(item.option);
                              setIsActive(item.option);
                              // clickTimeFunction(key + 1);
                            }}
                          >
                            {tmp[0]}
                          </Button>
                        </Col>
                      );
                    })}
                  </Row>
                  {!isActive ? (
                    <Row>
                      <p style={{ color: `red` }}>
                        Vui lòng chọn lại thời gian
                      </p>
                    </Row>
                  ) : null}
                </div>
              </Col>
            </Row>
            <Row className="justify-content-between ms-5 me-5" lg={12}>
              <Col lg={3} md={3}>
                <Row>
                  <Button onClick={() => submitUpdateAppointment()}>
                    Thay đổi
                  </Button>
                </Row>
              </Col>
              <Col lg={3} md={3} className="p-3">
                <Row>
                  <Button onClick={() => navigate("/user/history")}>
                    Hủy bỏ thay đổi
                  </Button>
                </Row>
              </Col>
              <Col lg={3} md={3}>
                <Row>
                  <Button
                    className="button-cancel-appointment"
                    onClick={() => {
                      setModalOpen(true);
                    }}
                  >
                    Hủy bỏ lịch hẹn
                  </Button>
                </Row>
              </Col>
            </Row>
          </div>
          <Modal isOpen={modalOpen}>
            <ModalHeader tag={"h4"} className="text-center">
              Nhắc nhở
            </ModalHeader>
            <ModalBody>
              <p>Bạn có chắc chắn muốn hủy lịch hẹn này hay không?</p>
            </ModalBody>
            <ModalFooter>
              <Row className="justify-content-center">
                <Col mg={3} className="m2-5">
                  <Row>
                    <button
                      onClick={(e) => {
                        CancelAppointment(e);
                        setModalOpen(false);
                      }}
                      className="button-cancel-appointment"
                      style={{
                        fontSize: `18px`,
                        padding: `5px`,
                        width: `100px`,
                      }}
                    >
                      Có
                    </button>
                  </Row>
                </Col>
                <Col mg={3} className="me-2">
                  <Row>
                    <button
                      onClick={() => setModalOpen(false)}
                      style={{
                        fontSize: `18px`,
                        padding: `5px`,
                        width: `100px`,
                      }}
                    >
                      Không
                    </button>
                  </Row>
                </Col>
              </Row>
            </ModalFooter>
          </Modal>
        </div>
      ) : (
        console.log("appointment rỗng")
      )}
    </>
  );
}
