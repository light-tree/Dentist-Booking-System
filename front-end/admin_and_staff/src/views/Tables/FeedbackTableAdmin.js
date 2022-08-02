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
  Modal as DangerModal,
  ModalBody,
  ModalFooter,
} from "reactstrap";

import NotificationAlert from "react-notification-alert";
import { useEffect, useRef, useState } from "react";
import serviceApi from "api/serviceApi";
import FeedbackApi from "api/FeedbackApi";
import { Modal } from "react-bootstrap";
import CustomPagination from "views/Widgets/Pagination";

function FeedbackTableAdmin() {
  const [serviceList, setServiceList] = useState(null);
  const [feedbackList, setFeedbackList] = useState([]);
  const [feedbackDetail, setFeedbackDetail] = useState(null);
  const [approve, setApprove] = useState(true);
  const [phoneSearch, setPhoneSearch] = useState("");
  const [serviceSearch, setServiceSearch] = useState(0);
  const [dateSearch, setDateSearch] = useState(null);
  const [status, setStatus] = useState(0);
  const [lgShow, setLgShow] = useState(false);
  const [render, setRender] = useState(false);

  const [modalMini, setModalMini] = useState(false);

  const [itemPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLast = currentPage * itemPerPage;
  const indexOfFirst = indexOfLast - itemPerPage;
  const currentList = feedbackList.slice(indexOfFirst, indexOfLast);
  const notify = useRef();

  //Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleModalMini = () => {
    setModalMini(!modalMini);
  };
  const getAllService = async () => {
    try {
      const result = await serviceApi.getServiceList();
      if (result) {
        console.log("result", result);
        setServiceList(result);
      }
    } catch (error) {}
  };

  const searchFeedback = async () => {
    var data;
    if (status === 0) {
      // waiting
      data = {
        phone: phoneSearch,
        status: status,
        serviceId: serviceSearch,
        time: null,
      };
    } else {
      data = {
        phone: phoneSearch,
        status: status,
        serviceId: serviceSearch,
        time: dateSearch,
      };
    }

    try {
      const result = await FeedbackApi.getFeedbackForAdmin(data);
      if (result) {
        setFeedbackList(result);
      }
    } catch (error) {}
  };

  useEffect(() => {
    getAllService();
    searchFeedback();
    document.getElementById(`button${status}`).className +=
      " active-button-status";
  }, []);

  useEffect(() => {
    searchFeedback();
  }, [serviceSearch, phoneSearch, dateSearch, status, render]);
  const clickToActive = (index) => {
    for (let i = 0; i < 3; i++) {
      document
        .getElementById(`button${i}`)
        .classList.remove("active-button-status");
    }
    document.getElementById(`button${index}`).className +=
      " active-button-status";
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

  const approveFeedback = async () => {
    try {
      const result = await FeedbackApi.approveFeedbackForAdmin(
        feedbackDetail.id
      );
      if (result) {
        console.log("feedback successfully");
        notifyMessage("Approve feedback successfully");
        searchFeedback();
      } else {
        console.log("feedback failed");
      }
    } catch (error) {}
  };

  const disapproveFeedback = async () => {
    try {
      const result = await FeedbackApi.disapproveFeedbackForAdmin(
        feedbackDetail.id
      );
      if (result) {
        console.log("disapproveFeedback feedback successfully");
        notifyMessage("Disapprove feedback successfully");
        searchFeedback();
      } else {
        console.log(" disapproveFeedback feedback failed");
      }
    } catch (error) {}
  };
  return (
    <>
      <NotificationAlert
        ref={notify}
        zIndex={9999}
        onClick={() => console.log("hey")}
      />

      <div className="content">
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Feedback</CardTitle>
                <div
                  className="d-flex flex-column justify-content-center text-center"
                  style={{ fontSize: `16px` }}
                >
                  <Row className="justify-content-center text-center m-2">
                    <Col lg={3} md={4} xs={4}>
                      <label style={{ fontSize: `18px` }}>Phone</label>
                    </Col>
                    <Col lg={5} md={7} xs={7}>
                      <input
                        type="number"
                        placeholder="Phone"
                        className="p-1"
                        style={{
                          width: `100%`,
                          borderRadius: `6px`,
                          textAlign: `center`,
                        }}
                        onChange={(e) => {
                          setPhoneSearch(e.target.value);
                        }}
                      ></input>
                    </Col>
                  </Row>
                  {status !== 0 ? (
                    <Row className="justify-content-center text-center m-2">
                      <Col lg={3} md={4} xs={4}>
                        <label style={{ fontSize: `18px` }}>Day feedback</label>
                      </Col>
                      <Col lg={5} md={7} xs={7}>
                        <input
                          className="p-1"
                          type="date"
                          placeholder="Day feedback"
                          style={{
                            width: `100%`,
                            borderRadius: `6px`,
                            textAlign: `center`,
                          }}
                          disabled={status === 0}
                          onChange={(e) => {
                            let separator = "";
                            let date = e.target.valueAsDate.getDate();
                            let month = e.target.valueAsDate.getMonth() + 1;
                            let year = e.target.valueAsDate.getFullYear();
                            let tmp = `${year}${separator}-${
                              month < 10 ? `0${month}` : `${month}`
                            }-${separator}${date}`;
                            setDateSearch(tmp);
                          }}
                        ></input>
                      </Col>
                    </Row>
                  ) : (
                    ""
                  )}
                  <Row className="justify-content-center text-center m-2">
                    <Col lg={3} md={4} xs={4} className="m-2">
                      <label style={{ fontSize: `18px` }}>Status</label>
                    </Col>
                    <Col
                      lg={5}
                      md={7}
                      xs={7}
                      className="d-flex flex-row m-0"
                      style={{ flexWrap: `wrap` }}
                    >
                      <button
                        style={{ borderRadius: `6px` }}
                        id="button0"
                        className="mt-2 mb-2 mr-2 p-1 pl-2 pr-2"
                        onClick={() => {
                          clickToActive(0);
                          setStatus(0);
                        }}
                      >
                        Waiting
                      </button>
                      <button
                        style={{ borderRadius: `6px` }}
                        id="button1"
                        className="m-2 ml-2 mr-2 p-1 pl-2 pr-2"
                        onClick={() => {
                          clickToActive(1);
                          setStatus(1);
                        }}
                      >
                        Approve
                      </button>
                      <button
                        style={{ borderRadius: `6px` }}
                        id="button2"
                        className="m-2 ml-2 mr-2 p-1 pl-2 pr-2"
                        onClick={() => {
                          clickToActive(2);
                          setStatus(2);
                        }}
                      >
                        Disapprove
                      </button>
                    </Col>
                  </Row>
                  <Row className="justify-content-center text-center m-2">
                    <Col lg={3} md={4} xs={4}>
                      <label style={{ fontSize: `18px` }}>Service</label>
                    </Col>
                    <Col lg={5} md={7} xs={7}>
                      <select
                        style={{
                          width: `100%`,
                          borderRadius: `6px`,
                          border: `2px solid black`,
                        }}
                        className="text-center p-2"
                        onChange={(e) => {
                          setServiceSearch(e.target.value);
                        }}
                      >
                        <option value="0">----Select service----</option>
                        {serviceList?.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </select>
                    </Col>
                  </Row>
                </div>
              </CardHeader>
              <CardBody>
                {feedbackList.length !== 0 ? (
                  <Table responsive>
                    <thead className="text-primary text-center">
                      <tr>
                        <th
                          style={{ fontWeight: `bold` }}
                          className="text-center"
                        >
                          #
                        </th>
                        <th style={{ fontWeight: `bold` }}>Name</th>
                        <th style={{ fontWeight: `bold` }}>Date</th>
                        <th style={{ fontWeight: `bold` }}>Content</th>
                        <th
                          style={{ fontWeight: `bold` }}
                          className="text-center"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentList?.map((item, key) => {
                        return (
                          <tr key={item.id} className="text-center">
                            <td>{key + 1}</td>
                            <td className="text-center">
                              {item.appointment?.account?.fullName}
                            </td>
                            <td className="text-center">{item.time}</td>
                            <td className="text-center">{item.content}</td>
                            <td className="text-center btns-mr-5">
                              <Button
                                className="btn-icon"
                                color="info"
                                id="tooltip590841497"
                                size="sm"
                                type="button"
                                onClick={() => {
                                  setFeedbackDetail(item);
                                  setLgShow(true);
                                }}
                              >
                                <i className="now-ui-icons education_paper" />
                              </Button>
                              <UncontrolledTooltip
                                delay={0}
                                target="tooltip590841497"
                              >
                                Detail
                              </UncontrolledTooltip>
                              {item.status === 2 || item.status === 0 ? (
                                <>
                                  <Button
                                    className="btn-icon"
                                    color="success"
                                    id="tooltip26024663"
                                    size="sm"
                                    type="button"
                                    onClick={() => {
                                      setModalMini(true);
                                      setApprove(true);
                                      setFeedbackDetail(item);
                                    }}
                                  >
                                    <i className="now-ui-icons ui-1_check" />
                                  </Button>
                                  <UncontrolledTooltip
                                    delay={0}
                                    target="tooltip26024663"
                                  >
                                    Approve
                                  </UncontrolledTooltip>
                                </>
                              ) : null}
                              {item.status === 1 || item.status === 0 ? (
                                <>
                                  <Button
                                    className="btn-icon"
                                    color="danger"
                                    id="tooltip930083782"
                                    size="sm"
                                    type="button"
                                    onClick={() => {
                                      setModalMini(true);
                                      setApprove(false);
                                      setFeedbackDetail(item);
                                    }}
                                  >
                                    <i className="now-ui-icons ui-1_simple-remove" />
                                  </Button>
                                  <UncontrolledTooltip
                                    delay={0}
                                    target="tooltip930083782"
                                  >
                                    Disapprove
                                  </UncontrolledTooltip>
                                </>
                              ) : null}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                ) : (
                  <h3 style={{ color: `red`, marginLeft: `40px` }}>
                    Don't have feedback
                  </h3>
                )}
              </CardBody>
            </Card>
            <CustomPagination
              itemsPerPage={itemPerPage}
              totalItems={feedbackList.length}
              paginate={paginate}
            />
          </Col>
        </Row>
        <Modal
          size="lg"
          show={lgShow}
          onHide={() => setLgShow(false)}
          aria-labelledby="example-modal-sizes-title-lg"
          // scrollable={true}
        >
          <div color="info" className="text-center mt-4 ml-2">
            <h2 className="text-info" style={{ paddingBottom: 0 }}>
              Feedback Detail
            </h2>
          </div>
          <div>
            <Modal.Body>
              {feedbackDetail != null ? (
                <>
                  <Row>
                    <Col lg={3} xs={4} md={4}>
                      <label>Account name: </label>
                    </Col>
                    <Col className="text-left">
                      {feedbackDetail.appointment?.account?.fullName}
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={3} xs={4} md={4}>
                      <label>Account phone: </label>
                    </Col>
                    <Col className="text-left">
                      {feedbackDetail.appointment?.account?.phone}
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={3} xs={4} md={4}>
                      <label>Branch: </label>
                    </Col>
                    <Col className="text-left">
                      {feedbackDetail.appointment?.branch.name} -{" "}
                      {feedbackDetail.appointment?.branch.district.name},{" "}
                      {
                        feedbackDetail.appointment?.branch.district.province
                          .name
                      }
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={3} xs={4} md={4}>
                      <label>Date of appointment: </label>
                    </Col>
                    <Col className="text-left">
                      {feedbackDetail.appointment?.appointmentDate} -{" "}
                      {feedbackDetail.appointment?.appointmentTime}
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={3} xs={4} md={4}>
                      <label>Time feedback: </label>
                    </Col>
                    <Col className="text-left">{feedbackDetail.time}</Col>
                  </Row>
                  <Row>
                    <Col lg={3} xs={4} md={4}>
                      <label>Content feedback: </label>
                    </Col>
                    <Col className="text-left">{feedbackDetail.content}</Col>
                  </Row>
                </>
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
                <Button
                  color="success"
                  onClick={() => {
                    setLgShow(false);
                    setModalMini(true);
                    setApprove(true);
                  }}
                >
                  Approve
                </Button>
              </Col>
              <Col>
                <Button
                  color="warning"
                  onClick={() => {
                    setLgShow(false);
                    setModalMini(true);
                    setApprove(false);
                  }}
                >
                  Disapprove
                </Button>
              </Col>
            </Row>
          </div>
        </Modal>
        <DangerModal
          isOpen={modalMini}
          toggle={toggleModalMini}
          size="mini"
          modalClassName="modal-info"
        >
          <div className="modal-header justify-content-center">
            <div className="modal-profile">
              <i className="now-ui-icons business_badge" />
            </div>
          </div>
          <ModalBody>
            {approve ? (
              <p>{"Are sure to approve this feedback ?"}</p>
            ) : (
              <p>{"Are sure to disapprove this feedback ?"}</p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              color="link"
              className="btn-neutral"
              onClick={async () => {
                if (approve) {
                  approveFeedback();
                } else {
                  disapproveFeedback();
                }
                setModalMini(false);
                setRender(!render);
                console.log(render);
              }}
            >
              Yes
            </Button>
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
  );
}

export default FeedbackTableAdmin;
