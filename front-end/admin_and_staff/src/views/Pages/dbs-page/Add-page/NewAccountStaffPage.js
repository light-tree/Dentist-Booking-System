import AdminNavbar from "components/Navbars/AdminNavbar";
import PanelHeader from "components/PanelHeader/PanelHeader";
import provinceApi from "api/provinceApi";
import React, { Component, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import Datetime from "react-datetime";
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

var selectOptions = [
  { value: "1", label: "Male" },
  { value: "2", label: "Female" },
];

export default function NewAccountStaffPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState();
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [provinceId, setprovinceId] = useState();
  const [districtId, setDistrictId] = useState();

  const [listProvince, setListProvicne] = useState([]);
  const [listDistrict, setListDistrict] = useState(null);

  const [firstnameFocus, setfirstnameFocus] = React.useState(false);
  const [lastnameFocus, setlastnameFocus] = React.useState(false);
  const [emailFocus, setemailFocus] = React.useState(false);

  const [singleSelect, setSingleSelect] = React.useState(null);
  useEffect(async () => {
    // document.body.classList.add("register-page");
    getListProvince();
    // return function cleanup() {
    //   document.body.classList.remove("register-page");
    // };
  }, []);

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
    console.log(provinceId);
    const result = await districtApi.getDistrictList(provinceId?.value);
    console.log("district", result);
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
    if (!districtId) {
      setDistrictId("Not");
      flag = false;
    }
    if (!provinceId) {
      setprovinceId("Not");
      flag = false;
    }
    if (!dateOfBirth || dateOfBirth.length === 0 || dateOfBirth === "Not") {
      setDateOfBirth("Not");
      flag = false;
    } else {
      var dob = new Date(dateOfBirth);
      var n = new Date();
      console.log("sdvbdabv", dob.getFullYear());
      if (
        Number(dob.getFullYear()) > Number(n.getFullYear()) - 18 ||
        Number(dob.getFullYear()) < Number(n.getFullYear()) - 60
      ) {
        setDateOfBirth("NotE");
        flag = false;
      }
    }
    if (!gender) {
      setGender("Not");
      flag = false;
    }
    if (!verifyLength(name, 5)) {
      setName("Not");
    }
    if (!verifyNumber(phone) || phone.at(0) != 0) {
      setPhone("Not");
    }
    if (email.length != 0) {
      if (!verifyEmail(email)) {
        setEmail("has-danger");
      }
    }
    if (!verifyLength(password, 8)) {
      setPassword("Not");
    }
    if (!verifyLength(confirm, 8)) {
      setConfirm("Not");
    }
    if (
      verifyLength(name, 5) &&
      verifyNumber(phone) &&
      verifyLength(password, 8) &&
      verifyLength(confirm, 8) &&
      compare(password, confirm)
    ) {
    } else {
      flag = false;
    }
    if (phone.length !== 10) {
      flag = false;
      setPhone("Not");
    }
    if (flag) {
      const data = {
        phone: phone,
        fullName: name,
        email: email,
        password: password,
        dateOfBirth: dateOfBirth,
        districtId: districtId.value,
        gender: gender.value,
      };
      console.log(data);
      const result = AccountApi.AddStaff(data).then((res) => {
        console.log(res);
        if (res === "Register successfully") {
          sessionStorage.setItem("addNewStaff", true);
          window.location.replace("/admin/account");
        }
      });
    }
  };

  return (
    <div>
      <div className="container">
        <div className="content">
          <div className="register-page">
            <Container>
              <Row className="justify-content-center">
                <Col lg={7} md={8} xs={12}>
                  <Card className="card-signup">
                    <CardHeader className="text-center">
                      <CardTitle tag="h4">Add New Staff</CardTitle>
                    </CardHeader>
                    <CardBody>
                      <Form>
                        <InputGroup
                          className={firstnameFocus ? "input-group-focus" : ""}
                        >
                          <Input
                            style={{ width: `100%` }}
                            type="number"
                            placeholder="Phone..."
                            onFocus={(e) => setfirstnameFocus(true)}
                            onBlur={(e) => setfirstnameFocus(false)}
                            onChange={(e) => {
                              if (verifyNumber(e.target.value)) {
                                setPhone(e.target.value);
                              } else {
                                setPhone("Not");
                              }
                            }}
                          />
                          {phone === "Not" ? (
                            <Row>
                              <label
                                className="error pl-4"
                                style={{ color: `red` }}
                              >
                                Please enter a valid number.
                              </label>
                            </Row>
                          ) : null}
                        </InputGroup>
                        {/* Password  */}
                        <InputGroup
                          className={lastnameFocus ? "input-group-focus" : ""}
                        >
                          <Input
                            style={{ width: `100%` }}
                            type="password"
                            placeholder="Password..."
                            onFocus={(e) => setlastnameFocus(true)}
                            onBlur={(e) => setlastnameFocus(false)}
                            onChange={(e) => {
                              if (verifyLength(e.target.value, 8)) {
                                setPassword(e.target.value);
                              } else {
                                setPassword("Not");
                              }
                            }}
                          />
                          {password === "Not" ? (
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
                        <InputGroup
                          className={lastnameFocus ? "input-group-focus" : ""}
                        >
                          <Input
                            style={{ width: `100%` }}
                            type="password"
                            placeholder="Confirm password..."
                            onFocus={(e) => setlastnameFocus(true)}
                            onBlur={(e) => setlastnameFocus(false)}
                            onChange={(e) => {
                              if (verifyLength(e.target.value, 8)) {
                                setConfirm(e.target.value);
                                if (!compare(password, e.target.value)) {
                                  setConfirm("NotE");
                                }
                              } else {
                                setConfirm("Not");
                              }
                            }}
                          />
                          {confirm === "Not" ? (
                            <Row>
                              <label
                                className="error pl-4"
                                style={{ color: `red` }}
                              >
                                This feild is required 8 characters.
                              </label>
                            </Row>
                          ) : null}
                          {confirm === "NotE" ? (
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
                        <InputGroup
                          className={lastnameFocus ? "input-group-focus" : ""}
                        >
                          <Input
                            maxLength={30}
                            style={{ width: `100%` }}
                            type="text"
                            placeholder="Full Name..."
                            onFocus={(e) => setlastnameFocus(true)}
                            onBlur={(e) => setlastnameFocus(false)}
                            onChange={(e) => {
                              if (verifyLength(e.target.value, 10)) {
                                setName(e.target.value);
                              } else {
                                setName("Not");
                              }
                            }}
                          />
                          {name === "Not" ? (
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
                        <InputGroup
                          className={emailFocus ? "input-group-focus" : ""}
                          style={{ display: `flex`, flexDirection: `column` }}
                        >
                          <Input
                            style={{ width: `100%` }}
                            type="email"
                            placeholder="Email..."
                            onFocus={(e) => setemailFocus(true)}
                            onBlur={(e) => setemailFocus(false)}
                            onChange={(e) => {
                              if (!verifyEmail(e.target.value)) {
                                setEmail("has-danger");
                              } else {
                                setEmail("has-success");
                                setEmail(e.target.value);
                              }

                              console.log(email);
                            }}
                          />
                          {email === "has-danger" ? (
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
                        <FormGroup>
                          <Datetime
                            timeFormat={false}
                            dateFormat="YYYY-MM-DD"
                            inputProps={{
                              placeholder: "Date Of Birth...",
                            }}
                            onChange={(e) => {
                              console.log(e._d);
                              setDateOfBirth(e._d);
                            }}
                          />
                        </FormGroup>
                        {dateOfBirth === "Not" ? (
                          <Row>
                            <label
                              className="error pl-4"
                              style={{ color: `red` }}
                            >
                              Please enter a valid date.
                            </label>
                          </Row>
                        ) : null}
                        {dateOfBirth === "NotE" ? (
                          <Row>
                            <label
                              className="error pl-4"
                              style={{ color: `red` }}
                            >
                              Inappropriate age.
                            </label>
                          </Row>
                        ) : null}

                        {/* Gender  */}
                        <Col className="p-0 pb-2">
                          <Select
                            className="react-select primary"
                            classNamePrefix="react-select"
                            placeholder="Gender"
                            name="singleSelect"
                            value={gender}
                            options={selectOptions}
                            onChange={(value) => setGender(value)}
                          />
                        </Col>
                        {gender === "Not" ? (
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
                        <Col className="p-0 pb-2">
                          <Select
                            className="react-select primary"
                            classNamePrefix="react-select"
                            placeholder="Province"
                            name="Select Province"
                            value={provinceId}
                            options={listProvince}
                            onChange={(value) => setprovinceId(value)}
                          />
                        </Col>
                        {provinceId === "Not" ? (
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
                        <Col className="p-0">
                          <Select
                            className="react-select primary"
                            classNamePrefix="react-select"
                            placeholder="District"
                            name="singleSelect"
                            value={districtId}
                            options={listDistrict}
                            onChange={(value) => setDistrictId(value)}
                          />
                        </Col>
                        {districtId === "Not" ? (
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
                        Add New
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
