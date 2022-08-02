import {
  Table,
  UncontrolledTooltip,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  Button,
  // Modal,
  ModalBody,
  ModalFooter,
  Input,
} from "reactstrap";

import NotificationAlert from "react-notification-alert";
import PanelHeader from "components/PanelHeader/PanelHeader.js";
import { useEffect, useRef, useState } from "react";
import doctorApi from "api/doctorApi";
import CustomPagination from "views/Widgets/Pagination";
import { Modal, Image } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import Select from "react-select";
import branchApi from "api/branchApi";
function DoctorTable() {
  const history = useHistory();
  const [doctorList, setDoctorList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [doctorsPerPage] = useState(5);
  const [branchList, setBranchList] = useState([]);
  const [branchSearch, setBranchSearch] = useState({
    label: "Select all branch",
    value: "0",
  });
  const [doctorSearch, setDoctorSearch] = useState("");
  const [modalMini, setModalMini] = useState(false);
  const [statusSearch, setStatusSearch] = useState(0);
  const [idDelete, setIdDelete] = useState(-1);
  const [doctorDetail, setDoctorDetail] = useState(null);
  const [lgShow, setLgShow] = useState(false);
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = doctorList.slice(
    indexOfFirstDoctor,
    indexOfLastDoctor
  );
  const notify = useRef();

  //Pop up alert delete
  const toggleModalMini = () => {
    setModalMini(false);
  };

  //Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const deleteDoctor = async () => {
    if (idDelete !== -1) {
      try {
        await doctorApi.deleteDoctor(idDelete).then((res) => {
          console.log("Dlt: ", res);
          window.location.reload(false);
          setModalMini(false);
        });
      } catch (error) {
        console.log("xóa hk đc", error);
      }
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
    console.log("option", options1);
    notify.current.notificationAlert(options1);
  };

  const getAllBranch = async () => {
    const reslut = await branchApi.getAll().then((res) => {
      console.log(res);
      let x = res.map((item) => {
        return {
          value: item.id,
          label: item.name,
        };
      });
      setBranchList([
        {
          label: "Select all branch",
          value: "0",
        },
        ...x,
      ]);
    });
  };

  const fetchDoctorList = async () => {
    try {
      await doctorApi.getDoctorList().then((result) => {
        setDoctorList(result);
        setLoading(false);
        console.log(result);
      });
    } catch (error) {
      setLoading(true);
      console.log("Fetch doctor list failed", error);
    }
  };
  useEffect(() => {
    fetchDoctorList();
    getAllBranch();
    document.getElementById(`button${statusSearch}`).classList +=
      " active-button-status";
    if (sessionStorage.getItem("addNewDoctor")) {
      notifyMessage("Add new doctor successfully");
      sessionStorage.removeItem("addNewDoctor");
    }
    if (sessionStorage.getItem("updateDoctor")) {
      notifyMessage("Update doctor successfully");
      sessionStorage.removeItem("updateDoctor");
    }
  }, []);

  const buttonStatusClick = (id) => {
    for (let index = 0; index < 3; index++) {
      document
        .getElementById(`button${index}`)
        .classList.remove("active-button-status");
    }
    document.getElementById(`button${id}`).classList += " active-button-status";
    setStatusSearch(id);
  };

  const filterDoctor = () => {
    var data;
    data = {
      branchId: branchSearch.value,
      name: doctorSearch,
      status: statusSearch,
    };
    const result = doctorApi.filterDoctor(data).then((res) => {
      setDoctorList(res);
    });
  };

  useEffect(() => {
    filterDoctor();
  }, [doctorSearch, branchSearch, statusSearch]);

  return (
    <>
      <NotificationAlert
        ref={notify}
        zIndex={9999}
        onClick={() => console.log("hey")}
      />
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Doctor</CardTitle>
                <Row md={7} className="justify-content-center mb-3">
                  <Col md={2}>
                    <label>Branch </label>
                  </Col>
                  <Col md={5}>
                    <Select
                      className="react-select text-center"
                      classNamePrefix="react-select"
                      placeholder="Choose branch"
                      options={branchList}
                      value={branchSearch}
                      onChange={(value) => {
                        setBranchSearch(value);
                      }}
                    />
                  </Col>
                </Row>
                <Row md={7} className="justify-content-center mb-3">
                  <Col md={2}>
                    <label>Name</label>
                  </Col>
                  <Col md={5}>
                    <Input
                      className="react-select p-2"
                      classNamePrefix="react-select"
                      placeholder="Enter name doctor"
                      value={doctorSearch}
                      onChange={(e) => {
                        setDoctorSearch(e.target.value);
                      }}
                    />
                  </Col>
                </Row>
                <Row md={7} className="justify-content-center mb-3">
                  <Col md={2}>
                    <label>Status</label>
                  </Col>
                  <Col md={5}>
                    <button
                      id="button0"
                      className="mr-3"
                      style={{ width: `90px` }}
                      onClick={() => {
                        buttonStatusClick(0);
                      }}
                    >
                      All
                    </button>
                    <button
                      id="button1"
                      className="mr-3"
                      style={{ width: `90px` }}
                      onClick={() => {
                        buttonStatusClick(1);
                      }}
                    >
                      Active
                    </button>
                    <button
                      id="button2"
                      style={{ width: `90px` }}
                      onClick={() => {
                        buttonStatusClick(2);
                      }}
                    >
                      Inactive
                    </button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                {loading ? (
                  <h2>Loading...</h2>
                ) : (
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
                        <th style={{ fontWeight: `bold` }}>Branch</th>
                        <th style={{ fontWeight: `bold` }}>Status</th>
                        <th
                          style={{ fontWeight: `bold` }}
                          className="text-center"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentDoctors.map((doctor, index) => {
                        return (
                          <tr key={doctor.key}>
                            <td className="text-center">{index + 1}</td>
                            <td>{doctor.name}</td>
                            <td>{doctor.branch.name}</td>
                            <td>
                              {doctor.status === 1 ? (
                                <div style={{ color: "green" }}>
                                  <i className="fas fa-check-circle"> </i>{" "}
                                  Active
                                </div>
                              ) : (
                                <div style={{ color: "grey" }}>
                                  <i className="fas fa-check-circle"> </i>{" "}
                                  Inactive
                                </div>
                              )}
                            </td>
                            <td className="text-center btns-mr-5">
                              <Button
                                className="btn-icon"
                                color="info"
                                id="tooltip590841497"
                                size="sm"
                                type="button"
                                onClick={() => {
                                  setLgShow(true);
                                  setDoctorDetail(doctor);
                                  console.log(doctor);
                                }}
                              >
                                <i className="now-ui-icons users_single-02" />
                              </Button>
                              <UncontrolledTooltip
                                delay={0}
                                target="tooltip590841497"
                              >
                                Detail
                              </UncontrolledTooltip>
                              <Button
                                className="btn-icon"
                                color="success"
                                id={`edit${doctor.id}`}
                                size="sm"
                                type="button"
                                onClick={() => {
                                  history.push(
                                    "/admin/doctor/edit/" + doctor.id
                                  );
                                }}
                              >
                                <i className="now-ui-icons ui-2_settings-90" />
                              </Button>
                              <UncontrolledTooltip
                                delay={0}
                                target={`edit${doctor.id}`}
                              >
                                Update
                              </UncontrolledTooltip>
                              <Button
                                className="btn-icon"
                                color="danger"
                                size="sm"
                                type="button"
                                id={`delete${doctor.id}`}
                                disabled={doctor.status === 2}
                                onClick={() => {
                                  setModalMini(true);
                                  setIdDelete(doctor.id);
                                }}
                              >
                                <i className="now-ui-icons ui-1_simple-remove" />
                              </Button>
                              <UncontrolledTooltip
                                delay={0}
                                target={`delete${doctor.id}`}
                              >
                                Disable
                              </UncontrolledTooltip>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
        <CustomPagination
          itemsPerPage={doctorsPerPage}
          totalItems={doctorList.length}
          paginate={paginate}
        />
        <Modal
          size="lg"
          show={lgShow}
          onHide={() => setLgShow(false)}
          aria-labelledby="example-modal-sizes-title-lg"
          // scrollable={true}
        >
          <div color="info" className="text-center mt-4">
            <h2 className="text-info text-center" style={{ paddingBottom: 0 }}>
              Branch Detail
            </h2>
          </div>
          <div>
            <Modal.Body>
              {doctorDetail != null ? (
                <Col className="m-3">
                  <Row className="justify-content-center m-0">
                    <Col xs={20} sm={2} md={5}>
                      <Image
                        src={
                          "https://drive.google.com/uc?id=" + doctorDetail.url
                        }
                        // rounded
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col lg={3} mg={3} xs={3}>
                      <label>
                        <b>Name: </b>
                      </label>
                    </Col>
                    <Col className="mt-0">
                      <span>{doctorDetail.name}</span>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={3} mg={3} xs={3}>
                      <label>
                        <b>Branch: </b>
                      </label>
                    </Col>
                    <Col className="mt-0">
                      <span>
                        {doctorDetail.branch.name} -{" "}
                        {doctorDetail.branch.district.name},{" "}
                        {doctorDetail.branch.district.province.name}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={3} mg={3} xs={3}>
                      <label>
                        <b>Description: </b>
                      </label>
                    </Col>
                    <Col className="mt-0">
                      <span>{doctorDetail.description}</span>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={3} mg={3} xs={3}>
                      <label>
                        <b>Status: </b>
                      </label>
                    </Col>
                    <Col className="mt-0">
                      <span>
                        {doctorDetail.status !== 0 ? (
                          <div style={{ color: "green" }}>
                            <i className="fas fa-check-circle"> </i> Active
                          </div>
                        ) : (
                          <div style={{ color: "grey" }}>
                            <i className="fas fa-check-circle"> </i> Inactive
                          </div>
                        )}
                      </span>
                    </Col>
                  </Row>
                </Col>
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
              <Col>
                <Button color="primary" onClick={() => setLgShow(false)}>
                  Edit
                </Button>
              </Col>
            </Row>
          </div>
        </Modal>
        <Modal
          show={modalMini}
          onHide={toggleModalMini}
          size="mini"
          modalClassName="modal-info"
        >
          <div className="modal-header justify-content-center">
            <div className="modal-profile">
              <i className="now-ui-icons business_badge" />
            </div>
          </div>
          <ModalBody>
            <p>{"Are sure to disable \n this doctor ?"}</p>
          </ModalBody>
          <ModalFooter>
            <Button color="red" className="btn-neutral" onClick={deleteDoctor}>
              Yes
            </Button>
            <Button
              color="info"
              className="btn-neutral"
              onClick={toggleModalMini}
            >
              No
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </>
  );
}

export default DoctorTable;
