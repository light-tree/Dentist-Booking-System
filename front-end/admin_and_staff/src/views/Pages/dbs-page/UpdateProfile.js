import AdminNavbar from "components/Navbars/AdminNavbar";
import PanelHeader from "components/PanelHeader/PanelHeader";
import provinceApi from "api/provinceApi";
import React, { Component, useEffect, useRef, useState } from "react";
import Select from "react-select";
import Datetime from "react-datetime";
import NotificationAlert from "react-notification-alert";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardFooter,
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Label,
  Button,
} from "reactstrap";
import districtApi from "api/districtApi";
import AccountApi from "api/AccountApi";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

var selectOptions = [
  { value: "1", label: "Male" },
  { value: "2", label: "Female" },
];

export default function UpdateProfile() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState();
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [provinceId, setprovinceId] = useState(null);
  const [districtId, setDistrictId] = useState(null);

  const [passwordError, setPasswordError] = useState("false");
  const [oldPasswordError, setOldPasswordError] = useState("false");
  const [confirmError, setConfirmError] = useState("false");
  const [nameError, setNameError] = useState("false");
  const [genderError, setGenderError] = useState();
  const [emailError, setEmailError] = useState("false");
  const [dateOfBirthError, setDateOfBirthError] = useState("false");
  const [provinceIdError, setprovinceIdError] = useState("false");
  const [districtIdError, setDistrictIdError] = useState("false");

  const [listProvince, setListProvicne] = useState([]);
  const [listDistrict, setListDistrict] = useState(null);
  const [account, setAccount] = useState(null);
  const history = useHistory();

  const [firstnameFocus, setfirstnameFocus] = React.useState(false);
  const [lastnameFocus, setlastnameFocus] = React.useState(false);
  const [emailFocus, setemailFocus] = React.useState(false);
  const notify = useRef(null);

  useEffect(async () => {
    getListProvince();
    getProfile();
  }, []);
  const getProfile = () => {
    AccountApi.getAccount(sessionStorage.getItem("phone")).then((res) => {
      console.log("res data", res.data);
      setAccount(res.data);
      setPhone(res.data.phone);
      setDateOfBirth(res.data.dateOfBirth);
      setDistrictId({
        value: res.data.district.id,
        label: res.data.district.name,
      });
      setprovinceId({
        value: res.data.district.province.id,
        label: res.data.district.province.name,
      });
      setGender({
        value: res.data.gender,
        label: res.data.gender === 1 ? "Male" : "Female",
      });
      setEmail(res.data.email);
      setName(res.data.fullName);
    });
  };

  const getListProvince = async () => {
    const result = await provinceApi.getProvinceList();
    if (result) {
      var list = [];
      result?.map((item) => {
        var tmp = { value: item.id, label: item.name };
        list = list.concat(tmp);
      });
      setListProvicne(list);
    }
  };

  useEffect(() => {
    getDistrictList();
  }, [provinceId]);

  const getDistrictList = async () => {
    const result = await districtApi.getDistrictList(provinceId?.value);
    if (result) {
      var list = [];
      result.data?.map((item) => {
        var tmp = { value: item.id, label: item.name };
        list = list.concat(tmp);
      });
      setListDistrict(list);
    }
  };

  const verifyLength = (value, length) => {
    if (value.length >= length) {
      return true;
    }
    return false;
  };
  // function that verifies if two strings are equal
  const compare = (string1, string2) => {
    console.log(string1 + "\n" + string2);
    if (string1 === string2) {
      return true;
    }
    return false;
  };
  // function that verifies if value contains only numbers
  const verifyNumber = (value) => {
    var numberRex = new RegExp("^[0-9]+$");
    if (numberRex.test(value)) {
      return true;
    }
    return false;
  };

  const verifyEmail = (value) => {
    var emailRex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(value)) {
      return true;
    }
    return false;
  };

  const handleAddNew = () => {
    var flag = true;
    if (districtId.value < 0) {
      setDistrictIdError("true");
      flag = false;
    } else {
      setDistrictIdError("false");
    }
    if (provinceId.value < 0 || !provinceId) {
      setprovinceIdError("true");
      flag = false;
    } else {
      setprovinceIdError("false");
    }
    var now = new Date();
    var dob = new Date(dateOfBirth);
    if (!dateOfBirth || dob.getFullYear() < now.getFullYear() - 90) {
      setDateOfBirthError("true");
      flag = false;
    } else {
      setDateOfBirthError("false");
    }
    if (!gender) {
      setGenderError("true");
      flag = false;
    } else {
      setGenderError("false");
    }
    if (!verifyLength(name, 8)) {
      setNameError("true");
      flag = false;
    } else {
      setNameError("false");
    }
    if (!verifyEmail(email)) {
      setEmailError("true");
      flag = false;
    } else {
      setEmailError("false");
    }
    if (!verifyLength(password, 8)) {
      setPasswordError("true");
      flag = false;
    } else {
      setPasswordError("false");
    }
    if (!verifyLength(confirm, 8)) {
      setConfirmError("true");
      flag = false;
    } else {
      setConfirmError("false");
    }
    if (!verifyLength(oldPassword, 8)) {
      setOldPasswordError("true");
      flag = false;
    } else {
      setOldPasswordError("false");
    }
    if (phone.length < 10 || phone.length > 11) {
      flag = false;
      setPhone("true");
    }
    if (flag) {
      console.log("true ");
      checkAccount();
    } else {
      console.log("faf");
    }
  };

  const checkAccount = () => {
    var data = {
      phone: account.phone,
      password: password,
    };
    console.log("data check account", data);
    var dataUpdate = {
      fullName: name,
      password: password,
      dateOfBirth: dateOfBirth,
      gender: gender.value,
      districtId: districtId.value,
      phone: account.phone,
      email: email,
      confirmPassword: oldPassword,
    };
    AccountApi.updateAccount(dataUpdate)
      .then((res) => {
        console.log(res);
        sessionStorage.setItem("update", "true");
        if (sessionStorage.getItem("role") === "ROLE_STAFF") {
          window.location.replace("/staff/account/profile");
        } else if (sessionStorage.getItem("role") === "ROLE_ADMIN") {
          window.location.replace("/admin/account/profile");
        }
      })
      .catch((error) => {
        if (error.response.status === 406) {
          notifyMessage("Wrong old password");
          setOldPasswordError("wrong");
          setOldPassword("");
          setPassword("");
          setConfirm("");
        }
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
  useEffect(() => {
    if (sessionStorage.getItem("login")) {
      sessionStorage.removeItem("login");
    }
  }, []);
  return (
    <div>
      <NotificationAlert
        ref={notify}
        zIndex={9999}
        onClick={() => console.log("hey")}
      />
      <div className="container">
        <div className="content">
          <div className="register-page">
            <Container>
              <Row className="justify-content-center">
                <Col lg={8} md={8} xs={12} className="p-3">
                  <Card className="card-signup">
                    <CardHeader className="text-center">
                      <CardTitle tag="h4">Update profile</CardTitle>
                    </CardHeader>
                    <CardBody>
                      <Form>
                        <label
                          className="ml-3"
                          style={{ color: `black`, fontSize: `16px` }}
                        >
                          Phone
                        </label>
                        <InputGroup
                          className={firstnameFocus ? "input-group-focus" : ""}
                        >
                          <Input
                            style={{
                              width: `100%`,
                              color: `black`,
                              cursor: `context-menu`,
                            }}
                            type="number"
                            placeholder="Phone..."
                            readOnly
                            onFocus={(e) => setfirstnameFocus(true)}
                            onBlur={(e) => setfirstnameFocus(false)}
                            value={phone}
                          />
                        </InputGroup>
                        {/* Old password  */}
                        <label
                          className="ml-3"
                          style={{ color: `black`, fontSize: `16px` }}
                        >
                          Old Password
                        </label>
                        <InputGroup
                          className={lastnameFocus ? "input-group-focus" : ""}
                        >
                          <Input
                            style={{ width: `100%`, color: `black` }}
                            type="password"
                            placeholder="Old Password..."
                            value={oldPassword}
                            onFocus={(e) => setlastnameFocus(true)}
                            onBlur={(e) => setlastnameFocus(false)}
                            onChange={(e) => {
                              setOldPassword(e.target.value);
                            }}
                          />
                          {oldPasswordError === "true" ? (
                            <Row>
                              <label
                                className="error pl-4"
                                style={{ color: `red` }}
                              >
                                This feild is required 8 characters.
                              </label>
                            </Row>
                          ) : null}
                          {oldPasswordError === "wrong" ? (
                            <Row>
                              <label
                                className="error pl-4"
                                style={{ color: `red` }}
                              >
                                This password is wrong.
                              </label>
                            </Row>
                          ) : null}
                        </InputGroup>
                        {/* Password  */}
                        <label
                          className="ml-3"
                          style={{ color: `black`, fontSize: `16px` }}
                        >
                          New Password
                        </label>
                        <InputGroup
                          className={lastnameFocus ? "input-group-focus" : ""}
                        >
                          <Input
                            style={{ width: `100%`, color: `black` }}
                            type="password"
                            placeholder="New Password..."
                            value={password}
                            onFocus={(e) => setlastnameFocus(true)}
                            onBlur={(e) => setlastnameFocus(false)}
                            onChange={(e) => {
                              setPassword(e.target.value);
                            }}
                          />
                          {passwordError == "true" ? (
                            <Row>
                              <label
                                className="error pl-4"
                                style={{ color: `red` }}
                              >
                                This feild is required 8 characters.
                              </label>
                            </Row>
                          ) : null}
                        </InputGroup>
                        {/* Confirm  */}
                        <label
                          className="ml-3"
                          style={{ color: `black`, fontSize: `16px` }}
                        >
                          Confirm password
                        </label>
                        <InputGroup
                          className={lastnameFocus ? "input-group-focus" : ""}
                        >
                          <Input
                            style={{ width: `100%` }}
                            type="password"
                            value={confirm}
                            placeholder="Confirm password..."
                            onFocus={(e) => setlastnameFocus(true)}
                            onBlur={(e) => setlastnameFocus(false)}
                            onChange={(e) => {
                              setConfirm(e.target.value);
                            }}
                          />
                          {confirmError === "true" ? (
                            <Row>
                              <label
                                className="error pl-4"
                                style={{ color: `red` }}
                              >
                                This feild is required 8 characters.
                              </label>
                            </Row>
                          ) : null}
                          {confirmError === "NotEqual" ? (
                            <Row>
                              <label
                                className="error pl-4"
                                style={{ color: `red` }}
                              >
                                This feild is not match to password.
                              </label>
                            </Row>
                          ) : null}
                        </InputGroup>
                        {/* Name  */}
                        <label
                          className="ml-3"
                          style={{ color: `black`, fontSize: `16px` }}
                        >
                          Name
                        </label>
                        <InputGroup
                          className={lastnameFocus ? "input-group-focus" : ""}
                        >
                          <Input
                            style={{ width: `100%` }}
                            type="text"
                            placeholder="Full Name..."
                            value={name}
                            onFocus={(e) => setlastnameFocus(true)}
                            onBlur={(e) => setlastnameFocus(false)}
                            onChange={(e) => {
                              setName(e.target.value);
                            }}
                          />
                          {nameError === "true" ? (
                            <Row>
                              <label
                                className="error pl-4"
                                style={{ color: `red` }}
                              >
                                This feild is required 8 characters.
                              </label>
                            </Row>
                          ) : null}
                        </InputGroup>

                        {/* Email  */}
                        <label
                          className="ml-3"
                          style={{ color: `black`, fontSize: `16px` }}
                        >
                          Email
                        </label>
                        <InputGroup
                          className={emailFocus ? "input-group-focus" : ""}
                          style={{ display: `flex`, flexDirection: `column` }}
                        >
                          <Input
                            style={{ width: `100%` }}
                            type="email"
                            placeholder="Email..."
                            value={email}
                            onFocus={(e) => setemailFocus(true)}
                            onBlur={(e) => setemailFocus(false)}
                            onChange={(e) => {
                              setEmail(e.target.value);
                            }}
                          />
                          {emailError === "true" ? (
                            <Row>
                              <label
                                className="error pl-4"
                                style={{ color: `red` }}
                              >
                                Please enter a valid email address.
                              </label>
                            </Row>
                          ) : null}
                        </InputGroup>
                        {/* DAte of birth  */}
                        <label
                          className="ml-3"
                          style={{ color: `black`, fontSize: `16px` }}
                        >
                          Date of birth
                        </label>
                        <FormGroup>
                          <Datetime
                            timeFormat={false}
                            dateFormat="YYYY-MM-DD"
                            inputProps={{
                              placeholder: "Date Of Birth...",
                            }}
                            value={dateOfBirth}
                            onChange={(e) => {
                              setDateOfBirth(e._d);
                            }}
                          />
                        </FormGroup>
                        {dateOfBirthError === "true" ? (
                          <Row>
                            <label
                              className="error pl-4"
                              style={{ color: `red` }}
                            >
                              Please enter a valid date.
                            </label>
                          </Row>
                        ) : null}

                        {/* Gender  */}
                        <label
                          className="ml-3"
                          style={{ color: `black`, fontSize: `16px` }}
                        >
                          Gender
                        </label>
                        <Col className="p-0 pb-2">
                          <Select
                            className="react-select "
                            classNamePrefix="react-select"
                            placeholder="Gender"
                            name="singleSelect"
                            value={gender}
                            options={selectOptions}
                            onChange={(value) => setGender(value)}
                          />
                        </Col>
                        {genderError === "true" ? (
                          <Row>
                            <label
                              className="error pl-4"
                              style={{ color: `red` }}
                            >
                              Please enter choose gender.
                            </label>
                          </Row>
                        ) : null}
                        {/* Provinvce  */}
                        <label
                          className="ml-3"
                          style={{ color: `black`, fontSize: `16px` }}
                        >
                          Province
                        </label>
                        <Col className="p-0 pb-2">
                          <Select
                            style={{ color: `black` }}
                            className="react-select "
                            classNamePrefix="react-select"
                            placeholder="Province"
                            name="Select Province"
                            value={provinceId}
                            options={listProvince}
                            onChange={(value) => {
                              setprovinceId(value);
                              setDistrictId({
                                value: -1,
                                label: "Select district ",
                              });
                            }}
                          />
                        </Col>
                        {provinceIdError === "true" ? (
                          <Row>
                            <label
                              className="error pl-4"
                              style={{ color: `red` }}
                            >
                              Please enter a province.
                            </label>
                          </Row>
                        ) : null}
                        {/* District  */}
                        <label
                          className="ml-3"
                          style={{ color: `black`, fontSize: `16px` }}
                        >
                          District
                        </label>
                        <Col className="p-0">
                          <Select
                            style={{ color: `black` }}
                            className="react-select "
                            classNamePrefix="react-select"
                            placeholder="District"
                            name="singleSelect"
                            value={districtId}
                            options={listDistrict}
                            onChange={(value) => setDistrictId(value)}
                          />
                        </Col>
                        {districtIdError === "true" ? (
                          <Row>
                            <label
                              className="error pl-4"
                              style={{ color: `red` }}
                            >
                              Please enter a district.
                            </label>
                          </Row>
                        ) : null}
                      </Form>
                    </CardBody>
                    <CardFooter className="text-center">
                      <Button
                        color="primary"
                        size="lg"
                        className="btn-round"
                        href="#pablo"
                        onClick={() => {
                          handleAddNew();
                        }}
                      >
                        Update
                      </Button>
                    </CardFooter>
                  </Card>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </div>
    </div>
  );
}
