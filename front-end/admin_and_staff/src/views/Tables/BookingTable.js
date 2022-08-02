import { useEffect, useState } from "react";

// reactstrap components
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Row,
  Col,
  Button,
  Table,
  Input,
  UncontrolledAlert,
  UncontrolledTooltip,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
} from "reactstrap";

import Select from "react-select";

// core components
import PanelHeader from "components/PanelHeader/PanelHeader.js";
import appointmentApi from "api/AppointmentApi";
import CustomPagination from "views/Widgets/Pagination";
import Appointment from "views/Pages/dbs-page/edit-form/Appointment";
import branchApi from "api/branchApi";
import doctorApi from "api/doctorApi";
import ReportAppointment from "components/report/ReportAppointment";

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
      <i className="fa fa- circle-icon"></i>&nbsp; In-process
    </button>
  </div>
);

const listStatus = [
  { value: [0, 1, 2, 3, 4, 5, 6], label: "Select all status" },
  { value: [0], label: "Wating" },
  { value: [1, 5], label: "Done" },
  { value: [2], label: "Absent" },
  { value: [3], label: "Cancel by customer" },
  { value: [6], label: "Cancel by center" },
];
const listStatusUpdate = [
  { value: [0], label: "Wating" },
  { value: [1, 5], label: "Done" },
  { value: [2], label: "Absent" },
  { value: [3], label: "Cancel by customer" },
  { value: [6], label: "Cancel by center" },
];

