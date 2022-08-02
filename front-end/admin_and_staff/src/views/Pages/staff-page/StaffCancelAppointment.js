import appointmentApi from "api/AppointmentApi";
import branchApi from "api/branchApi";
import doctorApi from "api/doctorApi";
import PanelHeader from "components/PanelHeader/PanelHeader";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "reactstrap";
import AppointmentTable from "views/Tables/AppointmentTable";
import AppointmentTableCheckCancel from "views/Tables/AppointmentTableCheckCancel";
import "./style.css";

export default function StaffCancelAppointment(props) {
  const [phoneSearch, setphoneSearch] = useState("");
  const [bookingList, setBookingList] = useState([]);
  const [branchSearch, SetBranchSearch] = useState(0);
  const [dateSearch, SetDateSearch] = useState("");
  const [doctorSearch, setDoctorSearch] = useState(0);
  const [branchList, setBranchList] = useState([]);
  const [doctorList, setDoctorList] = useState([]);
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
      SetBranchSearch(result.data.branchList.at(0).id);
      const res = await doctorApi.getDoctorByBranchId(
        result.data.branchList.at(0).id
      );
      if (res) {
        console.log("doctor list", res);
        setDoctorList(res);
      } else {
        console.log("không thành công");
      }
    }
  };

  useEffect(() => {
    getAppointListForStaff();
  }, [phoneSearch, dateSearch, branchSearch, doctorSearch]);

  const getAppointListForStaff = async () => {
    var data;

    if (dateSearch.length === 0) {
      data = {
        status: [0, 4],
        date: getToday(),
        phone: phoneSearch,
        branchId: branchSearch,
        doctorId: doctorSearch,
        serviceId: 0,
      };
    } else {
      // var datetmp = dateSearch.valueAsDate;
      // console.log(datetmp);

      data = {
        status: [0, 4],
        date: dateSearch,
        phone: phoneSearch,
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
      status: [0, 4],
      date: getToday(),
      phone: phoneSearch,
      branchId: branchSearch,
      doctorId: doctorSearch,
      serviceId: 0,
    });

    const result = await appointmentApi.getAppointListForStaff(data);
    if (result?.data) {
      console.log("data appointment", result?.data);
      setBookingList(result.data);
    }
  };

  useEffect(() => {
    getAllBranch();
    getAllAppointment();
  }, []);

  useEffect(async () => {
    const res = await doctorApi.getDoctorByBranchId(branchSearch);
    if (res) {
      console.log("doctor list", res);
      setDoctorList(res);
    } else {
      console.log("không thành công");
    }
  }, [branchSearch]);

  return (
    <div>
      <div className="content" style={{ margin: `0 20px` }}>
        <Container fluid>
          <form className="mt-3">
            <div class="form-group d-flex flex-column text-left">
              <Row>
                <Col lg={6} md={12} xs={12}>
                  <Row className="justify-content-center">
                    <Col md={4} xs={12}>
                      <label for="inputdefault" className="m-3">
                        Phone
                      </label>
                    </Col>
                    <Col md={8}>
                      <input
                        class="form-control"
                        id="inputdefault"
                        style={{
                          fontSize: `16px`,
                          backgroundColor: `white`,
                          borderColor: `black`,
                          borderRadius: `6px`,
                        }}
                        type="text"
                        value={phoneSearch}
                        placeholder="Enter the number phone"
                        onChange={(e) => {
                          setphoneSearch(e.target.value.trim());
                        }}
                      ></input>
                    </Col>
                  </Row>
                  <Row className="justify-content-center">
                    <Col md={4}>
                      <label for="inputdefault" className="m-3">
                        Branch
                      </label>
                    </Col>
                    <Col md={8}>
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
                          setDoctorSearch(0);
                        }}
                      >
                        {branchList.map((item, key) => {
                          if (key === 0) {
                            return (
                              <option
                                className="text-center"
                                value={item.id}
                                selected
                              >
                                {item.name}
                              </option>
                            );
                          }
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
                <Col lg={6} md={12} xs={12}>
                  <Row className="justify-content-center">
                    <Col md={4}>
                      <label for="inputdefault" className="m-3">
                        Doctor
                      </label>
                    </Col>
                    <Col md={8}>
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
                          ----- Select doctor ----
                        </option>
                        {doctorList.map((item) => {
                          return (
                            <option className="text-center" value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </select>
                    </Col>
                  </Row>
                  <Row className="justify-content-center">
                    <Col md={4}>
                      <label for="inputdefault" className="m-3">
                        Date
                      </label>
                    </Col>
                    <Col md={8}>
                      <input
                        class="form-control"
                        id="inputdefault"
                        style={{
                          fontSize: `16px`,
                          backgroundColor: `white`,
                          borderColor: `black`,
                          borderRadius: `6px`,
                        }}
                        min={getToday()}
                        type="date"
                        value={
                          dateSearch?.length !== 0 ? dateSearch : getToday()
                        }
                        onChange={(e) => {
                          let separator = "";
                          let date = e.target.valueAsDate.getDate();
                          let month = e.target.valueAsDate.getMonth() + 1;
                          let year = e.target.valueAsDate.getFullYear();
                          let tmp = `${year}${separator}-${
                            month < 10 ? `0${month}` : `${month}`
                          }-${date < 10 ? `0${date}` : `${date}`}`;
                          SetDateSearch(tmp);
                        }}
                      ></input>
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
        <AppointmentTableCheckCancel bookingList={bookingList} />
      </div>
    </div>
  );
}
