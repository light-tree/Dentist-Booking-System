import appointmentApi from "api/AppointmentApi";
import branchApi from "api/branchApi";
import doctorApi from "api/doctorApi";
import React, { useEffect, useRef, useState } from "react";
import { Col, Container, Row } from "reactstrap";
import AppointmentTable from "views/Tables/AppointmentTable";
import "./style.css";
import NotificationAlert from "react-notification-alert";
const listStatus = [
  { id: [0, 4], value: "Wating" },
  { id: [1, 5], value: "Done" },
  { id: [2], value: "Absent" },
  { id: [3], value: "Cancel by customer" },
  { id: [6], value: "Cancel by center" },
];

export default function StaffHome(props) {
  const [searchValue, setSearchValue] = useState("");
  const [bookingList, setBookingList] = useState([]);
  const [branchSearch, SetBranchSearch] = useState(0);
  const [dateSearch, SetDateSearch] = useState("");
  const [doctorSearch, setDoctorSearch] = useState(0);
  const [branchList, setBranchList] = useState([]);
  const [doctorList, setDoctorList] = useState([]);
  const [statusSearch, setStatusSearch] = useState("0,4");
  const notify = useRef(null);
  const getToday = (separator = "") => {
    let newDate = new Date();
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();

    return `${year}${separator}-${month < 10 ? `0${month}` : `${month}`}-${
      date < 10 ? `0${date}` : `${date}`
    }`;
  };
  const getAllBranch = async () => {
    const result = await branchApi.getAllBranchForStaff().catch((err) => {
      console.log(err);
    });
    if (result.data) {
      console.log("branch ", result.data.branchList);
      setBranchList(result.data?.branchList);
    }
  };

  const notifyMessage = (message) => {
    var options = {
      place: "tr",
      message: (
        <div>
          <div>Login successfully!!!</div>
        </div>
      ),
      type: "success",
      icon: "now-ui-icons ui-1_bell-53",
      autoDismiss: 5,
    };
    notify.current.notificationAlert(options);
  };
  useEffect(() => {
    if (sessionStorage.getItem("login")) {
      notifyMessage("bdavsu");
      sessionStorage.removeItem("login");
    }
  }, []);

  useEffect(() => {
    getAppointListForStaff();
  }, [statusSearch, searchValue, branchSearch, doctorSearch]);

  const getAppointListForStaff = async () => {
    var data;

    if (dateSearch.length === 0) {
      data = {
        status: statusSearch.split(","),
        date: getToday(),
        phone: searchValue,
        branchId: branchSearch,
        doctorId: doctorSearch,
        serviceId: 0,
      };
    } else {
      var datetmp = dateSearch;
      console.log(datetmp);
      let separator = "";
      let date = datetmp.getDate();
      let month = datetmp.getMonth() + 1;
      let year = datetmp.getFullYear();
      let tmp = `${year}${separator}-${
        month < 10 ? `0${month}` : `${month}`
      }-${separator}${date}`;

      data = {
        status: statusSearch,
        date: datetmp,
        phone: searchValue,
        branchId: branchSearch,
        doctorId: doctorSearch,
        serviceId: 0,
      };
    }

    const result = await appointmentApi.getAppointListForStaff(data);
    if (result?.data) {
      console.log("data appointment", result?.data);
      setBookingList(result.data);
    }
  };

  const getAllAppointment = async () => {
    var data = (data = {
      status: statusSearch.split(","),
      date: getToday(),
      phone: searchValue,
      branchId: branchSearch,
      doctorId: 0,
      serviceId: 0,
    });

    const result = await appointmentApi.getAppointListForStaff(data);
    if (result?.data) {
      console.log("data appointment", result?.data);
      setBookingList(result.data);
    }
  };

  useEffect(() => {
    getDoctorList();
  }, [branchSearch]);

  const getDoctorList = async () => {
    const result = await doctorApi
      .getDoctorByBranchId(branchSearch)
      .then((res) => {
        setDoctorList(res);
      });
  };

  useEffect(() => {
    getAllBranch();
    getAllAppointment();
    if (sessionStorage.getItem("login")) {
    }
  }, []);

  return (
    <div>
      <NotificationAlert
        ref={notify}
        zIndex={9999}
        onClick={() => console.log("hey")}
      />

      <div style={{ margin: `0 20px` }}>
        <Container fluid>
          <form className="mt-3">
            <div className="form-group d-flex flex-column text-left justify-content-center">
              <Row>
                <Col lg={6} md={6} xs={12}>
                  <Row className="justify-content-center">
                    <Col lg={2} md={3} xs={12}>
                      <label
                        // for="inputdefault"
                        style={{ fontSize: `16px`, width: `10vw` }}
                        className="m-3"
                      >
                        Phone
                      </label>
                    </Col>
                    <Col lg={8} md={8} xs={12}>
                      <input
                        class="form-control"
                        id="inputdefault"
                        style={{
                          fontSize: `16px`,
                          backgroundColor: `white`,
                          borderColor: `black`,
                          textAlign: `center`,
                          borderRadius: `6px`,
                        }}
                        type="text"
                        value={searchValue}
                        placeholder="Enter the number phone"
                        onChange={(e) => {
                          setSearchValue(e.target.value.trim());
                        }}
                      ></input>
                    </Col>
                  </Row>
                  <Row className="justify-content-center">
                    <Col lg={2} md={3} xs={12}>
                      <label
                        for="inputdefault"
                        style={{ fontSize: `16px`, width: `10vw` }}
                        className="m-3"
                      >
                        Branch
                      </label>
                    </Col>
                    <Col lg={8} md={8} xs={12}>
                      {" "}
                      <select
                        class="form-control"
                        id="inputdefault"
                        style={{
                          fontSize: `16px`,
                          backgroundColor: `white`,
                          borderColor: `black`,
                          borderRadius: `6px`,
                        }}
                        type="text"
                        value={branchSearch}
                        placeholder="Enter the number phone"
                        onChange={(e) => {
                          SetBranchSearch(e.target.value);
                        }}
                        // defaultValue="0"
                      >
                        <option className="text-center" value="0">
                          ---Select all branch---
                        </option>
                        {branchList.map((item) => {
                          return (
                            <option className="text-center" value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </select>
                    </Col>
                  </Row>
                </Col>
                <Col lg={6} md={6} xs={12}>
                  <Row className="justify-content-center">
                    <Col lg={2} md={3} xs={12}>
                      {" "}
                      <label
                        for="inputdefault"
                        style={{ fontSize: `16px`, width: `10vw` }}
                        className="m-3"
                      >
                        Doctor
                      </label>
                    </Col>
                    <Col lg={8} md={8} xs={12}>
                      {" "}
                      <select
                        class="form-control"
                        id="inputdefault"
                        style={{
                          fontSize: `16px`,
                          backgroundColor: `white`,
                          borderColor: `black`,
                          borderRadius: `6px`,
                        }}
                        type="text"
                        value={doctorSearch}
                        placeholder="Enter the number phone"
                        onChange={(e) => {
                          setDoctorSearch(e.target.value);
                        }}
                        // defaultValue="0"
                      >
                        <option className="text-center" value="0">
                          ---Select all doctor---
                        </option>
                        {doctorList.map((item, key) => {
                          return (
                            <option
                              className="text-center"
                              value={item.id}
                              key={key}
                            >
                              {item.name}
                            </option>
                          );
                        })}
                      </select>
                    </Col>
                  </Row>
                  <Row className="justify-content-center">
                    <Col lg={2} md={3} xs={12}>
                      <label
                        for="inputdefault"
                        style={{ fontSize: `16px`, width: `10vw` }}
                        className="m-3"
                      >
                        Status
                      </label>
                    </Col>
                    <Col lg={8} md={8} xs={12}>
                      <select
                        class="form-control"
                        id="inputdefault"
                        style={{
                          fontSize: `16px`,
                          backgroundColor: `white`,
                          borderColor: `black`,
                          borderRadius: `6px`,
                        }}
                        type="text"
                        value={statusSearch}
                        onChange={(e) => {
                          setStatusSearch(e.target.value);
                        }}
                        // defaultValue="0"
                      >
                        <option
                          className="text-center"
                          value={[0, 1, 2, 3, 4, 5, 6]}
                        >
                          ---Select all status---
                        </option>
                        {listStatus.map((item) => {
                          return (
                            <option className="text-center" value={item.id}>
                              {item.value}
                            </option>
                          );
                        })}
                      </select>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
            {/* <button
              className="button-search mb-4"
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                getAppointListForStaff();
              }}
            >
              <div className="d-flex ">
                <p className="m-0"> Search </p>
                <i className="now-ui-icons ui-1_zoom-bold m-1" />
              </div>
            </button> */}
          </form>
        </Container>
        <AppointmentTable bookingList={bookingList} />
      </div>
    </div>
  );
}
