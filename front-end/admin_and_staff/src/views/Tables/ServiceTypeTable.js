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
} from "reactstrap";

import PanelHeader from "components/PanelHeader/PanelHeader.js";
import "assets/css/index.css";
import React, { useEffect, useRef } from "react";
import serviceTypeApi from "api/serviceTypeApi";
import CustomPagination from "views/Widgets/Pagination";
import { useHistory } from "react-router-dom";

import NotificationAlert from "react-notification-alert";

function ServiceTypeTable() {
  const history = useHistory();
  const list = [];
  const [serviceTypeList, setServiceTypeList] = React.useState(list);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [serviceTypesPerPage] = React.useState(5);
  const notify = useRef();

  const indexOfLastServiceType = currentPage * serviceTypesPerPage;
  const indexOfFirstServiceType = indexOfLastServiceType - serviceTypesPerPage;
  const currentServiceTypes = serviceTypeList.slice(
    indexOfFirstServiceType,
    indexOfLastServiceType
  );

  //Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const fetchServiceTypeList = async () => {
    try {
      const response = await serviceTypeApi.getAll();
      console.log(response);
      setServiceTypeList(response);
    } catch (error) {
      console.log("Fetch service list failed", error);
    }
  };

  useEffect(() => {
    fetchServiceTypeList();
    if (sessionStorage.getItem("addServiceType")) {
      notifyMessage("Add new service type successfully");
      sessionStorage.removeItem("addServiceType");
    }
    if (sessionStorage.getItem("editService")) {
      notifyMessage("Edit service type successfully");
      sessionStorage.removeItem("editService");
    }
  }, []);
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
      <div className="content">
        <NotificationAlert
          ref={notify}
          zIndex={9999}
          onClick={() => console.log("hey")}
        />
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Service Type</CardTitle>
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

                      <th style={{ fontWeight: `bold` }}>Description</th>

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
                    {currentServiceTypes.map((serviceType) => {
                      return (
                        <tr>
                          <td className="text-center">{serviceType.id}</td>
                          <td>{serviceType.name}</td>
                          <td>{serviceType.description}</td>
                          <td>
                            <div style={{ color: "green" }}>
                              <i className="fas fa-check-circle"> </i> Active
                            </div>
                          </td>
                          <td className="text-center btns-mr-5">
                            <Button
                              className="btn-icon"
                              color="success"
                              id="tooltip26024663"
                              size="sm"
                              type="button"
                              onClick={() => {
                                history.push(
                                  "/admin/type-service/edit/" + serviceType.id
                                );
                              }}
                            >
                              <i className="now-ui-icons ui-2_settings-90"></i>
                            </Button>
                            <UncontrolledTooltip
                              delay={0}
                              target="tooltip26024663"
                            >
                              Update
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
          itemsPerPage={serviceTypesPerPage}
          totalItems={serviceTypeList.length}
          paginate={paginate}
        />
      </div>
    </>
  );
}

export default ServiceTypeTable;
