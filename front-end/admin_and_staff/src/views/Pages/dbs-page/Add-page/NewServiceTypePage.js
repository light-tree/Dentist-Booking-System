import serviceTypeApi from "api/serviceTypeApi";
import AdminNavbar from "components/Navbars/AdminNavbar";
import PanelHeader from "components/PanelHeader/PanelHeader";
import { Component } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { Button, Col, Form, Row } from "reactstrap";
import Validator from "utils/validation/validator";
import NotificationAlert from "react-notification-alert";

var options = {};
options = {
  place: "tr",
  message: (
    <div>
      <div>
        Successfully add new <b>Service type</b>
      </div>
    </div>
  ),
  type: "success",
  icon: "now-ui-icons ui-1_bell-53",
  autoDismiss: 4,
};

class NewServiceTypePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      errors: {},
    };
    const rules = [
      {
        field: "name",
        method: "isLength",
        args: [{ min: 1 }],
        validWhen: true,
        message: "The name field is required.",
      },
      {
        field: "description",
        method: "isLength",
        args: [{ min: 1 }],
        validWhen: true,
        message: "The address field is required",
      },
    ];

    this.onHandleChange = this.onHandleChange.bind(this);
    this.onHandleSubmit = this.onHandleSubmit.bind(this);
    this.validator = new Validator(rules);
    this.notify = this.notify.bind(this);
    this.notifyMessage = this.notifyMessage.bind(this);
  }

  notify() {
    this.refs.notify.notificationAlert(options);
  }
  onHandleChange(event) {
    const target = event.target;
    const name = target.name;
    const value =
      target.type === "select-one" ? JSON.parse(target.value) : target.value;
    console.log(">Type: ", target.value);
    this.setState({
      [name]: value,
    });
  }
  async onHandleSubmit(event) {
    if (this.state.name.length < 8) {
      this.notifyMessage(
        "Length must be graeter than 8 characters.",
        "danger",
        "now-ui-icons travel_info"
      );
      return;
    }
    event.preventDefault();
    this.setState({
      errors: this.validator.validate(this.state, event),
    });
    if (this.validator.isValid) {
      console.log("No error");
    }
    const dataServiceType = {
      name: this.state.name,
      description: this.state.description,
    };

    try {
      await serviceTypeApi
        .insert(dataServiceType)
        .then((res) => {
          console.log("Insert", res);
          console.log("asdoasd");
          sessionStorage.setItem("addServiceType", "fbnjfbfdh");
          window.location.replace("/admin/type-service");
        })
        .catch((error) => {
          console.log("dvnindivn", error);
          if (error.response?.data) {
            this.notifyMessage(
              error.response?.data?.message,
              "danger",
              "now-ui-icons travel_info"
            );
          }
        });
    } catch (error) {
      console.log("Insert service type failed");
    }
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
  render() {
    const { errors } = this.state;
    return (
      <>
        <div className="content">
          <Form>
            <Row>
              <div className="container rounded bg-white mt-20 mb-5 ml-20">
                <div className="row">
                  <div className="col-md-8">
                    <div className="p-3 py-5">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="text-right">Service type Information</h4>
                      </div>
                      <div className="row mt-2">
                        <div className="col-md-12">
                          <label className="labels">Service type Name*</label>
                          <input
                            maxLength={30}
                            type="text"
                            className="form-control"
                            placeholder="Service name"
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
                      <div className="row mt-4">
                        <div className="col-md-12">
                          <label className="labels">Description*</label>
                          <textarea
                            className="form-control"
                            name="description"
                            value={this.state.description}
                            onChange={this.onHandleChange}
                            rows="5"
                          ></textarea>
                          {errors.description && (
                            <div
                              className="invalid-feedback"
                              style={{ display: "block" }}
                            >
                              {errors.description}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="row mt-4 ml-10">
                        <button
                          className="btn btn-info profile-button"
                          type="button"
                          onClick={this.onHandleSubmit}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Row>
          </Form>
        </div>
        <div>
          <NotificationAlert ref="notify" zIndex={9999} />
        </div>
      </>
    );
  }
}

export default NewServiceTypePage;
