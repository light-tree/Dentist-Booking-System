import serviceApi from "api/serviceApi";
import ImageUpload from "components/CustomUpload/ImageUpload";
import PanelHeader from "components/PanelHeader/PanelHeader";
import React, {  useEffect,  useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Button, FormGroup, Label, Input } from "reactstrap";
import Select from "react-select";
import Switch from "react-bootstrap-switch";
import serviceTypeApi from "api/serviceTypeApi";
import MultiRangeSlider from "multi-range-slider-react";
import "assets/css/slider.css";

import { Card, CardHeader, CardBody, Row, Col } from "reactstrap";
import AdminNavbar from "components/Navbars/AdminNavbar";

const ServiceDetail = () => {
  const [minLengthState, setminLengthState] = React.useState("");
  const [maxLengthState, setmaxLengthState] = React.useState("");
  const [minLength, setminLength] = React.useState("");
  const [singleSelect, setSingleSelect] = useState({
    label: "example",
    value: "example",
  });
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState({});
  const [serviceTypeList, setServiceTypeList] = useState([
    { label: "Loading...", value: "" },
  ]);
  const { id } = useParams();
  const currency = 1000;
  const defaultMinValue = 10000;
  const defaultMaxValue = 500000;
  //chuyển sang Integer
  const [minValue, set_minValue] = useState(20000);
  const [maxValue, set_maxValue] = useState(50000);

  const fetchServiceDetail = async () => {
    try {
      await serviceApi.getService(id).then((result) => {
        console.log(result);
        setService(result);
        setLoading(false);
        set_minValue(result.min_price * currency);
        set_maxValue(result.max_price * currency);
        const serviceTypeName = result.serviceType.name;
        setSingleSelect({ label: serviceTypeName, value: serviceTypeName });
      });
    } catch (error) {
      setLoading(true);
      console.log("Fetch service detail failed", error);
    }
  };
  const getServiceTypeList = async () => {
    try {
      const response = await serviceTypeApi.getAll();
      console.log(response);
      setServiceTypeList(
        response.map((serviceType) => ({
          label: serviceType.name,
          value: serviceType.name,
        }))
      );
    } catch (error) {
      console.log("Fetch service type list failed", error);
    }
  };
  useEffect(() => {
    fetchServiceDetail().then(() => getServiceTypeList());
    console.log(">>>>>", singleSelect);
  }, []);

  const handleInput = (e) => {
    set_minValue(e.minValue);
    set_maxValue(e.maxValue);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  // function that verifies if a string has a given length or not
  const verifyLength = (value, length) => {
    if (value.length >= length) {
      return true;
    }
    return false;
  };

  const [values, setValues] = useState({
    id: 0,
    name: "service name",
    max_price: 0,
    min_price: 0,
    serviceType: {},
    status: 1,
  });

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  return (
    <>
      <AdminNavbar brandText="Service Detail" link="/admin/services" />
      <PanelHeader size="sm">
        <Col xs={0.5} md={0.5}>
          <Link to="/admin/services">
            <Button className="btn-icon" color="primary" size="sm">
              <i className="fas fa-angle-double-left"></i>
            </Button>
          </Link>
        </Col>
      </PanelHeader>
      <div className="content">
        <Row>
          <Col md="4">
            <Card className="card-user">
              <center>
                <CardHeader>
                  <h5 className="title">Image</h5>
                </CardHeader>
                <CardBody>
                  <ImageUpload />
                </CardBody>
              </center>
            </Card>
          </Col>
          <Col md="8">
            <Card>
              <CardHeader>
                <h5 className="title">Service</h5>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col className="pr-1" md="5">
                    <FormGroup>
                      <label>Service name</label>
                      <Input
                        defaultValue={service.name}
                        placeholder="Service name"
                        type="text"
                        onChange={(e) => {
                          if (!verifyLength(e.target.value, 1)) {
                            setminLengthState("has-danger");
                          } else {
                            setminLengthState("has-success");
                            setValues({ ...values, [e.target.name]: e.target.value });
                          }
                          // setminLength(e.target.value);
                        }}
                      />
                       {minLengthState === "has-danger" ? (
                          <label className="error">
                            Please enter service name.
                          </label>
                        ) : null}
                    </FormGroup>
                  </Col>
                  <Col xs={12} md={6}>
                    <label>Service type</label>
                    <Select
                      className="react-select primary"
                      classNamePrefix="react-select"
                      placeholder="Select Service"
                      name="singleSelect"
                      value={singleSelect}
                      options={serviceTypeList}
                      onChange={(value) => {
                        setSingleSelect(value);
                        console.log(value);
                      }}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col md="12">
                    <FormGroup>
                      <label>Price</label>
                      <div className="App">
                        <MultiRangeSlider
                          min={defaultMinValue}
                          max={defaultMaxValue}
                          step={10000}
                          ruler={false}
                          label={true}
                          preventWheel={false}
                          minValue={minValue}
                          maxValue={maxValue}
                          onInput={(e) => {
                            handleInput(e);
                          }}
                          baseClassName="price-slider"
                        />
                      </div>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col className="pr-1" md="3">
                    <FormGroup>
                      <label>Min price</label>
                      <Input
                        defaultValue={defaultMinValue}
                        value={minValue}
                        placeholder="Service name"
                        type="text"
                      />
                    </FormGroup>
                  </Col>
                  <Col className="pr-1" md="3">
                    <FormGroup>
                      <label>Max price</label>
                      <Input
                        defaultValue={defaultMaxValue}
                        value={maxValue}
                        placeholder="Service name"
                        type="text"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="12">
                    <FormGroup>
                      <label>Description</label>
                      <Input
                        cols="80"
                        defaultValue={service.description}
                        placeholder="Here can be your description"
                        rows="4"
                        type="textarea"
                        onChange={(e) => {
                          if (!verifyLength(e.target.value, 1)) {
                            setminLengthState("has-danger");
                          } else {
                            setminLengthState("has-success");
                          }
                          setminLength(e.target.value);
                        }}
                      />
                       {minLengthState === "has-danger" ? (
                          <label className="error">
                            Please enter description.
                          </label>
                        ) : null}
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={4}>
                    <label>Status</label>
                    <FormGroup>
                      <Switch
                        onText={<i className="now-ui-icons ui-1_check" />}
                        offText={
                          <i className="now-ui-icons ui-1_simple-remove" />
                        }
                        defaultValue={service.status}
                        onChange={onChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <center>
                      <Button color="primary" className="btn-round">
                        Edit
                      </Button>
                    </center>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
        {/* </form> */}
      </div>
      ;
    </>
  );

  //   <Form
  //   onSubmit={() => {}}
  //   validate={validate}
  //   render={( {handleSubmit, values, submitting, validating, valid}) => {

  //   }}
  // />;
};
export default ServiceDetail;
