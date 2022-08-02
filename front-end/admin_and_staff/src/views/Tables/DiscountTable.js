import {
  Table,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  Button,
  ModalBody,
  ModalFooter,
  Input,
  UncontrolledTooltip,
} from "reactstrap";

import discountApi from "api/discountApi";
import { useEffect, useRef, useState } from "react";
import CustomPagination from "views/Widgets/Pagination";
import Discount from "views/Pages/dbs-page/edit-form/Discount";
import { Modal } from "react-bootstrap";
import Select from "react-select";
import serviceApi from "api/serviceApi";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import NotificationAlert from "react-notification-alert";

function DiscountTable() {
  const [discountList, setDiscountList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [discountsPerPage] = useState(5);
  const [modalMini, setModalMini] = useState(false);
  const [idDelete, setIdDelete] = useState(-1);
  const [isEdit, setIsEdit] = useState(false);
  const [editDiscount, setEditDiscount] = useState({});
  const [lgShow, setLgShow] = useState(false);

  const [statusSearch, setStatusSearch] = useState(0);
  const [serviceList, setServicList] = useState([]);
  const [serviceSearch, setServiceSearch] = useState({
    value: "0",
    label: "Select All Service",
  });
  const [discountNameSearch, setDiscountNameSearch] = useState("");
  const [dateSearch, setDateSearch] = useState();

  const indexOfLastDiscount = currentPage * discountsPerPage;
  const indexOfFirstDiscount = indexOfLastDiscount - discountsPerPage;
  const currentDiscounts = discountList.slice(
    indexOfFirstDiscount,
    indexOfLastDiscount
  );
  const history = useHistory();
  const notify = useRef();

  //Pop up alert delete
  const toggleModalMini = () => {
    setModalMini(false);
  };

  //Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const fetchDiscountList = async () => {
    try {
      await discountApi.getDiscountList().then((result) => {
        console.log(result);
        setDiscountList(result);
        setLoading(false);
      });
    } catch (error) {
      console.log("Fetch discount list failed", error);
    }
  };
  // const editDiscount = (id) => {
  //   console.log("discount id: ", id);
  // };

  //Delete service
  const disableDiscount = async () => {
    setModalMini(false);
    if (idDelete !== -1) {
      try {
        await discountApi.disableDiscount(idDelete).then((res) => {
          console.log("Dlt: ", res);
          window.location.reload(false);
        });
      } catch (error) {
        console.log("xóa hhk đc", error);
      }
    }
  };

  useEffect(() => {
    fetchDiscountList();
    document.getElementById(`button${statusSearch}`).classList +=
      " active-button-status";
    getAllService();
    if (sessionStorage.getItem("addDiscount")) {
      notifyMessage("Add discount successfully");
      sessionStorage.removeItem("addDiscount");
    }
    if (sessionStorage.getItem("updateDiscount")) {
      notifyMessage("Update discount successfully");
      sessionStorage.removeItem("updateDiscount");
    }
  }, []);

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

  const getAllService = async () => {
    const result = await serviceApi.getServiceList().then((res) => {
      console.log("service list", res);
      let x = res.map((item) => {
        return {
          value: item.id,
          label: item.name,
        };
      });
      setServicList([{ value: "0", label: "Select all service" }, ...x]);
    });
  };

  const buttonStatusClick = (id) => {
    for (let index = 0; index < 3; index++) {
      document
        .getElementById(`button${index}`)
        .classList.remove("active-button-status");
    }
    document.getElementById(`button${id}`).classList += " active-button-status";
    setStatusSearch(id);
  };

  useEffect(() => {
    filterDiscount();
  }, [statusSearch, discountNameSearch, dateSearch, serviceSearch]);

  const filterDiscount = async () => {
    var data;
    data = {
      status: statusSearch,
      name: discountNameSearch,
      endDate: dateSearch,
      serviceId: serviceSearch.value,
    };
    setCurrentPage(1);
    const result = await discountApi.filterDiscount(data).then((res) => {
      setDiscountList(res);
    });
  };
  return (
    <>
      <NotificationAlert ref={notify} zIndex={9999} />
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Discount</CardTitle>
                <Row md={7} className="justify-content-center mb-3">
                  <Col md={2}>
                    <label>Service</label>
                  </Col>
                  <Col md={5}>
                    <Select
                      className="react-select text-center"
                      classNamePrefix="react-select"
                      placeholder="Choose branch"
                      options={serviceList}
                      value={serviceSearch}
                      onChange={(value) => {
                        setServiceSearch(value);
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
                      type="text"
                      className="react-select p-2"
                      classNamePrefix="react-select"
                      placeholder="Enter name discount  "
                      onChange={(e) => {
                        setDiscountNameSearch(e.target.value);
                      }}
                    />
                  </Col>
                </Row>
                <Row md={7} className="justify-content-center mb-3">
                  <Col md={2}>
                    <label>Date</label>
                  </Col>
                  <Col md={5}>
                    <Input
                      style={{}}
                      type="date"
                      className="react-select p-2"
                      classNamePrefix="react-select"
                      placeholder="Select end date"
                      onChange={(e) => {
                        if (e.target.valueAsDate) {
                          setDateSearch(e.target.value);
                        } else {
                          setDateSearch(null);
                        }
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
                      <th style={{ fontWeight: `bold` }}>Start date</th>
                      <th style={{ fontWeight: `bold` }}>End date</th>
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
                    {currentDiscounts.map((discount, index) => {
                      return (
                        <tr>
                          <td className="text-center" key={discount.id}>
                            {index + 1}
                          </td>
                          <td>{discount.name}</td>
                          <td>{discount.startDate}</td>
                          <td>{discount.endDate}</td>
                          <td>
                            {discount.status === 1 ? (
                              <div style={{ color: "green" }}>
                                <i className="fas fa-check-circle"> </i> Active
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
                              color="success"
                              onClick={() => {
                                setEditDiscount(discount);
                                setLgShow(true);
                              }}
                              id={`detail${discount.id}`}
                              size="sm"
                              type="button"
                            >
                              <i className="now-ui-icons ui-2_settings-90" />
                            </Button>
                            <UncontrolledTooltip
                              delay={0}
                              target={`detail${discount.id}`}
                            >
                              Detail
                            </UncontrolledTooltip>
                            <Button
                              className="btn-icon"
                              color="danger"
                              size="sm"
                              type="button"
                              id={`remove${discount.id}`}
                              onClick={() => {
                                setModalMini(true);
                                setIdDelete(discount.id);
                              }}
                              disabled={discount.status === 2}
                            >
                              <i className="now-ui-icons ui-1_simple-remove" />
                            </Button>
                            <UncontrolledTooltip
                              delay={0}
                              target={`remove${discount.id}`}
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
        </Row>
        <CustomPagination
          itemsPerPage={discountsPerPage}
          totalItems={discountList.length}
          paginate={paginate}
        />
        <Modal
          size="lg"
          show={lgShow}
          onHide={() => setLgShow(false)}
          aria-labelledby="example-modal-sizes-title-lg"
          // scrollable={true}
        >
          <div color="info" className="text-center mt-4 ml-2">
            <h2 className="text-info" style={{ paddingBottom: 0 }}>
              Discount detail
            </h2>
          </div>
          <div>
            <Modal.Body>
              {editDiscount != null ? (
                <Col className="m-3">
                  <Row>
                    <Col lg={3} mg={3} xs={3}>
                      <label>
                        <b>Name: </b>
                      </label>
                    </Col>
                    <Col className="mt-0">
                      <span>{editDiscount.name}</span>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={3} mg={3} xs={3}>
                      <label>
                        <b>Percentage: </b>
                      </label>
                    </Col>
                    <Col className="mt-0">
                      <span>{editDiscount.percentage}%</span>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={3} mg={3} xs={3}>
                      <label>
                        <b>Time apply: </b>
                      </label>
                    </Col>
                    <Col className="mt-0">
                      <span>
                        {editDiscount.startDate} - {editDiscount.endDate}
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
                      <span>{editDiscount.description}</span>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={3} mg={3} xs={3}>
                      <label>
                        <b>Apply for: </b>
                      </label>
                    </Col>
                    <Col className="mt-0">
                      <span>
                        {editDiscount.discountServiceSet?.map((item, key) => {
                          if (
                            key ===
                            editDiscount.discountServiceSet.length - 1
                          ) {
                            return item.service.name + ".";
                          } else {
                            return item.service.name + ", ";
                          }
                        })}
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
                        {editDiscount.status !== 0 ? (
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
                <Button
                  color="primary"
                  onClick={() => {
                    setLgShow(false);
                    history.push("/admin/discount/edit/" + editDiscount.id);
                  }}
                >
                  Update
                </Button>
              </Col>
            </Row>
          </div>
        </Modal>
        {/* Delete discount  */}
        <Modal
          show={modalMini}
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
            <p>{"Are sure to disable \n this discount ?"}</p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="warning"
              className="btn-neutral"
              onClick={() => disableDiscount()}
            >
              Yes
            </Button>{" "}
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
    //   )}
    // </>
  );
}

export default DiscountTable;
