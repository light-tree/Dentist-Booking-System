import React, { useEffect, useRef, useState } from "react";
import NotificationAlert from "react-notification-alert";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Form,
  Input,
  FormGroup,
  CardFooter,
} from "reactstrap";
import PanelHeader from "components/PanelHeader/PanelHeader.js";
import AccountApi from "api/AccountApi";
import { useHistory } from "react-router-dom";

function UserPage() {
  const [account, setAccount] = useState(null);
  const history = useHistory();
  const notify = useRef(null);
  useEffect(() => {
    getProfile();
    if (sessionStorage.getItem("update") === "true") {
      notifyMessage("Edit successfully!!!");
      sessionStorage.removeItem("update");
    }
  }, []);

  const getProfile = () => {
    AccountApi.getAccount(sessionStorage.getItem("phone")).then((res) => {
      setAccount(res.data);
      console.log("res data", res.data);
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
      <NotificationAlert
        ref={notify}
        zIndex={9999}
        onClick={() => console.log("hey")}
      />
      <div className="content mt-3">
        <Row className="justify-content-center">
          <Col md="8">
            <Card>
              <CardHeader>
                <h5 className="title">Profile</h5>
              </CardHeader>
              <CardBody>
                <Form>
                  <Row>
                    <Col className="px-1" md="6">
                      <FormGroup>
                        <label>Name</label>
                        <Input
                          defaultValue="michael23"
                          placeholder="Username"
                          type="text"
                          readOnly={true}
                          value={account?.fullName}
                          style={{
                            backgroundColor: `white`,
                            cursor: `context-menu`,
                          }}
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-1" md="6">
                      <FormGroup>
                        <label htmlFor="exampleInputEmail1">Phone</label>
                        <Input
                          readOnly
                          style={{
                            backgroundColor: `white`,
                            cursor: `context-menu`,
                          }}
                          value={account?.phone}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="px-1" md="6">
                      <FormGroup>
                        <label>Date of birth</label>
                        <Input
                          defaultValue="michael23"
                          placeholder="Username"
                          type="text"
                          readOnly={true}
                          value={account?.dateOfBirth}
                          style={{
                            backgroundColor: `white`,
                            cursor: `context-menu`,
                          }}
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-1" md="6">
                      <FormGroup>
                        <label htmlFor="exampleInputEmail1">Gender</label>
                        <Input
                          readOnly
                          style={{
                            backgroundColor: `white`,
                            cursor: `context-menu`,
                          }}
                          value={account?.gender === 1 ? "Male" : "Female"}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="px-1" md="6">
                      <FormGroup>
                        <label>Date of birth</label>
                        <Input
                          defaultValue="michael23"
                          placeholder="Username"
                          type="text"
                          readOnly={true}
                          value={account?.dateOfBirth}
                          style={{
                            backgroundColor: `white`,
                            cursor: `context-menu`,
                          }}
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-1" md="6">
                      <FormGroup>
                        <label htmlFor="exampleInputEmail1">Gender</label>
                        <Input
                          readOnly
                          style={{
                            backgroundColor: `white`,
                            cursor: `context-menu`,
                          }}
                          value={account?.gender === 1 ? "Male" : "Female"}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Email</label>
                        <Input
                          value={account?.email}
                          placeholder="Company"
                          type="text"
                          readOnly
                          style={{
                            backgroundColor: `white`,
                            cursor: `context-menu`,
                          }}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label>Address</label>
                        <Input
                          value={`${account?.district?.name},${account?.district?.province?.name}`}
                          readOnly
                          style={{
                            backgroundColor: `white`,
                            cursor: `context-menu`,
                          }}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
              <CardFooter>
                <Button
                  onClick={() =>
                    history.push(
                      sessionStorage.getItem("role") === "ROLE_ADMIN"
                        ? "/admin/account/edit"
                        : sessionStorage.getItem("role") === "ROLE_STAFF"
                        ? "/staff/account/edit"
                        : "auth/login-page"
                    )
                  }
                >
                  Update
                </Button>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default UserPage;
