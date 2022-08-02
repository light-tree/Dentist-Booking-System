import AdminNavbar from "components/Navbars/AdminNavbar";
import PanelHeader from "components/PanelHeader/PanelHeader";
import { Component } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { Button, Col, Form, FormGroup, Row } from "reactstrap";
import Validator from "utils/validation/validator";
import defaultImage from "assets/img/image_placeholder.jpg";
import branchApi from "api/branchApi";
import provinceApi from "api/provinceApi";
import Select from "react-select";
import districtApi from "api/districtApi";
import NotificationAlert from "react-notification-alert";
import * as ReactBoostrap from "react-bootstrap";
var options = {};
options = {
  place: "tr",
  message: (
    <div>
      <div>
        Successfully add new <b>Branch</b>
      </div>
    </div>
  ),
  type: "success",
  icon: "now-ui-icons ui-1_bell-53",
  autoDismiss: 4,
};

const hours = [
  { value: "06", label: "06" },
  { value: "07", label: "07" },
  { value: "08", label: "08" },
  { value: "09", label: "09" },
  { value: "10", label: "10" },
  { value: "11", label: "11" },
  { value: "12", label: "12" },
  { value: "13", label: "13" },
  { value: "14", label: "14" },
  { value: "15", label: "15" },
  { value: "16", label: "16" },
  { value: "17", label: "17" },
  { value: "18", label: "18" },
  { value: "19", label: "19" },
  { value: "20", label: "20" },
];
const minute = [
  { value: "00", label: "00" },
  { value: "30", label: "30" },
];

class NewBranchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      url: "",
      openTime: {
        hour: { value: "06", label: "06" },
        minute: { value: "00", label: "00" },
      },
      closeTime: {
        hour: { value: "18", label: "18" },
        minute: { value: "00", label: "00" },
      },
      image: null,
      province: { label: "Choose a province", value: -1 },
      initialDistrict: { label: "Choose a district", value: -1 },
      district: { label: "Choose a district", value: -1 },
      provinces: [],
      districts: [],
      errors: {},
      selectProvince: false,
      changeProvince: true,
      imagePreviewUrl: defaultImage,
      selectedFile: null,

      TimeError: false,
      FileError: false,
      isLoading: false,
    };

    const rules = [
      {
        field: "name",
        method: "isLength",
        args: [{ min: 8 }],
        validWhen: true,
        message: "The name field is required 8 character.",
      },
      // {
      //   field: "openTime",
      //   method: "isLength",
      //   args: [{ min: 1 }],
      //   validWhen: true,
      //   message: "The start time field is required",
      // },
      // {
      //   field: "closeTime",
      //   method: "isLength",
      //   args: [{ min: 1 }],
      //   validWhen: true,
      //   message: "The end time field is required",
      // },
      {
        field: "province",
        method: this.validDropdownProvince,
        validWhen: true,
        fieldValue: this.state.province,
        message: "Please choose a province",
      },
      {
        field: "district",
        method: this.validDropdownDistrict,
        validWhen: true,
        fieldValue: this.state.district,
        message: "Please choose a district",
      },
    ];

    this.onHandleChange = this.onHandleChange.bind(this);
    this.onHandleSubmit = this.onHandleSubmit.bind(this);
    this.validator = new Validator(rules);
    this.onFileChange = this.onFileChange.bind(this);
    this.getProvinceList = this.getProvinceList.bind(this);
    this.onHandleSelect = this.onHandleSelect.bind(this);
    this.onHandleSelectDistrict = this.onHandleSelectDistrict.bind(this);
    this.notify = this.notify.bind(this);
  }

  notify() {
    this.refs.notify.notificationAlert(options);
  }

  notifyMessage(message, type, icon) {
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
    this.refs.notify.notificationAlert(options1);
  }

  componentDidMount() {
    this.getProvinceList();
  }

  getProvinceList = async () => {
    console.log("Choose province: ", this.state.selectProvince);
    try {
      await provinceApi.getProvinceList().then((res) => {
        this.setState({
          provinces: res.map((province) => ({
            label: province.name,
            value: province.id,
          })),
        });
      });
    } catch (error) {
      console.log("Can not get province list", error);
    }
  };

  getDistrictList = async (id) => {
    console.log("Here: ", id);
    try {
      await districtApi.getDistrictList(id).then((res) => {
        console.log("res: ", res);
        if (res.data !== null) {
          this.setState({
            district: { label: "Choose a district", value: -1 },
            districts: res.data.map((district) => ({
              label: district.name,
              value: district.id,
            })),
          });
        }
        if (this.state.districts !== []) {
          this.setState({
            selectProvince: true,
          });
        } else {
          this.setState({
            selectProvince: false,
          });
        }
        console.log(this.state.district);
      });
    } catch (error) {
      console.log("Can not load district", error);
    }
  };

  //handle selected province
  onHandleSelect(event) {
    this.setState({
      province: event,
      changProvince: true,
      // selectProvince: false,
    });
    this.getDistrictList(event.value);
  }

  //handle selected district
  onHandleSelectDistrict(event) {
    this.setState({
      district: event,
      changeProvince: false,
    });
    console.log("district: ", event);
  }

  //handle change of input fields
  onHandleChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    this.setState({
      [name]: value,
    });
  }

  validDropdownProvince(province) {
    if (province.value === -1) {
      return false;
    }
    return true;
  }

  validDropdownDistrict(district) {
    if (district.value === -1) {
      return false;
    }
    return true;
  }

  ValidateAll() {
    let flag = true;
    if (
      Number(this.state.openTime.hour.value) >
        Number(this.state.closeTime.hour.value) - 5 ||
      Number(this.state.openTime.hour.value) >
        Number(this.state.closeTime.hour.value)
    ) {
      this.setState({
        TimeError: true,
      });
      flag = false;
    } else {
      this.setState({
        TimeError: false,
      });
    }

    if (!this.state.selectedFile) {
      this.setState({ FileError: true });
      flag = false;
    } else {
      this.setState({ FileError: false });
    }
    return flag;
  }

  // handle data sent back to server
  _insertNewData = async (formData) => {
    var data;
    console.log("click add");
    try {
      this.setState({
        isLoading: true,
      });
      await branchApi
        .insert(formData)
        .then((res) => {
          console.log("Insert ok", res);
          data = {
            name: this.state.name,
            url: res.data,
            openTime: `${this.state.openTime.hour.value}:${this.state.openTime.minute.value}`,
            closeTime: `${this.state.closeTime.hour.value}:${this.state.closeTime.minute.value}`,
            districtId: this.state.district.value,
            status: 1,
          };
        })
        .then(async () => {
          console.log(data);
          await branchApi.insertBranch(data).then((res) => {
            // this.notify();
            sessionStorage.setItem("add", true);
            window.location.replace("/admin/branch");
          });
        });
    } catch (error) {
      console.log("Insert data failed", error);
      this.notifyMessage(
        error.response?.data?.message,
        "danger",
        "now-ui-icons travel_info"
      );
      this.setState({
        isLoading: false,
      });
    }
  };

  async onHandleSubmit(event) {
    if (!this.ValidateAll()) {
      return;
    }
    event.preventDefault();
    this.setState({
      errors: this.validator.validate(this.state, event),
    });
    if (this.validator.isValid) {
      // Đưa data xuống ở đây
      const formData = new FormData();
      console.log(this.state.selectedFile);
      formData.append("url", this.state.selectedFile);
      // formData.append("branchDTO", data);
      this._insertNewData(formData);
    }
  }

  // On file select (from the pop up)
  onFileChange = (event) => {
    // Update the state
    this.setState({ selectedFile: event.target.files[0] });
    let reader = new FileReader();
    let file = event.target.files[0];
    console.log(file);
    reader.onloadend = () => {
      this.setState({
        imagePreviewUrl: reader.result,
      });
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  render() {
    const { errors } = this.state;
    return (
      <>
        {this.state.isLoading ? (
          <div
            style={{
              position: `fixed`,
              top: 0,
              bottom: 0,
              right: 0,
              left: 0,
              backgroundColor: `rgba(128, 128, 128, 0.5)`,
              zIndex: 99999,
              textAlign: `center`,
              margin: `auto`,
            }}
          >
            <div
              style={{
                position: `fixed`,
                top: `50%`,
                bottom: `50%`,
                right: 0,
                left: 0,
              }}
            >
              <ReactBoostrap.Spinner
                animation="border"
                variant="info"
                size="lg"
                style={{ width: `100px`, height: `100px` }}
              />
            </div>
          </div>
        ) : null}
        <div className="content">
          <Form>
            <Row>
              <div className="container rounded bg-white mt-30 mb-15 ml-15">
                <div className="row">
                  <div className="col-md-4 mt-20">
                    <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                      {/* <ImageUpload /> */}
                      <div className="d-flex justify-content-between align-items-center mt-20">
                        <h4 className="text-left">Image</h4>
                      </div>
                      <input
                        style={{ display: "none" }}
                        type="file"
                        accept="image/*"
                        onChange={this.onFileChange}
                        ref={(fileInput) => (this.fileInput = fileInput)}
                      />
                      <div className="thumbnail">
                        <img src={this.state.imagePreviewUrl} alt="..." />
                      </div>
                      {this.state.FileError ? (
                        <span>
                          <p style={{ color: `red` }}>Please select a image</p>
                        </span>
                      ) : null}
                      <Button
                        className="btn-round"
                        onClick={() => this.fileInput.click()}
                      >
                        Select Image
                      </Button>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="p-3 py-5">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="text-right">Branch Information</h4>
                      </div>
                      <FormGroup>
                        <div className="row mt-2">
                          <div className="col-md-12">
                            <label className="labels">Branch Name*</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Branch name"
                              name="name"
                              value={this.state.name}
                              onChange={this.onHandleChange}
                            />
                            {errors.name && (
                              <div
                                className="invalid-feedback"
                                style={{ display: "block" }}
                              >
                                {errors.name}
                              </div>
                            )}
                          </div>
                        </div>
                      </FormGroup>
                      <FormGroup>
                        <Row className="mt-2">
                          <Col lg={6} md={12} className="col-md-6">
                            <label className="labels">Open time*</label>
                            <Row>
                              <Col>
                                <Select
                                  className="react-select text-center"
                                  classNamePrefix="react-select"
                                  placeholder="Hour"
                                  options={hours}
                                  value={this.state.openTime.hour}
                                  onChange={(value) => {
                                    let tmp = this.state.openTime;
                                    this.setState({
                                      openTime: {
                                        hour: value,
                                        minute: tmp.minute,
                                      },
                                    });
                                  }}
                                />
                              </Col>
                              <p className="m-0 pt-2">:</p>
                              <Col>
                                <Select
                                  className="react-select text-center"
                                  classNamePrefix="react-select"
                                  placeholder="Minute"
                                  options={minute}
                                  value={this.state.openTime.minute}
                                  onChange={(value) => {
                                    let tmp = this.state.openTime;
                                    this.setState({
                                      openTime: {
                                        minute: value,
                                        hour: tmp.hour,
                                      },
                                    });
                                  }}
                                />
                              </Col>
                            </Row>
                            {errors.openTime && (
                              <div
                                className="invalid-feedback"
                                style={{ display: "block" }}
                              >
                                {errors.openTime}
                              </div>
                            )}
                          </Col>
                          <Col lg={6} md={12} className="col-md-6">
                            <label className="labels">Close time*</label>
                            <Row>
                              <Col>
                                <Select
                                  className="react-select text-center"
                                  classNamePrefix="react-select"
                                  placeholder="Hour"
                                  options={hours}
                                  value={this.state.closeTime.hour}
                                  onChange={(value) => {
                                    let tmp = this.state.closeTime;
                                    this.setState({
                                      closeTime: {
                                        hour: value,
                                        minute: tmp.minute,
                                      },
                                    });
                                  }}
                                />
                              </Col>
                              <p className="m-0 pt-2">:</p>
                              <Col>
                                <Select
                                  className="react-select text-center"
                                  classNamePrefix="react-select"
                                  placeholder="Minute"
                                  options={minute}
                                  value={this.state.closeTime.minute}
                                  onChange={(value) => {
                                    let tmp = this.state.closeTime;
                                    this.setState({
                                      closeTime: {
                                        minute: value,
                                        hour: tmp.hour,
                                      },
                                    });
                                  }}
                                />
                              </Col>
                            </Row>
                            {errors.closeTime && (
                              <div
                                className="invalid-feedback"
                                style={{ display: "block" }}
                              >
                                {errors.closeTime}
                              </div>
                            )}
                          </Col>
                        </Row>
                      </FormGroup>
                      {this.state.TimeError === true ? (
                        <span>
                          <p style={{ color: `red` }}>
                            Time close must after 5 hour time open
                          </p>
                        </span>
                      ) : null}
                      <div className="row mt-2">
                        <div className="col-md-6">
                          <label className="labels">Province*</label>
                          <Select
                            className="react-select primary"
                            classNamePrefix="react-select"
                            placeholder="Select province"
                            name="province"
                            value={this.state.province}
                            options={this.state.provinces}
                            onChange={this.onHandleSelect}
                            style={{ color: `black` }}
                          />
                          {errors.province && (
                            <div
                              className="invalid-feedback"
                              style={{ display: "block" }}
                            >
                              {errors.province}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6">
                          <label className="labels">District*</label>
                          <Select
                            className="react-select primary"
                            classNamePrefix="react-select"
                            placeholder="Select district"
                            name="district"
                            value={this.state.district}
                            options={
                              this.state.selectProvince
                                ? this.state.districts
                                : []
                            }
                            onChange={this.onHandleSelectDistrict}
                          />
                          {errors.district && (
                            <div
                              className="invalid-feedback"
                              style={{ display: "block" }}
                            >
                              {errors.district}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="row mt-4 ">
                        <div className="col-md-2 ml-10">
                          <button
                            className="btn btn-info profile-button"
                            type="button"
                            onClick={this.onHandleSubmit}
                          >
                            Add
                          </button>
                        </div>
                        <div className="col-md-2">
                          <button
                            className="btn btn-primary profile-button"
                            type="reset"
                          >
                            Reset
                          </button>
                          {/* chưa reset được */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Row>
          </Form>
        </div>
        <div>
          <NotificationAlert
            ref="notify"
            zIndex={9999}
            onClick={() => console.log("hey")}
          />
        </div>
      </>
    );
  }
}

export default NewBranchPage;
