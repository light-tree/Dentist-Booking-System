import AdminNavbar from "components/Navbars/AdminNavbar";
import PanelHeader from "components/PanelHeader/PanelHeader";
import { Component } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { Button, Col, Form, Row } from "reactstrap";
import Select from "react-select";
import serviceTypeApi from "api/serviceTypeApi";
import serviceApi from "api/serviceApi";
import Validator from "utils/validation/validator";
import defaultImage from "assets/img/image_placeholder.jpg";
import * as ReactBoostrap from "react-bootstrap";
import NotificationAlert from "react-notification-alert";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
const time = [
  { value: "0.5", label: "0.5" },
  { value: "1", label: "1" },
  { value: "1.5", label: "1.5" },
  { value: "2", label: "2" },
  { value: "2.5", label: "2.5" },
  { value: "3", label: "3" },
];

class NewServicePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      service_type_id: -1,
      name: "",
      description: "",
      min_price: { label: "Choose min price", value: -1 },
      max_price: { label: "Choose max price", value: -1 },
      url: "",
      status: 1,
      selectMinPrice: false,
      service_type: { label: "Choose a service type", value: -1 },
      service_type_list: [],
      listMinPrice: [{ label: "Choose min price" }],
      listMaxPrice: [{ label: "Choose max price" }],
      image: null,
      imagePreviewUrl: defaultImage,
      errors: {},
      timeEstimated: { value: "0.5", label: "0.5" },
      FileError: false,
      isLoading: false,
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
        field: "service_type",
        method: this.validDropdownServiceType,
        validWhen: true,
        fieldValue: this.state.service_type,
        message: "Please choose a service type",
      },
      {
        field: "min_price",
        method: this.validDropdownMinPrice,
        validWhen: true,
        fieldValue: this.state.min_price,
        message: "Please choose min price",
      },
      {
        field: "max_price",
        method: this.validDropdownMaxPrice,
        validWhen: true,
        fieldValue: this.state.listMaxPrice,
        message: "Please choose a max privce",
      },
      {
        field: "description",
        method: "isLength",
        args: [{ min: 1 }],
        validWhen: true,
        message: "The description field is required.",
      },
    ];

    this.onHandleChange = this.onHandleChange.bind(this);
    this.onHandleSubmit = this.onHandleSubmit.bind(this);
    this.onHandleMinPriceSelect = this.onHandleMinPriceSelect.bind(this);
    this.onHandleMaxPriceSelect = this.onHandleMaxPriceSelect.bind(this);
    this.onHandleServiceTypeSelect = this.onHandleServiceTypeSelect.bind(this);
    this.selectedImageHandler = this.selectedImageHandler.bind(this);
    this.validator = new Validator(rules);
    this.handleCKeditorChange = this.handleCKeditorChange.bind(this);
  }

  //Validation
  validDropdownServiceType(service_type) {
    if (service_type.value === -1) {
      return false;
    }
    return true;
  }
  validDropdownMinPrice(min_price) {
    if (min_price.value === -1) {
      return false;
    }
    return true;
  }
  validDropdownMaxPrice(max_price) {
    if (max_price.value === -1) {
      return false;
    }
    return true;
  }

  //load price list
  rangeMinPrice = () => {
    var first = 100000;
    for (var i = 0; i < 20; i++) {
      this.state.listMinPrice.push({
        label: Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(first),
        value: first,
      });
      first += 50000;
    }
  };
  rangeMaxPrice = (minPrice) => {
    var first = minPrice + 50000;
    var temptList = [{ label: "Choose max price", value: -1 }];
    for (var i = 0; i < 20; i++) {
      temptList.push({
        label: Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(first),
        value: first,
      });
      first += 50000;
    }
    console.log("...", temptList);
    this.setState({
      listMaxPrice: temptList,
    });
  };

  componentDidMount() {
    this.getServiceTypeList();
    this.rangeMinPrice();
  }
  getServiceTypeList = async () => {
    try {
      await serviceTypeApi.getAll().then((res) => {
        this.setState({
          service_type_list: res.map((service_type) => ({
            label: service_type.name,
            value: service_type.id,
          })),
        });
      });
    } catch (err) {
      console.log("Cant get service type list", err);
    }
  };

  //handle selected image
  selectedImageHandler(event) {
    let reader = new FileReader();
    let file = event.target.files[0];
    console.log(file);
    reader.onloadend = () => {
      this.setState({
        imagePreviewUrl: reader.result,
        image: file,
      });
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  }

  //handle select
  onHandleServiceTypeSelect(event) {
    console.log(event);
    this.setState({
      service_type: event,
    });
  }
  onHandleMinPriceSelect(event) {
    this.setState({
      min_price: event,
      selectMinPrice: true,
      max_price: { label: "Choose max price", value: -1 },
    });
    this.rangeMaxPrice(event.value);
  }
  onHandleMaxPriceSelect(event) {
    this.setState({
      max_price: event,
    });
  }
  onHandleChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    this.setState({
      [name]: value,
    });
  }

  _inserNewService = async (Formdata) => {
    try {
      this.setState({ isLoading: true });
      await serviceApi.addImageService(Formdata).then(async (res) => {
        console.log("HERE");
        console.log(res);
        var data;
        data = {
          name: this.state.name,
          serviceTypeId: this.state.service_type.value,
          url: res.data,
          description: this.state.description,
          minPrice: this.state.min_price.value,
          maxPrice: this.state.max_price.value,
          estimatedTime: this.state.timeEstimated.value,
          status: 1,
        };
        console.log("data", data);
        await serviceApi.insertService(data).then((res) => {
          console.log(res);
          sessionStorage.setItem("addNewService", "true");
          window.location.replace("/admin/service ");
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

  handleCKeditorChange(event, editor) {
    const data = editor.getData();
    // console.log(data);
    this.setState({
      description: data,
    });
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

  onHandleSubmit(event) {
    event.preventDefault();
    this.setState({
      errors: this.validator.validate(this.state, event),
    });
    if (!this.state.image) {
      this.setState({ FileError: true });
      return;
    } else {
      this.setState({ FileError: false });
    }
    if (this.validator.isValid) {
      const serviceDTO = {
        name: this.state.name,
        serviceTypeId: this.state.service_type.value,
        url: "",
        description: this.state.description,
        minPrice: this.state.min_price.value,
        maxPrice: this.state.max_price.value,
        estimatedTime: this.state.timeEstimated.value,
        status: 1,
      };

      const formData = new FormData();

      formData.append("url", this.state.image);

      console.log("data: ", FormData);
      this._inserNewService(formData);
    }
  }
  render() {
    const { errors } = this.state;
    return (
      <>
        <NotificationAlert
          ref="notify"
          zIndex={9999}
          onClick={() => console.log("hey")}
        />
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
              <div className="container rounded bg-white mt-20 mb-5 ml-20">
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
                        onChange={this.selectedImageHandler}
                        ref={(fileInput) => (this.fileInput = fileInput)}
                      />
                      <div className="thumbnail">
                        <img src={this.state.imagePreviewUrl} alt="..." />
                      </div>
                      {this.state.FileError ? (
                        <span>
                          <p style={{ color: `#dc3545`, fontSize: `80%` }}>
                            Please choose a image
                          </p>
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
                        <h4 className="text-right">Service Information</h4>
                      </div>
                      <div className="row mt-2">
                        <div className="col-md-12">
                          <label className="labels">Service Name*</label>
                          <input
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
                      <div className="row mt-2">
                        <div className="col-md-12">
                          <div className="row mt-2">
                            <div className="col-md-6">
                              <label className="labels">Service Type*</label>
                              <Select
                                className="react-select"
                                classNamePrefix="react-select"
                                placeholder="Select province"
                                name="province"
                                value={this.state.service_type}
                                options={this.state.service_type_list}
                                onChange={this.onHandleServiceTypeSelect}
                              />
                              {errors.service_type && (
                                <div
                                  className="invalid-feedback"
                                  style={{ display: "block" }}
                                >
                                  {errors.service_type}
                                </div>
                              )}
                            </div>
                            <div className="col-md-6">
                              <label className="labels">
                                Estimated time (hour)*
                              </label>
                              <Select
                                className="react-select"
                                classNamePrefix="react-select"
                                placeholder="Select estimated time"
                                name="timeEstimated"
                                value={this.state.timeEstimated}
                                options={time}
                                onChange={(e) =>
                                  this.setState({
                                    timeEstimated: e,
                                  })
                                }
                              />
                              {/* {errors.min_price && (
                                <div
                                  className="invalid-feedback"
                                  style={{ display: "block" }}
                                >
                                  {errors.min_price}
                                </div>
                              )} */}
                            </div>
                          </div>
                          <div className="row mt-2">
                            <div className="col-md-6">
                              <label className="labels">Min price*</label>
                              <Select
                                className="react-select"
                                classNamePrefix="react-select"
                                placeholder="Select min price"
                                name="province"
                                value={this.state.min_price}
                                options={this.state.listMinPrice}
                                onChange={this.onHandleMinPriceSelect}
                              />
                              {errors.min_price && (
                                <div
                                  className="invalid-feedback"
                                  style={{ display: "block" }}
                                >
                                  {errors.min_price}
                                </div>
                              )}
                            </div>
                            <div className="col-md-6">
                              <label className="labels">Max price*</label>
                              <Select
                                className="react-select"
                                classNamePrefix="react-select"
                                placeholder="Select max price"
                                name="province"
                                value={this.state.max_price}
                                options={
                                  this.state.selectMinPrice
                                    ? this.state.listMaxPrice
                                    : []
                                }
                                onChange={this.onHandleMaxPriceSelect}
                              />
                              {errors.max_price && (
                                <div
                                  className="invalid-feedback"
                                  style={{ display: "block" }}
                                >
                                  {errors.max_price}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row mt-4">
                        <div className="col-md-12">
                          <label className="labels">Description*</label>
                          {/* <textarea
                            className="form-control"
                            name="description"
                            value={this.state.description}
                            onChange={this.onHandleChange}
                            rows="100"
                          ></textarea> */}
                          <CKEditor
                            editor={ClassicEditor}
                            onChange={this.handleCKeditorChange}
                          />
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
      </>
    );
  }
}

export default NewServicePage;
