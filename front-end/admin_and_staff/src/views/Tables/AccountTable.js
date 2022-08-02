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
  ModalHeader,
  Label,
  Input,
  FormGroup,
  Modal as DangerModal,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import NotificationAlert from "react-notification-alert";
import { useEffect, useRef, useState } from "react";
import AccountApi from "api/AccountApi";
import CustomPagination from "views/Widgets/Pagination";
import { useHistory } from "react-router-dom";
import { Modal } from "react-bootstrap";

function AccountTable() {
  const [accountList, setAccountList] = useState([]);
  const [roleId, setRoleId] = useState(1);
  const [status, setStatus] = useState(1);
  const [phoneSearch, setPhoneSearch] = useState("");
  const [accountPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [accountDetail, setAccountDetail] = useState(null);
  const history = useHistory();
  const indexOfLastAccount = currentPage * accountPerPage;
  const indexOfFirstAccount = indexOfLastAccount - accountPerPage;
  const currentAccount = accountList.slice(
    indexOfFirstAccount,
    indexOfLastAccount
  );
  const [showUpdateStatus, setShowUpdateStatus] = useState(false);
  const [modalMini, setMiniModal] = useState(false);
  const notify = useRef();
  //Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const getAccountListByRoleIdAndStatus = async () => {
    try {
      const result = await AccountApi.GetAccountByRoleIdAndStatus(
        roleId,
        status,
        phoneSearch
      );
      if (result) {
        console.log(result);
        setAccountList(result);
      }
    } catch (error) {}
  };

  useEffect(() => {
    getAccountListByRoleIdAndStatus(roleId, status, phoneSearch);
    if (sessionStorage.getItem("addNewStaff")) {
      notifyMessage("Add new staff's account successfully");
      sessionStorage.removeItem("addNewStaff");
    }
  }, []);

  useEffect(() => {
    getAccountListByRoleIdAndStatus(roleId, status, "");
    setPhoneSearch("");
    checkActive();
    addActive();
  }, [roleId, status]);

  useEffect(() => {
    getAccountListByRoleIdAndStatus(roleId, status, phoneSearch);
  }, [phoneSearch]);

  const checkActive = () => {
    for (let i = 1; i <= 3; i++) {
      document.getElementById(`role${i}`).classList.remove("active-link-role");
    }
    document.getElementById(`role${roleId}`).classList += " active-link-role";
  };

  const addActive = () => {
    for (let i = 1; i <= 2; i++) {
      document
        .getElementById(`button${i}`)
        .classList.remove("active-button-status");
    }
    console.log(status);
    document.getElementById(`button${status}`).classList +=
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

  return (
    <>
      <NotificationAlert
        ref={notify}
        zIndex={9999}
        onClick={() => console.log("hey")}
      />
      <div className="content">
        <Row>
          <Col xs={9} md={12}>
            <Card>
              <CardHeader className="d-flex">
                <CardTitle
                  id="role1"
                  tag="h5"
                  className="pl-2 pr-2"
                  style={{ cursor: `pointer` }}
                  onClick={() => {
                    // checkActive(1);
                    setRoleId(1);
                  }}
                >
                  <span>Admin</span> |
                </CardTitle>
                <CardTitle
                  id="role3"
                  tag="h5"
                  className="pl-2 pr-2"
                  style={{ cursor: `pointer` }}
                  onClick={() => {
                    // checkActive(3);
                    setRoleId(3);
                  }}
                >
                  <span>Staff</span> |
                </CardTitle>
                <CardTitle
                  id="role2"
                  tag="h5"
                  className="pl-2 pr-2"
                  style={{ cursor: `pointer` }}
                  onClick={() => {
                    setRoleId(2);
                    // checkActive(2);
                  }}
                >
                  <span>Patient</span> |
                </CardTitle>
              </CardHeader>
              <CardHeader className="d-flex p-0 pl-4  ">
                <CardTitle className="mt-0 ">
                  <button
                    id="button1"
                    className="m-0 mr-5"
                    onClick={() => {
                      setStatus(1);
                    }}
                  >
                    Active
                  </button>
                </CardTitle>
                <CardTitle className="mt-0 ">
                  <button
                    className="m-0 mr-5"
                    id="button2"
                    onClick={() => {
                      setStatus(2);
                    }}
                  >
                    Inactive
                  </button>
                </CardTitle>
              </CardHeader>
              <CardHeader className="d-flex p-0">
                <Row
                  style={{
                    width: `100vw`,
                    marginLeft: `10px`,
                    fontSize: `15px`,
                  }}
                >
                  <Col lg={4} md={6} xs={10}>
                    <input
                      type="number"
                      className="m-0 pl-3 pr-3 text-center"
                      style={{
                        width: `100%`,
                        margin: `0px 10px`,
                        padding: `5px`,
                        borderRadius: `30px`,
                      }}
                      placeholder="Phone number"
                      onChange={(e) => {
                        setPhoneSearch(e.target.value);
                      }}
                    />
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                {currentAccount.length !== 0 ? (
                  <Table responsive>
                    <thead className="text-primary text-center">
                      <tr style={{ fontWeight: `bold` }}>
                        <th
                          className="text-center"
                          style={{ fontWeight: `bold` }}
                        >
                          #
                        </th>
                        <th style={{ fontWeight: `bold` }}>Name</th>
                        <th style={{ fontWeight: `bold` }}>Phone</th>
                        <th style={{ fontWeight: `bold` }}>Gender</th>
                        <th style={{ fontWeight: `bold` }}>Email</th>
                        <th style={{ fontWeight: `bold` }}>Birth</th>
                        <th style={{ fontWeight: `bold` }}>Address</th>
                        {roleId !== 1 ? (
                          <th
                            style={{ fontWeight: `bold` }}
                            className="text-center"
                          >
                            Actions
                          </th>
                        ) : (
                          ""
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {accountList.map((account, key) => {
                        return (
                          <tr key={account.id} className="text-center">
                            <td>{key + 1}</td>
                            <td>
                              <Row>
                                <Col>{account.fullName}</Col>
                              </Row>
                            </td>
                            <td>
                              <Row>
                                <Col>{account.phone}</Col>
                              </Row>
                            </td>
                            <td>
                              <Row className="text-center">
                                <Col>{account.gender ? "Nam" : "Nữ"}</Col>
                              </Row>
                            </td>
                            <td>
                              <Row>
                                <Col>
                                  {!account.email ? "N/A" : account.email}
                                </Col>
                              </Row>
                            </td>
                            <td>
                              <Row>
                                <Col>{account.dateOfBirth}</Col>
                              </Row>
                            </td>
                            <td>
                              <Row>
                                <Col>
                                  {account.district.name},{" "}
                                  {account.district.province.name}
                                </Col>
                              </Row>
                            </td>
                            {roleId !== 1 ? (
                              <td className="text-center btns-mr-5">
                                <Button
                                  className="btn-icon"
                                  color="success"
                                  id="tooltip26024663"
                                  size="sm"
                                  type="button"
                                  onClick={() => {
                                    // history.push(
                                    //   "/admin/account/edit/" + account.id
                                    // );
                                    setAccountDetail(account);
                                    setShowUpdateStatus(true);
                                    console.log(account);
                                  }}
                                >
                                  <i className="now-ui-icons ui-2_settings-90" />
                                </Button>
                                <UncontrolledTooltip
                                  delay={0}
                                  target="tooltip26024663"
                                >
                                  Update
                                </UncontrolledTooltip>
                                {/* <Button
                                  className="btn-icon"
                                  color="danger"
                                  id="tooltip930083782"
                                  size="sm"
                                  type="button"
                                >
                                  <i className="now-ui-icons ui-1_simple-remove" />
                                </Button>
                                <UncontrolledTooltip
                                  delay={0}
                                  target="tooltip930083782"
                                >
                                  Delete
                                </UncontrolledTooltip> */}
                              </td>
                            ) : (
                              ""
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                ) : (
                  "No account"
                )}
              </CardBody>
            </Card>
            <CustomPagination
              itemsPerPage={accountPerPage}
              totalItems={accountList.length}
              paginate={paginate}
            />
          </Col>
        </Row>
        <Modal
          show={showUpdateStatus}
          size="md"
          onHide={() => {
            setShowUpdateStatus(false);
          }}
        >
          <ModalHeader>Update status</ModalHeader>
          <ModalBody className="text-center d-flex flex-row justify-content-center">
            <div>
              <Row>
                <Col>
                  <label>Name</label>
                </Col>
                <Col>
                  <p>{accountDetail?.fullName}</p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <label>Phone</label>
                </Col>
                <Col>
                  <p>{accountDetail?.phone}</p>
                </Col>
              </Row>

              <Row>
                <Col>Status</Col>
                <Col>{status === 1 ? "Active" : "Inactive"}</Col>
              </Row>
            </div>
          </ModalBody>
          <ModalFooter className="text-center d-flex justify-content-center">
            <Row className="justify-content-center">
              <Col md={5}>
                <Button
                  color={status === 1 ? "warning" : "success"}
                  onClick={() => setMiniModal(true)}
                >
                  {status === 1 ? "Disable" : "Enable"}
                </Button>
              </Col>
              <Col md={5}>
                <Button
                  color="info"
                  onClick={() => {
                    setShowUpdateStatus(false);
                  }}
                >
                  Cancel
                </Button>
              </Col>
            </Row>
          </ModalFooter>
        </Modal>
        <DangerModal
          isOpen={modalMini}
          toggle={() => setMiniModal(false)}
          size="mini"
          modalClassName="modal-info"
        >
          <div className="modal-header justify-content-center">
            <div className="modal-profile">
              <i className="now-ui-icons business_badge" />
            </div>
          </div>
          <ModalBody>
            <p>{"Are sure to disable \n this Service ?"}</p>
          </ModalBody>
          <ModalFooter>
            <Row>
              <Col>
                {" "}
                <Button
                  color="link"
                  className="btn-neutral"
                  onClick={() => {
                    const data = {
                      phone: accountDetail.phone,
                    };
                    console.log("phone gửi xuống", data);
                    if (status === 1) {
                      //đang unban
                      AccountApi.banAccount(data).then((res) => {
                        window.location.reload();
                        console.log("Kết quả trả về", res);
                      });
                    } else {
                      AccountApi.unbanAccount(data).then((res) => {
                        window.location.reload();
                        console.log("Kết quả trả về", res);
                      });
                    }
                  }}
                >
                  Yes
                </Button>
              </Col>
              <Col>
                <Button
                  color="link"
                  className="btn-neutral"
                  onClick={() => setMiniModal(false)}
                >
                  No
                </Button>
              </Col>
            </Row>
          </ModalFooter>
        </DangerModal>
      </div>
    </>
  );
}

export default AccountTable;
