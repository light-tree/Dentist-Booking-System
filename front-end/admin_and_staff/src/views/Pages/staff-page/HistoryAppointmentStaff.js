import appointmentApi from "api/AppointmentApi";
import branchApi from "api/branchApi";
import doctorApi from "api/doctorApi";
import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Container, Row } from "reactstrap";
import "./style.css";
import NotificationAlert from "react-notification-alert";
import HistoryAppointmentTableStaff from "views/Tables/HistoryAppointmentTableStaff";
const listStatus = [
  { id: [0, 4], value: "Wating" },
  { id: [1, 5], value: "Done" },
  { id: [2], value: "Absent" },
  { id: [3], value: "Cancel by customer" },
  { id: [6], value: "Cancel by center" },
];

export default function HistoryAppointmentStaff(props) {
  const notify = useRef();

  const [searchValue, setSearchValue] = useState();
  const [appointmentHistory, setAppointmentHistory] = useState([]);

  const findAppointment = async () => {
    try {
      const data = {
        phone: searchValue,
      };
      console.log(data);
      const result = await appointmentApi.getHistoryAppointmentForStaff(data);
      console.log(searchValue);
      if (result) {
        console.log("res", result);
        setAppointmentHistory(result.data);
      }
    } catch (error) {
      console.log("Error in appointment history", error);
    }
  };
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
            <div className="form-group d-flex flex-column">
              <Row className="justify-content-center">
                <Col md={3}>
                  <label
                    style={{ fontSize: `16px`, fontWeight: `bold` }}
                    className="text-left m-0 ml-3"
                  >
                    Search phone
                  </label>
                </Col>
                <Col md={5}>
                  <input
                    class="form-control"
                    id="inputdefault"
                    style={{
                      width: `100%`,
                      // padding: `0px 15px`,
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
                <Col md={2}>
                  <Button
                    className="m-0"
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      findAppointment();
                    }}
                    style={{
                      backgroundColor: `white`,
                      color: `black`,
                      fontSize: `16px`,
                      padding: `7px`,
                    }}
                  >
                    <div className="d-flex ">
                      <p className="m-0"> Search </p>
                      <i className="now-ui-icons ui-1_zoom-bold m-1" />
                    </div>
                  </Button>
                </Col>
              </Row>
            </div>
          </form>
        </Container>
        <HistoryAppointmentTableStaff bookingList={appointmentHistory} />
      </div>
    </div>
  );
}
