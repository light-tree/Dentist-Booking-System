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
  Input,
  UncontrolledTooltip,
} from "reactstrap";
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2,
} from "react-html-parser";
import React, { useEffect, useRef, useState } from "react";
import NotificationAlert from "react-notification-alert";

import PanelHeader from "components/PanelHeader/PanelHeader.js";
import serviceApi from "api/serviceApi.js";
import "assets/css/index.css";
import { Modal, Image } from "react-bootstrap";
import CustomPagination from "views/Widgets/Pagination";
import Service from "views/Pages/dbs-page/edit-form/Service";
import serviceTypeApi from "../../api/serviceTypeApi";
import Select from "react-select";

function ServiceTable() {
  const [serviceList, setServiceList] = React.useState([]);
  const [service, setService] = React.useState({});
  const [serviceType, setServiceType] = React.useState("");
  const [image, setImage] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const [lgShow, setLgShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [servicesPerPage] = useState(5);
  const [modalMini, setModalMini] = useState(false);
  const [idDelete, setIdDelete] = useState(-1);
  const [editService, setEditService] = useState({});
  const [isEdit, setIsEdit] = useState(false);

  const [serviceNameSearch, setServiceNameSearch] = useState("");
  const [serviceTypeList, setServiceTypeList] = useState([]);
  const [serviceTypeSearch, setServiceTypeSearch] = useState({
    value: "0",
    label: "Select all service type",
  });
  const [statusSearch, setStatusSearch] = useState("0");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [statusMaxPrice, setStatusMaxPrice] = useState(true);
  const notify = useRef();

  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = serviceList.slice(
    indexOfFirstService,
    indexOfLastService
  );

  //Pop up alert delete
  const toggleModalMini = () => {
    setModalMini(!modalMini);
  };

  //Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const fetchServiceList = async () => {
    try {
      const response = await serviceApi.getServiceList();
      setServiceList(response);
      setLoading(false);
      console.log(loading);
    } catch (error) {
      setLoading(true);
      console.log("Fetch service list failed", error);
    }
  };

  const loadInforService = async (id) => {
    console.log(id);
    try {
      await serviceApi.getService(id).then((res) => {
        console.log(res.serviceType.name);
        setServiceType(res.serviceType.name);
        setService(res);
      });
    } catch (error) {
      console.log("Can not load service info", error);
    }
    return null;
  };

  const disableService = async () => {
    setModalMini(!modalMini);
    if (idDelete !== -1) {
      try {
        await serviceApi.disableService(idDelete).then((res) => {
          console.log("đã xóa");
          window.location.reload(false);
        });
      } catch (error) {
        console.log("Can not delete service: ", error);
      }
    }
  };

  useEffect(() => {
    fetchServiceList();
    getAllServivceType();
    if (sessionStorage.getItem("addNewService")) {
      notifyMessage("Add new service successfully");
      sessionStorage.removeItem("addNewService");
    }
    if (sessionStorage.getItem("editService")) {
      notifyMessage("Edit service successfully");
      sessionStorage.removeItem("editService");
    }
  }, []);

  const getAllServivceType = async () => {
    const result = await serviceTypeApi.getAll().then((res) => {
      let x = res.map((item) => {
        return {
          value: item.id,
          label: item.name,
        };
      });
      setServiceTypeList([
        {
          value: "0",
          label: "Select all service type",
        },
        ...x,
      ]);
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
    filterService();
    setCurrentPage(1);
  }, [serviceNameSearch, serviceTypeSearch, minPrice, maxPrice, statusSearch]);

  const filterService = async () => {
    if (
      minPrice &&
      maxPrice &&
      formatNumber(minPrice) >= formatNumber(maxPrice)
    ) {
      setStatusMaxPrice("false");
      return;
    } else {
      setStatusMaxPrice("");
    }
    let data;
    data = {
      name: serviceNameSearch,
      serviceTypeId: serviceTypeSearch.value,
      minPrice: minPrice ? formatNumber(minPrice) : 0,
      maxPrice: maxPrice ? formatNumber(maxPrice) : 0,
      status: statusSearch,
    };
    console.log(data);
    const result = await serviceApi.filterService(data).then((res) => {
      setServiceList(res);
    });
  };

  const formatNumber = (num) => {
    let x = "";
    for (let index = 0; index < num.length; index++) {
      if (num.charAt(index) !== " ") {
        x += num.charAt(index);
      }
    }
    return x;
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
      {isEdit ? (
        <Service {...editService} />
      ) : (
        <div className="content">
          {loading ? (
            <div>"Loading..." </div>
          ) : (
            <>
              <Row>
                <Col md="12">
                  <Card>
                    <CardHeader>
                      <CardTitle tag="h4">Service</CardTitle>
                      <Row md={7} className="justify-content-center mb-3">
                        <Col md={2}>
                          <label
                            style={{
                              fontSize: `16px`,
                              fontWeight: `bold`,
                            }}
                          >
                            Name
                          </label>
                        </Col>
                        <Col md={5}>
                          <Input
                            style={{ fontSize: `15px` }}
                            className="react-select p-2"
                            classNamePrefix="react-select"
                            placeholder="Enter name service"
                            value={serviceNameSearch}
                            onChange={(e) => {
                              setServiceNameSearch(e.target.value);
                            }}
                          />
                        </Col>
                      </Row>
                      <Row md={7} className="justify-content-center mb-3">
                        <Col md={2}>
                          <label
                            style={{
                              fontSize: `16px`,
                              fontWeight: `bold`,
                            }}
                          >
                            Service type
                          </label>
                        </Col>
                        <Col md={5}>
                          <Select
                            className="react-select"
                            classNamePrefix="react-select"
                            placeholder="Enter name doctor"
                            options={serviceTypeList}
                            value={serviceTypeSearch}
                            onChange={(value) => {
                              setServiceTypeSearch(value);
                            }}
                          />
                        </Col>
                      </Row>
                      <Row md={7} className="justify-content-center mb-3">
                        <Col md={2}>
                          <label
                            style={{
                              fontSize: `16px`,
                              fontWeight: `bold`,
                            }}
                          >
                            Min price
                          </label>
                        </Col>
                        <Col md={5}>
                          <Input
                            style={{ fontSize: `15px` }}
                            type="text"
                            className="react-select p-2"
                            classNamePrefix="react-select"
                            placeholder="Enter min price search "
                            value={minPrice}
                            onChange={(e) => {
                              let x = "";

                              if (e.nativeEvent.data) {
                                if (
                                  "0123456789".indexOf(e.nativeEvent.data) ===
                                  -1
                                ) {
                                  return;
                                }
                                for (
                                  let index = 0;
                                  index < e.target.value.length;
                                  index++
                                ) {
                                  if (e.target.value.charAt(index) === " ") {
                                    x = x + e.target.value.charAt(index);
                                  } else {
                                    if (index % 4 === 0) {
                                      x =
                                        x + " " + e.target.value.charAt(index);
                                    } else {
                                      x = x + e.target.value.charAt(index);
                                    }
                                  }
                                }
                              } else {
                                x = e.target.value;
                              }
                              setMinPrice(x);
                            }}
                          />
                        </Col>
                      </Row>
                      <Row md={7} className="justify-content-center mb-3">
                        <Col md={2}>
                          <label
                            style={{
                              fontSize: `16px`,
                              fontWeight: `bold`,
                            }}
                          >
                            Max price
                          </label>
                        </Col>
                        <Col md={5}>
                          <Input
                            style={{ fontSize: `15px` }}
                            type="text"
                            className="react-select p-2"
                            classNamePrefix="react-select"
                            placeholder="Enter max price search"
                            value={maxPrice}
                            onChange={(e) => {
                              let x = "";

                              if (e.nativeEvent.data) {
                                if (
                                  "0123456789".indexOf(e.nativeEvent.data) ===
                                  -1
                                ) {
                                  return;
                                }
                                for (
                                  let index = 0;
                                  index < e.target.value.length;
                                  index++
                                ) {
                                  if (e.target.value.charAt(index) === " ") {
                                    x = x + e.target.value.charAt(index);
                                  } else {
                                    if (index % 4 === 0) {
                                      x =
                                        x + " " + e.target.value.charAt(index);
                                    } else {
                                      x = x + e.target.value.charAt(index);
                                    }
                                  }
                                }
                              } else {
                                x = e.target.value;
                              }
                              setMaxPrice(x);
                            }}
                          />
                          {statusMaxPrice === "false" ? (
                            <span>
                              <p style={{ color: `red` }}>
                                Max price must greater than min price
                              </p>
                            </span>
                          ) : null}
                        </Col>
                      </Row>
                      <Row md={7} className="justify-content-center mb-3">
                        <Col md={2}>
                          <label
                            style={{
                              fontSize: `16px`,
                              fontWeight: `bold`,
                            }}
                          >
                            Status
                          </label>
                        </Col>
                        <Col md={5}>
                          <button
                            id="button0"
                            className={`mr-3 ${
                              statusSearch == 0
                                ? "  active-button-status"
                                : null
                            }`}
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
                            <th style={{ fontWeight: `bold` }}>#</th>
                            <th style={{ fontWeight: `bold` }}>Name</th>
                            <th style={{ fontWeight: `bold` }}>Service type</th>
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
                          {currentServices.map((service, index) => {
                            return (
                              <tr>
                                <td>{index + 1}</td>
                                <td>
                                  {/* <Link to={`/service/${service.id}`}> */}
                                  {service.name}
                                  {/* </Link> */}
                                </td>

                                <td>{service.serviceType.name}</td>
                                <td>
                                  {service.status === 1 ? (
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
                                    id={`detail${service.id}`}
                                    color="info"
                                    size="sm"
                                    type="button"
                                    onClick={() => {
                                      setLgShow(true);
                                      loadInforService(service.id);
                                    }}
                                  >
                                    <i className="now-ui-icons users_single-02" />
                                  </Button>
                                  <UncontrolledTooltip
                                    delay={0}
                                    target={`detail${service.id}`}
                                  >
                                    Detail
                                  </UncontrolledTooltip>
                                  <Button
                                    className="btn-icon"
                                    color="success"
                                    id={`update${service.id}`}
                                    size="sm"
                                    type="button"
                                    onClick={() => {
                                      setEditService(service);
                                      setIsEdit(!isEdit);
                                    }}
                                  >
                                    <i className="now-ui-icons ui-2_settings-90" />
                                  </Button>
                                  <UncontrolledTooltip
                                    delay={0}
                                    target={`update${service.id}`}
                                  >
                                    Update
                                  </UncontrolledTooltip>
                                  <Button
                                    className="btn-icon"
                                    color="danger"
                                    id={`Inactive${service.id}`}
                                    size="sm"
                                    type="button"
                                    onClick={() => {
                                      setModalMini(!modalMini);
                                      setIdDelete(service.id);
                                    }}
                                    disabled={
                                      service.status === 1 ? false : true
                                    }
                                  >
                                    <i className="now-ui-icons ui-1_simple-remove" />
                                  </Button>
                                  <UncontrolledTooltip
                                    delay={0}
                                    target={`Inactive${service.id}`}
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
                  <div color="info" className="text-center mt-4 ml-2">
                    <h2 className="text-info" style={{ paddingBottom: 0 }}>
                      Service Detail
                    </h2>
                  </div>
                  <div>
                    <Modal.Body>
                      {service != null ? (
                        <Col className="mt-0 ml-4">
                          <Row className="justify-content-md-center">
                            <Col xs={20} sm={2} md={4}>
                              <Image
                                src={
                                  "https://drive.google.com/uc?id=" +
                                  service.url
                                }
                                rounded
                              />
                            </Col>
                          </Row>

                          <Row>
                            <Col className="md-12 mt-0">
                              <span>
                                <b>Service: </b> {service.name}
                              </span>
                            </Col>
                            <Col>
                              <span>
                                <b>Service type: </b> {serviceType}
                              </span>
                            </Col>
                          </Row>
                          <Row className="mt-2">
                            <Col>
                              <b>Price: </b>
                              {Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(service.minPrice)}{" "}
                              ~{" "}
                              {Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(service.maxPrice)}
                              {/* {service.minPrice}đ - {service.maxPrice}đ */}
                            </Col>
                            <Col>
                              <b>Duration: </b> {service.estimatedTime} hour(s)
                            </Col>
                          </Row>
                          <Row className="mt-2">
                            <Col>
                              <span>
                                <b>Mô tả: </b>
                              </span>
                              {ReactHtmlParser(service.description)}
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
                            setEditService(service);
                            setIsEdit(!isEdit);
                          }}
                        >
                          Update
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </Modal>
              </Row>
            </>
          )}
          <CustomPagination
            itemsPerPage={servicesPerPage}
            totalItems={serviceList.length}
            paginate={paginate}
          />
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
              <p>{"Are sure to disable \n this Service ?"}</p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="link"
                className="btn-neutral"
                onClick={disableService}
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
      )}
    </>
  );
}

export default ServiceTable;
