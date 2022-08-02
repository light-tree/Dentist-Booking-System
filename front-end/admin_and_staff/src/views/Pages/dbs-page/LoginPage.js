import React, { useRef } from "react";

// reactstrap components
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Form,
  Container,
  Col,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Button,
} from "reactstrap";
import { Redirect, useHistory } from "react-router-dom";
// core components
import nowLogo from "assets/img/logo-rade2.png";

import bgImage from "assets/img/dentist-office.jpg";
import authApi from "api/AuthApi";
import NotificationAlert from "react-notification-alert";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
function LoginPage() {
  const [phoneFocus, setfirstnameFocus] = React.useState(false);
  const [passwordFocus, setlastnameFocus] = React.useState(false);

  const initialValue = { phone: "", password: "" };
  const [formValue, setFormValue] = React.useState(initialValue);
  const [stateLogin, setStateLogin] = React.useState(false);
  const history = useHistory();
  const notify = useRef();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValue({ ...formValue, [name]: value });
    // console.log(formValue.phone);
  };

  const login = async () => {
    try {
      await authApi.login(formValue).then((result) => {
        const user = sessionStorage.getItem("user");
        console.log("user token: ", user);
        // console.log("session account", sessionStorage.getItem("role"));
        const role = sessionStorage.getItem("role");
        window.location.reload();
        if (user !== null) {
          setStateLogin(true);
        } else {
          setStateLogin(false);
          sessionStorage.setItem("loginFailed", true);
        }
      });
    } catch (error) {
      setStateLogin(false);
      sessionStorage.setItem("loginFailed", true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login();
    //validate
  };
  React.useEffect(() => {
    // document.body.classList.add("login-page");
    // return function cleanup() {
    //   document.body.classList.remove("login-page");
    // };
    if (sessionStorage.getItem("loginFailed")) {
      notifyMessage("Login failed", "danger", "now-ui-icons travel_info");
      sessionStorage.removeItem("loginFailed");
    }
  }, []);

  const RoleUser = () => {
    sessionStorage.clear();
    sessionStorage.setItem("loginFailed", true);
    window.location.replace("/");
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

  return sessionStorage.getItem("user") !== null ? (
    sessionStorage.getItem("role") === "ROLE_ADMIN" ? (
      <Redirect to="/admin/booking" />
    ) : sessionStorage.getItem("role") === "ROLE_STAFF" ? (
      <Redirect to="/staff/home" />
    ) : (
      <RoleUser />
    )
  ) : (
    <>
      <NotificationAlert ref={notify} />

      <div className="content">
        <div className="login-page">
          <Container>
            <Col xs={12} md={8} lg={4} className="ml-auto mr-auto">
              <Form onSubmit={handleSubmit}>
                <Card className="card-login card-plain">
                  <CardHeader>
                    <div className="logo-container">
                      <img src={nowLogo} alt="now-logo" />
                    </div>
                  </CardHeader>
                  <CardBody>
                    <InputGroup
                      className={
                        "no-border form-control-lg " +
                        (phoneFocus ? "input-group-focus" : "")
                      }
                    >
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="now-ui-icons tech_mobile" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        name="phone"
                        maxLength={10}
                        placeholder="Phone number..."
                        onFocus={(e) => setfirstnameFocus(true)}
                        onBlur={(e) => setfirstnameFocus(false)}
                        value={formValue.phone}
                        onChange={handleChange}
                      />
                    </InputGroup>
                    <InputGroup
                      className={
                        "no-border form-control-lg " +
                        (passwordFocus ? "input-group-focus" : "")
                      }
                    >
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="now-ui-icons objects_key-25" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="password"
                        placeholder="Password..."
                        onFocus={(e) => setlastnameFocus(true)}
                        onBlur={(e) => setlastnameFocus(false)}
                        name="password"
                        value={formValue.password}
                        onChange={handleChange}
                      />
                    </InputGroup>
                  </CardBody>
                  <CardFooter>
                    <Button
                      type="submit"
                      block
                      color="info"
                      size="lg"
                      href="#pablo"
                      className="mb-3 btn-round"
                      onClick={handleSubmit}
                    >
                      Login
                    </Button>
                  </CardFooter>
                </Card>
              </Form>
            </Col>
          </Container>
        </div>
      </div>
      <div
        className="full-page-background"
        style={{ backgroundImage: "url(" + bgImage + ")" }}
      />
    </>
  );
}

export default LoginPage;
