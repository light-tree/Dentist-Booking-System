import { useEffect, useState } from "react";

// reactstrap components
import {
  Table,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  Button,
  Modal as DangerModal,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { Modal, Image } from "react-bootstrap";
// core components

import appointmentApi from "api/AppointmentApi";
import CustomPagination from "views/Widgets/Pagination";
import Appointment from "views/Pages/dbs-page/edit-form/Appointment";

const verifiedStatus = (
  <div className="stock-status in-stock">
    <button className="stock-button">
      <i className="fa fa-check circle-icon"></i>&nbsp; Confirmed
    </button>
  </div>
);
const notVerifiedStatus = (
  <div className="stock-status in-stock">
    <button className="stock-button">
      <i className="fa fa-circle-icon"></i>&nbsp; In-process
    </button>
  </div>
);
function AppointmentTableCheckCancel(props) {
  const [bookingList, setBookingList] = useState([]);
  const [bookingDetail, setbookingDetail] = useState(null);
  const [bookingServiceList, setBookingServiceList] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage] = useState(3);
  const [isEdit, setIsEdit] = useState(false);
  const [render, setRender] = useState(false);
  const [updateBooking, setUpdateBooking] = useState({});
  const [reason, setReason] = useState("");
  const [cancelappointmentList, setCancelAppointmentList] = useState([]);

  const [lgShow, setLgShow] = useState(false);
  const [modalMini, setModalMini] = useState(false);

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = bookingList.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );
  const toggleModalMini = () => {
    setModalMini(!modalMini);
  };

  const deleteAppointment = async () => {
    setModalMini(false);

    const data = {
      appointmentIdList: cancelappointmentList,
      description: reason,
    };
    const result = await appointmentApi
      .deleteAppointmentForStaff(data)
      .then((res) => {
        console.log("delete thành công", res);
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  //Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    setCancelAppointmentList([]);
  };

  const getToday = (separator = "") => {
    let newDate = new Date();
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();

    return `${year}${separator}-${
      month < 10 ? `0${month}` : `${month}`
    }-${separator}${date}`;
  };

  useEffect(() => {
    setBookingList(props.bookingList);
    // fetchAppoinmentList();
  }, [props]);

  const getAppointmentDatail = async (id) => {
    try {
      const result = await appointmentApi.getAppointmentDetailForStaff(id);
      console.log("booking detail", result);
      if (result) {
        setBookingServiceList(result.appointmentDetailList);
        setbookingDetail(result.appointment);
      }
    } catch {
      console.log("Can not load appointment detail");
    }
  };

  const addActive = (id) => {
    if (
      document.getElementById(`button${id}`).className.includes("active-check")
    ) {
      document.getElementById(`button${id}`).classList.remove("active-check");
      let tmp = [];
      cancelappointmentList.forEach((item) => {
        if (item !== id) {
          tmp = [...tmp, item];
        }
      });
      setCancelAppointmentList(tmp);
    } else {
      console.log("false");
      setCancelAppointmentList([...cancelappointmentList, id]);
      document.getElementById(`button${id}`).className += " active-check";
    }
  };

  const addActiveToAll = () => {
    var flag = false; // không có active-check
    currentBookings.forEach((element) => {
      if (
        !document
          .getElementById(`button${element.id}`)
          .className.includes("active-check")
      ) {
        flag = true;
      }
    });
    if (!flag) {
      currentBookings.forEach((element) => {
        setCancelAppointmentList([]);
        document
          .getElementById(`button${element.id}`)
          .classList.remove("active-check");
      });
    } else {
      let tmp = cancelappointmentList;
      currentBookings.forEach((element) => {
        tmp = [...tmp, element.id];

        console.log("false");
        document.getElementById(`button${element.id}`).className +=
          " active-check";
      });
      setCancelAppointmentList(tmp);
    }
  };

  return (
    <>
      {isEdit ? (
        <Appointment {...updateBooking} />
      ) : (
        <>
          <div>
            <Row>
              <Col md="12">
                <Card>
                  <CardHeader>
                    <CardTitle tag="h4">Up-comming appointment</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <Table responsive>
                      <thead className="text-primary">
                        <tr>
                          <th
                            style={{ fontWeight: `bold` }}
                            className="text-center"
                          >
                            #
                          </th>
                          <th style={{ fontWeight: `bold` }}>Name</th>
                          <th style={{ fontWeight: `bold` }}>Phone</th>
                          <th style={{ fontWeight: `bold` }}>Time</th>
                          <th
                            style={{ fontWeight: `bold` }}
                            className="text-center"
                          >
                            <button
                              onClick={() => {
                                addActiveToAll();
                              }}
                            >
                              Check all
                            </button>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="booking-info">
                        {currentBookings.map((booking, index) => {
                          return (
                            <tr key={booking.id}>
                              <td className="text-center">{index + 1}</td>

                              <td>{booking.account.fullName}</td>
                              <td>{booking.account.phone}</td>

                              <td>{booking.appointmentTime}</td>
                              <td className="text-center btns-mr-5">
                                <Button
                                  id={`button${booking.id}`}
                                  className="btn-icon-cancel-appointment"
                                  size="xs"
                                  type="button"
                                  value={booking.id}
                                  onClick={async (e) => {
                                    // e.preventDefault();
                                    addActive(booking.id);
                                    // await getAppointmentDatail(booking.id);
                                    // await setLgShow(true);
                                  }}
                                >
                                  <i
                                    id={`button${booking.id}`}
                                    className="now-ui-icons ui-1_check"
                                    style={{ fontSize: `20px` }}
                                  />
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                    <Row className="justify-content-center">
                      <Button
                        style={{ fontSize: `16px`, backgroundColor: `red` }}
                        onClick={() => {
                          if (
                            cancelappointmentList.length !== 0 ||
                            !cancelappointmentList
                          ) {
                            setLgShow(true);
                          }
                          console.log(cancelappointmentList);
                        }}
                      >
                        Cancel
                      </Button>
                    </Row>
                  </CardBody>
                </Card>
                <CustomPagination
                  itemsPerPage={bookingsPerPage}
                  totalItems={bookingList.length}
                  paginate={paginate}
                />
              </Col>
              <Modal
                size="lg"
                show={lgShow}
                onHide={() => setLgShow(false)}
                aria-labelledby="example-modal-sizes-title-lg"
                // scrollable={true}
              >
                <div color="info" className="text-center mt-4 ml-2">
                  <h2 className="text-info" style={{ paddingBottom: 0 }}>
                    Cancellation reason
                  </h2>
                </div>
                <div>
                  <Modal.Body>
                    <div>
                      <textarea
                        style={{
                          width: `100%`,
                          border: `2px solid black`,
                          minHeight: `150px`,
                          fontSize: `16px`,
                          padding: `0 5px`,
                          borderRadius: `4px`,
                        }}
                        placeholder="Enter the reason"
                        onChange={(e) => setReason(e.target.value)}
                      />
                    </div>
                  </Modal.Body>
                </div>
                <div className="text-center btns-mr-5">
                  <Row>
                    <Col>
                      <Button color="info" onClick={() => setLgShow(false)}>
                        Close
                      </Button>
                    </Col>
                    <Col>
                      <Button
                        color="success"
                        onClick={() => {
                          setLgShow(false);
                          setModalMini(true);
                        }}
                      >
                        OK
                      </Button>
                    </Col>
                  </Row>
                </div>
              </Modal>
            </Row>
            <DangerModal
              isOpen={modalMini}
              toggle={toggleModalMini}
              size="mini"
              modalClassName="modal-info"
            >
              <div className="modal-header justify-content-center">
                <div className="modal-profile">
                  <i className="now-ui-icons sport_user-run" />
                </div>
              </div>
              <ModalBody>
                <p>{"Are sure to cancel this Appointment ?"}</p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="link"
                  className="btn-neutral"
                  onClick={() => deleteAppointment()}
                >
                  Yes
                </Button>{" "}
                <Button
                  color="link"
                  className="btn-neutral"
                  onClick={toggleModalMini}
                >
                  No
                </Button>
              </ModalFooter>
            </DangerModal>
          </div>
        </>
      )}
    </>
  );
}

export default AppointmentTableCheckCancel;