function BookingTable() {
  const [bookingList, setBookingList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage] = useState(10);
  const [isEdit, setIsEdit] = useState(false);
  const [updateBooking, setUpdateBooking] = useState({});
  const [bookingSerivceDetailList, setBookingServiceList] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState(null);

  const [searchValue, setSearchValue] = useState("");
  const [branchSearch, SetBranchSearch] = useState({
    value: 0,
    label: "Select all branch",
  });
  const [dateSearch, setDateSearch] = useState();
  const [doctorSearch, setDoctorSearch] = useState({
    value: 0,
    label: "Select all doctor",
  });
  const [branchList, setBranchList] = useState([]);
  const [doctorList, setDoctorList] = useState([
    {
      value: 0,
      label: "Select all doctor",
    },
  ]);
  const [statusSearch, setStatusSearch] = useState({
    value: [0],
    label: "Waiting",
  });

  const [modalDetail, setModalDetail] = useState(false);

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = bookingList.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );

  //Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const fetchAppoinmentList = async () => {
    var data;
    data = {
      status: statusSearch.value,
      date: getToday(),
      phone: searchValue,
      branchId: branchSearch.value,
      doctorId: doctorSearch.value,
      serviceId: 0,
    };
    console.log("data appoitment", data);
    const result = await appointmentApi
      .getAppointListForAdmin(data)
      .then((res) => {
        console.log("appointment", res.data);
        setBookingList(res.data);
        setCurrentPage(1);
      });
  };

  useEffect(() => {
    fetchAppoinmentList();
    getAllBranch();
    setDateSearch(getToday());
  }, []);

  const getAllBranch = async () => {
    const result = await branchApi.getAll().then((res) => {
      let x = res.map((item) => {
        return {
          value: item.id,
          label: item.name,
        };
      });
      setBranchList([
        {
          value: "0",
          label: "Select all branch",
        },
        ...x,
      ]);
    });
  };

  useEffect(() => {
    getDoctorByBranchId();
  }, [branchSearch]);

  const getDoctorByBranchId = async () => {
    if (branchSearch.value === 0) {
      setDoctorList([
        {
          value: 0,
          label: "Select all doctor",
        },
      ]);
      return;
    }
    var data;
    data = {
      branchId: branchSearch.value,
      name: null,
      status: 0,
    };
    const result = doctorApi.filterDoctor(data).then((res) => {
      let x;
      if (res.length !== 0) {
        x = res.map((item) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
      }
      setDoctorList([
        {
          value: 0,
          label: "Select all doctor",
        },
        ...x,
      ]);
    });
  };

  const getToday = (separator = "") => {
    let newDate = new Date();
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();

    return `${year}${separator}-${month < 10 ? `0${month}` : `${month}`}-${
      date < 10 ? `0${date}` : `${date}`
    }`;
  };

  const formatDate = (dateValue) => {
    const separator = "";
    console.log(dateValue);
    let date = dateValue.valueAsDate.getDate();
    let month = dateValue.valueAsDate.getMonth() + 1;
    let year = dateValue.valueAsDate.getFullYear();

    return `${year}${separator}-${month < 10 ? `0${month}` : `${month}`}-${
      date < 10 ? `0${date}` : `${date}`
    }`;
  };

  useEffect(() => {
    filterBookingList();
  }, [searchValue, branchSearch, doctorSearch, statusSearch, dateSearch]);

  const filterBookingList = async () => {
    var data;
    data = {
      status: statusSearch.value,
      date: dateSearch,
      phone: searchValue,
      branchId: branchSearch.value,
      doctorId: doctorSearch.value,
      serviceId: 0,
    };
    console.log("data appoitment", data);
    const result = await appointmentApi
      .getAppointListForAdmin(data)
      .then((res) => {
        console.log("appointment", res.data);
        setBookingList(res.data);
        setCurrentPage(1);
      });
  };

  const getAppointmentDetail = async (id) => {
    try {
      const result = await appointmentApi.getAppointmentDetailForAdmin(id);
      console.log("booking detail", result);
      if (result) {
        setBookingServiceList(result.appointmentDetailList);
        setStatusUpdate({
          value: updateBooking.status,
          label: listStatusUpdate.map((item) => {
            if (item.value.includes(updateBooking.status)) {
              return item.label;
            }
          }),
        });
        console.log("status", statusUpdate);
      }
    } catch {
      console.log("Can not load appointment detail");
    }
  };

  useEffect(() => {
    getAppointmentDetail(updateBooking?.id);
  }, [updateBooking]);

  return (
    <>
      <PanelHeader size="lg" content={<ReportAppointment />} />
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Appoinment</CardTitle>
                {/* <ReportAppointment /> */}
                <div>
                  <Row className="justify-content-center mb-3">
                    <Col md={3} className="text-center">
                      <label
                        style={{
                          fontSize: `14px`,
                          fontWeight: `bold`,
                        }}
                      >
                        Search phone
                      </label>
                    </Col>
                    <Col md={5}>
                      <Input
                        style={{ fontSize: `15px` }}
                        class="form-control p-2"
                        id="inputdefault"
                        type="text"
                        value={searchValue}
                        placeholder="Enter the number phone"
                        onChange={(e) => {
                          setSearchValue(e.target.value.trim());
                        }}
                      />
                    </Col>
                  </Row>
                  <Row className="justify-content-center mb-3">
                    <Col md={3} className="text-center">
                      <label
                        style={{
                          fontSize: `14px`,
                          fontWeight: `bold`,
                        }}
                      >
                        Search date
                      </label>
                    </Col>
                    <Col md={5}>
                      <Input
                        style={{ fontSize: `15px` }}
                        class="form-control p-2"
                        id="inputdefault"
                        type="date"
                        value={dateSearch}
                        pattern="yyyy-mm-dd"
                        placeholder="Enter the date"
                        onChange={(e) => {
                          setDateSearch(e.target.value);
                        }}
                      />
                    </Col>
                  </Row>
                  <Row className="justify-content-center mb-3">
                    <Col md={3} className="text-center">
                      {" "}
                      <label style={{ fontSize: `14px`, fontWeight: `bold` }}>
                        Branch
                      </label>
                    </Col>
                    <Col md={5}>
                      <Select
                        className="react-select"
                        classNamePrefix="react-select"
                        placeholder="Select branch "
                        value={branchSearch}
                        options={branchList}
                        onChange={(e) => {
                          SetBranchSearch(e);
                        }}
                        defaultValue="0"
                      />
                    </Col>
                  </Row>

                  <Row className="justify-content-center mb-3">
                    <Col md={3} className="text-center">
                      <label style={{ fontSize: `14px`, fontWeight: `bold` }}>
                        Doctor in branch
                      </label>
                    </Col>
                    <Col md={5}>
                      <Select
                        className="react-select"
                        classNamePrefix="react-select"
                        value={doctorSearch}
                        placeholder="Enter the number phone"
                        onChange={(e) => {
                          setDoctorSearch(e);
                        }}
                        options={doctorList}
                      />
                    </Col>
                  </Row>
                  <Row className="justify-content-center">
                    <Col md={3} className="text-center">
                      {" "}
                      <label
                        for="inputdefault"
                        style={{ fontSize: `14px`, fontWeight: `bold` }}
                      >
                        Status
                      </label>
                    </Col>
                    <Col md={5}>
                      <Select
                        className="react-select"
                        classNamePrefix="react-select"
                        value={statusSearch}
                        placeholder="Select status"
                        options={listStatus}
                        onChange={(value) => {
                          setStatusSearch(value);
                        }}
                      />
                    </Col>
                  </Row>
                </div>
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      <th className="text-center">#</th>
                      <th style={{ fontWeight: `bold` }}>Patient</th>
                      <th style={{ fontWeight: `bold` }}>Date</th>
                      <th style={{ fontWeight: `bold` }}>Shift</th>
                      <th style={{ fontWeight: `bold` }}>Doctor</th>
                      <th style={{ fontWeight: `bold` }}>Status</th>
                      <th style={{ fontWeight: `bold`, textAlign: `center` }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentBookings.map((booking, index) => {
                      return (
                        <tr>
                          <td className="text-center">{index + 1}</td>
                          <td>{booking.account.fullName}</td>
                          <td>{booking.appointmentDate}</td>
                          <td>{booking.appointmentTime}</td>
                          <td>{booking.doctor.name}</td>
                          <td>
                            {booking.status === 0 || booking.status === 4 ? (
                              <div style={{ color: "green" }}>
                                <i className="fas fa-check-circle"> </i> Watting
                              </div>
                            ) : null}
                            {booking.status === 1 || booking.status === 5 ? (
                              <div style={{ color: "green" }}>
                                <i className="fas fa-check-circle"> </i> Done
                              </div>
                            ) : null}
                            {booking.status === 2 ? (
                              <div style={{ color: "green" }}>
                                <i className="fas fa-check-circle"> </i> Absent
                              </div>
                            ) : null}
                            {booking.status === 3 ? (
                              <div style={{ color: "gray" }}>
                                <i className="fas fa-check-circle"> </i> Cancel
                                by customer
                              </div>
                            ) : null}
                            {booking.status === 6 ? (
                              <div style={{ color: "gray" }}>
                                <i className="fas fa-check-circle"> </i> Cancel
                                by center
                              </div>
                            ) : null}
                          </td>
                          <td className="text-center btns-mr-5">
                            <Button
                              className="btn-icon"
                              color="info"
                              size="sm"
                              type="button"
                              id={`detail${booking.id}`}
                              onClick={() => {
                                setModalDetail(true);
                                setUpdateBooking(booking);
                              }}
                            >
                              <i className="now-ui-icons users_single-02" />
                            </Button>
                            <UncontrolledTooltip
                              delay={0}
                              target={`detail${booking.id}`}
                            >
                              Detail
                            </UncontrolledTooltip>
                            {/* <Button
                              className="btn-icon"
                              color="success"
                              size="sm"
                              type="button"
                              onClick={() => {
                                setIsEdit(true);
                                setUpdateBooking(booking);
                                setModalDetail(true);
                              }}
                              id={`Update${booking.id}`}
                            >
                              <i className="now-ui-icons ui-2_settings-90" />
                            </Button>
                            <UncontrolledTooltip
                              delay={0}
                              target={`Update${booking.id}`}
                            >
                              Update
                            </UncontrolledTooltip> */}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
            <CustomPagination
              itemsPerPage={bookingsPerPage}
              totalItems={bookingList.length}
              paginate={paginate}
            />
          </Col>
          <Modal
            isOpen={modalDetail}
            toggle={() => setModalDetail(false)}
            size="md"
          >
            <ModalHeader>Appointment detail</ModalHeader>
            <ModalBody>
              <Row>
                <Col md={3}>
                  <label>Name:</label>
                </Col>
                <Col md={9}>{updateBooking?.account?.fullName}</Col>
              </Row>
              <Row>
                <Col md={3}>
                  <label>Date & Time:</label>
                </Col>
                <Col md={9}>
                  {updateBooking?.appointmentDate} -{" "}
                  {updateBooking?.appointmentTime}
                </Col>
              </Row>
              <Row>
                <Col md={3}>
                  <label>Doctor:</label>
                </Col>
                <Col md={9}>{updateBooking?.doctor?.name}</Col>
              </Row>
              <Row>
                <Col md={3}>
                  <label>Status:</label>
                </Col>
                {isEdit ? (
                  <Col md={9}>
                    <Select
                      options={listStatusUpdate}
                      value={statusUpdate}
                      placeholder="Select status..."
                      className="react-select"
                      classNamePrefix="react-select"
                      onChange={(e) => {
                        setStatusUpdate(e);
                      }}
                    ></Select>
                  </Col>
                ) : (
                  <Col md={9}>
                    {listStatus.map((item) => {
                      if (item.value == updateBooking?.status) {
                        return item.label;
                      }
                    })}
                  </Col>
                )}
              </Row>
              <Row>
                <Col md={3}>
                  <label>Service:</label>
                </Col>
                <Col md={12}>
                  <Table>
                    <thead>
                      <th style={{ color: `blue` }}>Service name</th>
                      <th style={{ color: `blue` }}>Price</th>
                      <th style={{ color: `blue` }}>Discount</th>
                    </thead>
                    <tbody>
                      {bookingSerivceDetailList &&
                      bookingSerivceDetailList?.length !== 0
                        ? bookingSerivceDetailList.map((item) => {
                            return (
                              <tr className="text-center">
                                <td>{item?.service?.name}</td>
                                <td>
                                  {Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(item?.service?.minPrice)}{" "}
                                  ~{" "}
                                  {Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(item?.service?.maxPrice)}
                                  {/* {item?.service?.minPrice} ~{" "}
                                  {item?.service?.maxPrice} */}
                                </td>
                                <td>
                                  {item?.discount?.percentage
                                    ? `${item.discount.percentage}%`
                                    : "No discount"}
                                </td>
                              </tr>
                            );
                          })
                        : null}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter className="justify-content-center text-center">
              {isEdit ? (
                <Col>
                  <Button
                    color="success"
                    className="btn-neutral"
                    onClick={() => {
                      setModalDetail(false);
                      setIsEdit(false);
                    }}
                    style={{ fontSize: `16px` }}
                  >
                    Save
                  </Button>
                </Col>
              ) : null}
              <Col>
                <Button
                  color="info"
                  className="btn-neutral"
                  onClick={() => {
                    setModalDetail(false);
                    setIsEdit(false);
                  }}
                  style={{ fontSize: `16px` }}
                >
                  Close
                </Button>
              </Col>
            </ModalFooter>
          </Modal>
        </Row>
      </div>
    </>
  );
}

export default BookingTable;
