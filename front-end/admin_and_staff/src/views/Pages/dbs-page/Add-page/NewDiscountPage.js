import discountApi from "api/discountApi";
import serviceApi from "api/serviceApi";
import AdminNavbar from "components/Navbars/AdminNavbar";
import PanelHeader from "components/PanelHeader/PanelHeader";
import moment from "moment";
import { Component } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import Select from "react-select";
import { Button, Col, Form, Row } from "reactstrap";
import Validator from "utils/validation/validator";
import NotificationAlert from "react-notification-alert";

var options = {};
options = {
  place: "tr",
  message: (
    <div>
      <div>
        Successfully add new <b>Discount</b>
      </div>
    </div>
  ),
  type: "success",
  icon: "now-ui-icons ui-1_bell-53",
  autoDismiss: 4,
};

class NewDiscountPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "Áp dụng toàn quốc",
      url: "",
      address: "",
      startDate: "",
      endDate: "",
      percentage: 10.0,
      currentService: [],
      serviceList: [],
      errors: [],

      nameError: false,
      currentServiceError: false,
      timeError: false,
      descriptionError: false,
      today: "",
      minEndDate: "",
    };

    const rules = [];

    this.onHandleChange = this.onHandleChange.bind(this);
    this.onHandleSubmit = this.onHandleSubmit.bind(this);
    this.onHandleServiceSelect = this.onHandleServiceSelect.bind(this);
    this.CustomDate = this.CustomDate.bind(this);
    this.validator = new Validator(rules);
    this.notify = this.notify.bind(this);
  }

  getCurrentDate(separator = "") {
    let newDate = new Date();
    // newDate.setDate(newDate.getDate());
    let date = newDate.getDate() + 1;
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    console.log(
      `${year}${separator}-${month < 10 ? `0${month}` : `${month}`}-${
        date < 10 ? `0${date}` : `${date}`
      }`
    );
    this.setState({
      today: `${year}-${month < 10 ? `0${month}` : `${month}`}-${
        date < 10 ? `0${date}` : `${date}`
      }`,
    });
    return `${year}-
    ${month < 10 ? `0${month}` : `${month}`}-${
      date < 10 ? `0${date}` : `${date}`
    }`;
  }

  getMinEndDate(separator = "") {
    var tmp = new Date(this.state.startDate);
    let date = tmp.getDate();
    let month = tmp.getMonth() + 1;
    let year = tmp.getFullYear();
    console.log(
      `${year}${separator}-${month < 10 ? `0${month}` : `${month}`}-${
        date < 10 ? `0${date}` : `${date}`
      }`
    );
    this.setState({
      minEndDate: `${year}-${month < 10 ? `0${month}` : `${month}`}-${
        date < 10 ? `0${date}` : `${date}`
      }`,
    });
  }

  componentDidMount() {
    this.getServiceList();
    this.getCurrentDate();
  }

  CustomDate = () => {
    var today, dd, mm, yyyy;
    today = new Date();
    dd = today.getDate() + 1;
    mm = today.getMonth() + 1;
    yyyy = today.getFullYear();
    return yyyy + "-" + mm + "-" + dd;
  };
  notify() {
    this.refs.notify.notificationAlert(options);
  }

  getServiceList = async () => {
    try {
      await serviceApi.getServiceList().then((res) => {
        if (res == null) return;
        this.setState({
          serviceList: res.map((service) => ({
            label: service.name,
            value: service.id,
          })),
        });
      });
    } catch (error) {
      console.log("Fetch service list failed", error);
    }
  };

  _inserDiscount = async (data) => {
    var result = false;
    try {
      await discountApi.insert(data).then((res) => {
        console.log("res discount: ", res);
        result = true;
        sessionStorage.setItem("addDiscount", true);
        window.location.replace("/admin/discount");
      });
    } catch (error) {
      console.log("can not add errr", error);
    } finally {
      return result;
    }
  };

  onHandleServiceSelect(event) {
    this.setState({
      currentService: event,
    });
    console.log("SS: ", this.state.currentService);
  }

  onHandleChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    console.log(">Type: ", target.value);
    this.setState({
      [name]: value,
    });

    if (name === "startDate") {
      console.log("ckdabvd");
      this.getMinEndDate();
    }
  }
  async onHandleSubmit(event) {
    if (!this.ValidateAll()) {
      return;
    }
    event.preventDefault();
    if (true) {
      const data = {
        discountDTO: {
          name: this.state.name,
          percentage: this.state.percentage,
          description: this.state.description,
          status: 1,
          startDate: this.state.startDate,
          endDate: this.state.endDate,
        },
        serviceIDList: this.state.currentService.map(
          (service) => service.value
        ),
      };
      console.log("data: ", data);
      try {
        const result = await this._inserDiscount(data);
        // if (result) {
        //   this.notify();
        // }
      } catch (error) {
        console.log(error);
      }
    }
    console.log(this.state.currentService);
  }

  ValidateAll() {
    let flag = true;
    if (this.state.name.length < 8 || this.state.name > 30) {
      this.setState({
        nameError: true,
      });
      flag = false;
    } else {
      this.setState({
        nameError: false,
      });
    }

    if (this.state.currentService.length === 0) {
      this.setState({
        currentServiceError: true,
      });
      flag = false;
    } else {
      this.setState({ currentServiceError: false });
    }

    if (!this.state.endDate) {
      this.setState({
        timeError: true,
      });
      flag = false;
    } else {
      this.setState({
        timeError: false,
      });
    }
    var startDate = new Date(this.state.startDate);
    var endDate = new Date(this.state.endDate);
    if (!this.state.startDate) {
      this.setState({
        timeError: true,
      });
      flag = false;
    } else if (startDate.getTime() >= endDate.getTime()) {
      this.setState({
        timeError: true,
      });
      flag = false;
    } else {
      this.setState({
        timeError: false,
      });
    }

    if (this.state.description.length === 0) {
      this.setState({
        descriptionError: true,
      });
      flag = false;
    } else {
      this.setState({
        descriptionError: false,
      });
    }
    return flag;
  }

  render() {
    const yesterday = moment().subtract(1, "day");
    const today = new Date().getDate();
    const constraintDay = moment().add(30, "day");
    const disablePastDt = (current) => {
      return current.isAfter(yesterday);
    };
    const dayMin = new Date().toISOString();
    return (
      <>
        {/* <AdminNavbar brandText="Service Detail" link="/admin/services" /> */}

        <div className="container">
          <Form>
            <Row>
              <div className="container rounded bg-white mt-20 mb-5 ml-20">
                <div className="row">
                  <div className="col-md-8">
                    <div className="p-3 py-5">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="text-right">Discount Information</h4>
                      </div>
                      <div className="row mt-2">
                        <div className="col-md-12">
                          <label className="labels">Discount Name*</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="name"
                            name="name"
                            maxLength={30}
                            value={this.state.name}
                            onChange={this.onHandleChange}
                          />
                        </div>
                      </div>
                      {this.state.nameError ? (
                        <>
                          <span>
                            <p style={{ color: `red` }}>
                              Name must be between 8 - 30 characters
                            </p>
                          </span>
                        </>
                      ) : null}
                      <div className="row mt-2">
                        <div className="col-md-12">
                          <label className="labels">
                            Discount Percentage: {this.state.percentage}(%)
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            className="slider slider-primary"
                            placeholder="Branch name"
                            name="percentage"
                            value={this.state.percentage}
                            onChange={this.onHandleChange}
                            style={{ width: `100% ` }}
                          />
                        </div>
                      </div>

                      <div className="row mt-2">
                        <div className="col-md-12">
                          <label className="labels">Service*</label>
                          <Select
                            className="react-select primary"
                            classNamePrefix="react-select"
                            placeholder="Select servvice"
                            name="province"
                            isMulti
                            value={this.state.currentService}
                            options={this.state.serviceList}
                            onChange={this.onHandleServiceSelect}
                          />
                        </div>
                      </div>
                      {this.state.currentServiceError ? (
                        <span>
                          <p style={{ color: `red` }}>
                            Please choose some service.
                          </p>
                        </span>
                      ) : null}
                      <div className="row mt-2">
                        <div className="col-md-6">
                          <label className="labels">Start date*</label>
                          <input
                            type="date"
                            className="form-control"
                            placeholder="Address"
                            name="startDate"
                            value={this.state.startDate}
                            onChange={this.onHandleChange}
                            min={this.state.today}

                            // min="2022-07-16"
                            // is
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="labels">End date*</label>
                          <input
                            type="Date"
                            className="form-control"
                            placeholder="Address"
                            name="endDate"
                            min={this.state.startDate}
                            value={this.state.endDate}
                            // min={new Date().getDate()}
                            // min={new Date().toISOString().slice(0, -8)}
                            // min={this.state.startDate}
                            onChange={this.onHandleChange}
                          />
                        </div>
                      </div>
                      {this.state.timeError ? (
                        <span>
                          <p style={{ color: `red` }}>
                            Please choose start date must before end date.
                          </p>
                        </span>
                      ) : null}
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
                        </div>
                      </div>
                      {this.state.descriptionError ? (
                        <span>
                          <p style={{ color: `red` }}>
                            Please input description about this discount.
                          </p>
                        </span>
                      ) : null}
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

export default NewDiscountPage;
