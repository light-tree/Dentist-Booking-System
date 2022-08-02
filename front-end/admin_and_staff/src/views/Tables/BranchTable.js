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
import { useHistory } from "react-router-dom";
import { Modal, Image } from "react-bootstrap";
import React, { useEffect, useRef, useState } from "react";
import branchApi from "api/branchApi";
import { BrowserRouter as Link } from "react-router-dom";

import PanelHeader from "components/PanelHeader/PanelHeader.js";
import "assets/css/index.css";
import CustomPagination from "views/Widgets/Pagination";
import NotificationAlert from "react-notification-alert";
import { toast } from "react-toastify";
function BranchTable() {
  let history = useHistory();
  const [branchList, setBranchList] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [branchsPerPage] = React.useState(5);
  const [branchDetail, setBranchDetail] = useState(null);

  const notify = useRef(null);
  const [lgShow, setLgShow] = useState(false);
  const indexOfLastBranch = currentPage * branchsPerPage;
  const indexOfFirstBranch = indexOfLastBranch - branchsPerPage;
  const currentBranchs = branchList.slice(
    indexOfFirstBranch,
    indexOfLastBranch
  );

  //Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const fetchBranchList = async () => {
    try {
      await branchApi.getAll().then((res) => {
        setBranchList(res);
        setLoading(true);
      });
      console.log(branchList);
    } catch (error) {
      console.log("Failed to fetch API", error);
    }
  };

  const showProfileBranch = async (id) => {
    try {
      const result = await branchApi.getBranchById(id);
      if (result) {
        console.log(result.data);
        setBranchDetail(result.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBranchList();
    if (sessionStorage.getItem("add")) {
      notifyMessage("Add branch successfully");
      sessionStorage.removeItem("add");
    }
    if (sessionStorage.getItem("editBranch")) {
      notifyMessage("Edit branch successfully");
      console.log("abcdj");
      sessionStorage.removeItem("editBranch");
    }
  }, []);

  const onClickUpdateStatus = async (branch) => {
    const data = {
      id: branch.id,
      name: branch.name,
      url: branch.url,
      openTime: branch.openTime,
      closeTime: branch.closeTime,
      districtId: branch.district.id,
      status: 2,
    };
    console.log(data);
    await branchApi.updateBranch(data).then((res) => {
      window.location.reload();
    });
  };

  const notifyMessage = (message) => {
    var options = {
      place: "tr",
      message: (
        <div>
          <div>{message}</div>
        </div>
      ),
      type: "success",
      icon: "now-ui-icons ui-1_bell-53",
      autoDismiss: 5,
    };
    notify.current.notificationAlert(options);
  };

  return (
    <>
      <NotificationAlert ref={notify} />
      {loading ? (
        <>
          <div className="content">
            <Row>
              <Col md="12">
                <Card>
                  <CardHeader>
                    <CardTitle tag="h4">Branch</CardTitle>
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
                          <th style={{ fontWeight: `bold` }}>Working time</th>
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
                        {currentBranchs.map((branch, index) => {
                          return (
                            <tr>
                              <td className="text-center">{index + 1}</td>
                              <td>
                                <Link to={`/branch/${branch.id}`}>
                                  {branch.name}
                                </Link>
                              </td>
                              <td>
                                <div to={`/branch/${branch.id}`}>
                                  {branch.openTime.slice(0, 5)} -{" "}
                                  {branch.closeTime.slice(0, 5)}
                                </div>
                              </td>
                              <td>
                                <div class="stock-status in-stock">
                                  {branch.status === 1 ? (
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
                                </div>
                              </td>
                              <td className="text-center btns-mr-5">
                                <Button
                                  value={branch.id}
                                  className="btn-icon"
                                  color="info"
                                  id={`view${branch.id}`}
                                  size="sm"
                                  type="button"
                                  onClick={async (e) => {
                                    await showProfileBranch(
                                      e.currentTarget.value
                                    );
                                    setLgShow(true);
                                  }}
                                >
                                  <i className="now-ui-icons business_bank" />
                                </Button>
                                <UncontrolledTooltip
                                  delay={0}
                                  target={`view${branch.id}`}
                                >
                                  Detail
                                </UncontrolledTooltip>

                                <Button
                                  className="btn-icon"
                                  color="success"
                                  size="sm"
                                  type="button"
                                  id={`update${branch.id}`}
                                  onClick={() => {
                                    history.push(
                                      "/admin/branch/edit/" + branch.id
                                    );
                                  }}
                                >
                                  <i className="now-ui-icons ui-2_settings-90" />
                                </Button>
                                <UncontrolledTooltip
                                  delay={0}
                                  target={`update${branch.id}`}
                                >
                                  Update
                                </UncontrolledTooltip>
                                <Button
                                  className="btn-icon"
                                  color="danger"
                                  size="sm"
                                  type="button"
                                  id={`delete${branch.id}`}
                                  onClick={() => {
                                    onClickUpdateStatus(branch);
                                  }}
                                  disabled={branch.status !== 2 ? false : true}
                                >
                                  <i className="now-ui-icons ui-1_simple-remove" />
                                </Button>
                                <UncontrolledTooltip
                                  delay={0}
                                  target={`delete${branch.id}`}
                                >
                                  Disable
                                </UncontrolledTooltip>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </CardBody>
                </Card>
              </Col>
              <Modal
                size="lg"
                show={lgShow}
                onHide={() => setLgShow(false)}
                aria-labelledby="example-modal-sizes-title-lg"
                // scrollable={true}
              >
                <div color="info" className="text-center mt-4">
                  <h2
                    className="text-info text-center"
                    style={{ paddingBottom: 0 }}
                  >
                    Branch Detail
                  </h2>
                </div>
                <div>
                  <Modal.Body>
                    {branchDetail != null ? (
                      <Col className="m-3">
                        <Row className="justify-content-center m-0">
                          <Col xs={20} sm={2} md={5}>
                            <Image
                              src={
                                "https://drive.google.com/uc?id=" +
                                branchDetail.url
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
                            <span>{branchDetail.name}</span>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={3} mg={3} xs={3}>
                            <label>
                              <b>Address: </b>
                            </label>
                          </Col>
                          <Col className="mt-0">
                            <span>
                              {branchDetail.district.name},{" "}
                              {branchDetail.district.province.name}
                            </span>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={3} mg={3} xs={3}>
                            <label>
                              <b>Working time: </b>
                            </label>
                          </Col>
                          <Col className="mt-0">
                            <span>
                              {branchDetail.openTime} - {branchDetail.closeTime}
                            </span>
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
                              {branchDetail.status === 1 ? (
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
                      <Button
                        color="primary"
                        onClick={() => {
                          setLgShow(false);
                          history.push("/admin/branch/edit/" + branchDetail.id);
                        }}
                      >
                        Update
                      </Button>
                    </Col>
                  </Row>
                </div>
              </Modal>
            </Row>

            {/* <DangerModal
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
            <p>{"Are sure to delete \n this branch ?"}</p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="link"
              className="btn-neutral"
              onClick={disableService}
            >
              Delete
            </Button>{" "}
            <Button
              color="link"
              className="btn-neutral"
              onClick={toggleModalMini}
            >
              Cancel
            </Button>
          </ModalFooter>
        </DangerModal> */}
            <CustomPagination
              itemsPerPage={branchsPerPage}
              totalItems={branchList.length}
              paginate={paginate}
            />
          </div>
        </>
      ) : (
        <>
          <PanelHeader size="sm" />
          <center>
            <h2>Loading...</h2>
          </center>
        </>
      )}
    </>
  );
}

export default BranchTable;
