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
function AppointmentTable(props) {
  const [bookingList, setBookingList] = useState([]);
  const [bookingDetail, setbookingDetail] = useState(null);
  const [bookingServiceList, setBookingServiceList] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage] = useState(10);
  const [isEdit, setIsEdit] = useState(false);
  const [render, setRender] = useState(false);
  const [updateBooking, setUpdateBooking] = useState({});

  const [lgShow, setLgShow] = useState(false);

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
    if (sessionStorage.getItem("checkin")) {
      sessionStorage.removeItem("checkin");
    }
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

  const checkDoneAppointment = async (id) => {
    try {
      const result = await appointmentApi.checkMarkDone(id);
      if (result) {
        console.log("done appointment");

        sessionStorage.setItem("checkin", true);
        window.location.reload();
      }
    } catch {
      console.log("can't check done appointment");
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
                    <CardTitle tag="h4">
                      Up-comming appointment for today ({getToday()})
                    </CardTitle>
                  </CardHeader>
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
                      <div>
                        <Row>
                          <Col lg={3} sm={3} xs={3}>
                            <label>Name: </label>
                          </Col>
                          <Col>
                            <p>{bookingDetail.account.fullName}</p>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={3} sm={3} xs={3}>
                            <label>Phone: </label>
                          </Col>
                          <Col>
                            <p>{bookingDetail?.account?.phone}</p>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={3} sm={3} xs={3}>
                            <label>Gender: </label>
                          </Col>
                          <Col>
                            <p>
                              {bookingDetail?.account?.gender === 1
                                ? "Nam"
                                : "Nữ "}
                            </p>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={3} sm={3} xs={3}>
                            <label>Doctor: </label>
                          </Col>
                          <Col>
                            <p>{bookingDetail?.doctor?.name}</p>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={3} sm={3} xs={3}>
                            <label>Branch: </label>
                          </Col>
                          <Col>
                            <p>
                              {bookingDetail?.branch?.name},{" "}
                              {bookingDetail?.branch?.district?.name},{" "}
                              {bookingDetail?.branch?.district?.province?.name}
                            </p>
                          </Col>
                        </Row>
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
                      </div>
                    ) : (
                      <h3>No details</h3>
                    )}
                  </Modal.Body>
                </div>
                <div className="text-center btns-mr-5">
                  <Row>
                    <Col>
                      <Button color="info" onClick={() => setLgShow(false)}>
                        Close
                      </Button>
                    </Col>
                    {bookingDetail?.status === 0 ? (
                      <Col>
                        <Button
                          color="success"
                          onClick={() => {
                            setLgShow(false);
                            checkDoneAppointment(bookingDetail.id);
                          }}
                        >
                          Check-in
                        </Button>
                      </Col>
                    ) : null}
                  </Row>
                </div>
              </Modal>
            </Row>
          </div>
        </>
      )}
    </>
  );
}

export default AppointmentTable;
