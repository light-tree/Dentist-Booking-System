import { useEffect, useRef, useState } from "react";

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
  ModalHeader,
} from "reactstrap";
import { Modal, Image } from "react-bootstrap";
import NotificationAlert from "react-notification-alert";
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

function HistoryAppointmentTableStaff(props) {
  const [bookingList, setBookingList] = useState([]);
  const [bookingDetail, setbookingDetail] = useState(null);
  const [bookingServiceList, setBookingServiceList] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage] = useState(10);
  const [isEdit, setIsEdit] = useState(false);
  const [addNoteModal, setAddNoteModal] = useState(false);
  const [updateBooking, setUpdateBooking] = useState({});
  const notify = useRef();
  const [lgShow, setLgShow] = useState(false);
  const [modalDanger, setModalDanger] = useState(false);
  const [addNoteText, setAddNoteText] = useState("");

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = bookingList.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );

  //Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const fetchAppoinmentList = async () => {
    try {
      await appointmentApi.getAppointList().then((res) => {
        console.log(res.content);
        setBookingList(res.content);
      });
    } catch (error) {
      console.log("Failed to fetch API", error);
    }
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
        setAddNoteText(result.appointment.note);
      }
    } catch {
      console.log("Can not load appointment detail");
    }
  };

  const submitAddNote = async () => {
    const data = {
      id: bookingDetail.id,
      note: addNoteText,
    };
    console.log(data);
    try {
      const result = await appointmentApi.submitAddNoteForAppointment(data);
      if (result) {
        notifyMessage("Add note successfully");
        setModalDanger(false);
        setAddNoteModal(false);
        setAddNoteText("");
      }
    } catch (error) {
      notifyMessage("Add note error", "danger", "now-ui-icons travel_info");
      setAddNoteModal(true);
    }
  };

  const notifyMessage = (message, type, icon) => {
    var options1 = {
      place: "tr",
      message: (
        <div>
          <div>{message}</div>
        </div>
      ),
      type: type ? type : "success",
      icon: icon ? icon : "now-ui-icons ui-1_bell-53",
      autoDismiss: 5,
    };
    notify.current.notificationAlert(options1);
  };

  return (
    <>
      <NotificationAlert
        ref={notify}
        zIndex={9999}
        onClick={() => console.log("hey")}
      />
      <>
        <div>
          <Row>
            <Col md="12">
              <Card>
                {/* <CardHeader>
                  <CardTitle tag="h4">
                    Up-comming appointment for today ({getToday()})
                  </CardTitle>
                </CardHeader> */}
                <CardBody>
                  {bookingList.length !== 0 ? (
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
                          <th style={{ fontWeight: `bold` }}>Date</th>
                          <th style={{ fontWeight: `bold` }}>Time</th>
                          <th
                            style={{ fontWeight: `bold` }}
                            className="text-center"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentBookings.map((booking, index) => {
                          return (
                            <tr key={booking.id}>
                              <td className="text-center">{index + 1}</td>

                              <td>{booking.account.fullName}</td>
                              <td>{booking.account.phone}</td>
                              <td>{booking.appointmentDate}</td>

                              <td>{booking.appointmentTime}</td>
                              <td className="text-center btns-mr-5">
                                <Button
                                  className="btn-icon"
                                  color="info"
                                  size="lg"
                                  type="button"
                                  value={booking.id}
                                  onClick={async (e) => {
                                    // e.preventDefault();

                                    await getAppointmentDatail(booking.id);
                                    await setLgShow(true);
                                  }}
                                >
                                  Detail
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  ) : (
                    <h3 className="ml-5">Don't have appointment</h3>
                  )}
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
                  Appointment detail
                </h2>
              </div>
              <div>
                <Modal.Body>
                  {bookingDetail != null ? (
                    <div className="text-left">
                      <Row>
                        <Col className="ml-3" lg={5} sm={5} xs={3}>
                          <Row>
                            <label>Name: </label>
                            <p className="ml-3">
                              {bookingDetail.account.fullName}
                            </p>
                          </Row>
                        </Col>
                        <Col lg={5} sm={5} xs={3}>
                          <Row>
                            <label>Phone: </label>
                            <p className="ml-3">
                              {bookingDetail?.account?.phone}
                            </p>
                          </Row>
                        </Col>
                      </Row>
                      {/* <Row>
                          <Col lg={5} sm={5} xs={3}>
                            <label>Gender: </label>
                          </Col>
                          <Col>
                            <p>
                              {bookingDetail?.account?.gender === 1
                                ? "Nam"
                                : "Nữ "}
                            </p>
                          </Col>
                        </Row> */}
                      {/* <Row>
                        <Col lg="auto">
                          <label>Doctor: </label>
                        </Col>
                        <Col lg="auto">
                          <p>{bookingDetail?.doctor?.name}</p>
                        </Col> */}
                      <Col>
                        <Row>
                          <label>Doctor: </label>
                          <p className="ml-3">{bookingDetail?.doctor?.name}</p>
                        </Row>
                      </Col>
                      <Col>
                        <Row>
                          <label>Branch: </label>
                          <p className="ml-3">
                            {bookingDetail?.branch?.name},{" "}
                            {bookingDetail?.branch?.district?.name},{" "}
                            {bookingDetail?.branch?.district?.province?.name}
                          </p>
                        </Row>
                      </Col>
                      {/* </Row> */}
                      {/* <Row>
                        <Col lg={3} sm={5} xs={3}>
                          <Row>
                            <label>Branch: </label>
                            <p>
                              {bookingDetail?.branch?.name},{" "}
                              {bookingDetail?.branch?.district?.name},{" "}
                              {bookingDetail?.branch?.district?.province?.name}
                            </p>
                          </Row>
                        </Col>
                      </Row> */}
                      <Row>
                        <Table striped bordered hover className="">
                          <thead>
                            <tr>
                              <th>Service Name</th>
                              <th>Price</th>
                              <th>Discount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {bookingServiceList.map((service, key) => {
                              return (
                                <tr key={service.id.serviceId}>
                                  <td>{service.service.name}</td>
                                  <td>
                                    {Intl.NumberFormat("vi-VN", {
                                      style: "currency",
                                      currency: "VND",
                                    }).format(service.service.minPrice)}{" "}
                                    ~{" "}
                                    {Intl.NumberFormat("vi-VN", {
                                      style: "currency",
                                      currency: "VND",
                                    }).format(service.service.maxPrice)}
                                    {/* {service.service.minPrice} ~{" "}
                                      {service.service.maxPrice} */}
                                  </td>
                                  <td>
                                    {service?.discount?.percentage
                                      ? `${service.discount.percentage}%`
                                      : "No discount"}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table>
                      </Row>
                      {addNoteText ? (
                        <Row>
                          <Col lg={3} sm={5} xs={3}>
                            <label>Note: </label>
                          </Col>
                          <Col>
                            <p style={{ whiteSpace: `pre-line` }}>
                              {addNoteText}
                            </p>
                          </Col>
                        </Row>
                      ) : null}
                    </div>
                  ) : (
                    <h3>No details</h3>
                  )}
                </Modal.Body>
              </div>
              <div className="text-center btns-mr-5">
                <Row>
                  <Col>
                    <Button
                      color="success"
                      onClick={() => {
                        setLgShow(false);
                        setAddNoteModal(true);
                      }}
                    >
                      Add note
                    </Button>
                  </Col>
                  <Col>
                    <Button color="info" onClick={() => setLgShow(false)}>
                      Close
                    </Button>
                  </Col>
                </Row>
              </div>
            </Modal>
            <Modal show={addNoteModal}>
              <ModalHeader style={{ fontWeight: `bold` }} tag={"h5"}>
                Add note
              </ModalHeader>
              <ModalBody>
                <Row lg={12}>
                  <textarea
                    placeholder="Add note..."
                    value={addNoteText}
                    style={{
                      width: `100%`,
                      padding: `5px`,
                      height: `200px`,
                      borderRadius: `6px`,
                    }}
                    onChange={(e) => setAddNoteText(e.target.value)}
                  />
                </Row>
              </ModalBody>
              {/* <ModalFooter> */}
              <Row className="text-center btns-mr-5">
                <Col>
                  <Button
                    color="success"
                    onClick={() => {
                      submitAddNote();
                    }}
                  >
                    Save
                  </Button>
                </Col>
                <Col>
                  <Button
                    color="info"
                    onClick={() => {
                      setModalDanger(true);
                    }}
                  >
                    Close
                  </Button>
                </Col>
              </Row>
              {/* </ModalFooter> */}
            </Modal>
          </Row>
          <DangerModal
            isOpen={modalDanger}
            size="mini"
            modalClassName="modal-info"
          >
            <div className="modal-header justify-content-center">
              <div className="modal-profile">
                <i className="now-ui-icons business_badge" />
              </div>
            </div>
            <ModalBody>
              <p>{"Are sure to close?"}</p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="link"
                className="btn-neutral"
                onClick={() => {
                  setModalDanger(false);
                  setAddNoteModal(false);
                  setAddNoteText("");
                }}
              >
                Yes
              </Button>{" "}
              <Button
                color="link"
                className="btn-neutral"
                onClick={() => setModalDanger(false)}
              >
                No
              </Button>
            </ModalFooter>
          </DangerModal>
        </div>
      </>
    </>
  );
}

export default HistoryAppointmentTableStaff;
