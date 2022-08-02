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
import { toast } from "react-toastify";
import doctorApi from "api/doctorApi";
import reactSelect from "react-select";
import Switch from "react-bootstrap-switch";
import * as ReactBoostrap from "react-bootstrap";
var options = {};
options = {
  place: "tr",
  message: (
    <div>
      <div>
        Successfully update <b>Doctor</b>
      </div>
    </div>
  ),
  type: "success",
  icon: "now-ui-icons ui-1_bell-53",
  autoDismiss: 4,
};

class DoctorEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      url: "",
      image: null,
      errors: {},
      imagePreviewUrl: defaultImage,
      selectedFile: null,
      branchList: [],
      description: "",
      branchSelect: "",
      doctorinfo: {},
      status: true,
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
    ];

    this.onHandleChange = this.onHandleChange.bind(this);
    this.onHandleSubmit = this.onHandleSubmit.bind(this);
    this.validator = new Validator(rules);
    this.onFileChange = this.onFileChange.bind(this);
    this.onHandleSelect = this.onHandleSelect.bind(this);
    this.onHandleSelectDistrict = this.onHandleSelectDistrict.bind(this);
    this.notify = this.notify.bind(this);
  }

  notify() {
    this.refs.notify.notificationAlert(options);
  }

  notify(message) {
    var options = {};
    options = {
      place: "tr",
      message: (
        <div>
          <div>{message}</div>
        </div>
      ),
      type: "success",
      icon: "now-ui-icons ui-1_bell-53",
      autoDismiss: 4,
    };

    this.refs.notify.notificationAlert(options);
  }
  async getInfoDoctor() {
    const url = window.location.href;
    const id = url.split("/edit/")[1];
    const result = await doctorApi.getDoctorById(id).then((res) => {
      console.log("doctor ", res);
      this.setState({
        doctorinfo: res,
        name: res.name,
        description: res.description,
        branchSelect: res.branch.id,
        imagePreviewUrl: "https://drive.google.com/uc?id=" + res.url,
        status: res.status === 1,
      });
    });
  }

  componentDidMount() {
    this.getAllBranch();
    this.getInfoDoctor();
  }

  getAllBranch = async () => {
    try {
      const result = await branchApi.getAll();
      console.log("data branch", result);
      if (result) {
        this.setState({
          branchList: result,
        });
      }
    } catch (error) {}
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

  // handle data sent back to server
  _insertNewData = async (formData) => {
    var data;
    console.log("click add");
    data = {
      name: this.state.name,
      // url: res.data,
      branchId: this.state.branchSelect,
      description: this.state.description,
      status: this.state.status ? 1 : 2,
    };
    const url = window.location.href;
    const id = url.split("/edit/")[1];
    console.log(data);
    try {
      this.setState({ isLoading: true });
      await doctorApi.addImageDoctor(formData).then((res) => {
        console.log("result add image:----", res);
        data = {
          id: id,
          name: this.state.name,
          url: res.data,
          branchId: this.state.branchSelect,
          description: this.state.description,
          status: this.state.status ? 1 : 2,
        };
        console.log("Data", data);
        doctorApi.editDoctor(data).then((result) => {
          console.log(result);
          sessionStorage.setItem("updateDoctor", true);
          window.location.replace("/admin/doctor");
        });
      });
    } catch (error) {
      this.setState({ isLoading: false });
    }
  };

  async onHandleSubmit(event) {
    event.preventDefault();
    this.setState({
      errors: this.validator.validate(this.state, event),
    });
    var flag = true;
    if (!this.state.branchSelect) {
      this.setState({
        branchSelectError: true,
      });
      flag = false;
    }
    if (this.state.description.length === 0) {
      this.setState({
        descriptionError: true,
      });
      flag = false;
    }
    if (!flag) {
      return;
    }
    if (this.validator.isValid) {
      // Đưa data xuống ở đây
      const formData = new FormData();
      console.log(this.state.selectedFile);
      formData.append("url", this.state.selectedFile);
      // formData.append("branchDTO", data);
      if (this.state.selectedFile) {
        this._insertNewData(formData);
      } else {
        var data;
        console.log("click update");
        const url = window.location.href;
        const id = url.split("/edit/")[1];
        data = {
          id: id,
          name: this.state.name,
          url: this.state.doctorinfo.url,
          branchId: this.state.branchSelect,
          description: this.state.description,
          status: this.state.status ? 1 : 2,
        };
        console.log("data", data);
        doctorApi.editDoctor(data).then((result) => {
          console.log(result);
          sessionStorage.setItem("updateDoctor", true);
          window.location.replace("/admin/doctor");
        });
      }
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
        {" "}
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
        <div className="container">
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
                        onChange={this.onFileChange}
                        ref={(fileInput) => (this.fileInput = fileInput)}
                      />
                      <div className="thumbnail">
                        <img src={this.state.imagePreviewUrl} alt="..." />
                      </div>
                      <Button
                        className="btn-round"
                        onClick={() => this.fileInput.click()}
                      >
                        Select Image
                      </Button>
                      {this.state.fileError ? (
                        <span>
                          <p style={{ color: `#dc3545`, fontSize: `80%` }}>
                            Please choose a image.
                          </p>
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="p-3 py-5">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="text-right">Doctor Information</h4>
                      </div>
                      <FormGroup>
                        <div className="row mt-2">
                          <div className="col-md-12">
                            <label className="labels">Doctor Name*</label>
                            <input
                              style={{ borderColor: `gray` }}
                              type="text"
                              className="form-control"
                              placeholder="Doctor name"
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
                        <div className="row mt-2">
                          <div className="col-md-12">
                            <label className="labels">Description*</label>
                            <textarea
                              type="text"
                              className="form-control"
                              placeholder="Description"
                              name="description"
                              value={this.state.description}
                              onChange={this.onHandleChange}
                              style={{
                                height: `150px`,
                                border: `1px solid gray`,
                                borderRadius: `30px`,
                              }}
                            />
                          </div>
                        </div>
                      </FormGroup>
                      {this.state.descriptionError ? (
                        <span>
                          <p style={{ color: `#dc3545`, fontSize: `80%` }}>
                            Please enter description.
                          </p>
                        </span>
                      ) : null}
                      <FormGroup>
                        <div className="row mt-2">
                          <div className="col-md-12 d-flex flex-column">
                            <label className="labels">Choose branch*</label>
                            <select
                              style={{ borderRadius: `20px`, padding: `10px` }}
                              onChange={(e) => {
                                this.setState({
                                  branchSelect: e.currentTarget.value,
                                });
                              }}
                            >
                              {this.state.branchList.map((item, key) => {
                                if (item.id === this.state.branchSelect) {
                                  return (
                                    <option value={item.id} selected={true}>
                                      {item.name}
                                    </option>
                                  );
                                }
                                return (
                                  <option value={item.id}>{item.name}</option>
                                );
                              })}
                            </select>
                          </div>
                        </div>
                      </FormGroup>
                      {this.state.branchSelectError ? (
                        <span>
                          <p style={{ color: `#dc3545`, fontSize: `80%` }}>
                            Please choose a branch.
                          </p>
                        </span>
                      ) : null}
                      <FormGroup>
                        <div className="row mt-2">
                          <div className="col-md-12">
                            <label className="labels mr-5">Status*</label>
                            <Switch
                              onText={
                                <i
                                  className="now-ui-icons ui-1_check"
                                  style={{
                                    color: `#1be611 `,
                                    // backgroundColor: `green`,
                                  }}
                                />
                              }
                              offText={
                                <i
                                  className="now-ui-icons ui-1_simple-remove"
                                  style={{
                                    color: `red`,
                                    // backgroundColor: `green`,
                                  }}
                                />
                              }
                              onChange={(e) => {
                                this.setState({
                                  status: e.state.value,
                                });
                                console.log(e.state.value);
                              }}
                              value={this.state.status}
                            />
                          </div>
                        </div>
                      </FormGroup>
                      <div className="row mt-4 ">
                        <div className="col-md-2 ml-10">
                          <button
                            className="btn btn-info profile-button"
                            type="button"
                            onClick={this.onHandleSubmit}
                          >
                            Save
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

export default DoctorEdit;
