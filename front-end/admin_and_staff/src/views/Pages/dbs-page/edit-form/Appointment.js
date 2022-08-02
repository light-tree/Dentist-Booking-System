import { Button, Col } from "reactstrap";

function Appointment(appointment) {
  return (
    <>
      <div className="content">
        <Col xs={12} md={10} className="mr-auto ml-auto">
          <Button color="primary" onClick={() => window.location.href = "/admin/booking"}>
            <span className="btn-label">
              <i className="now-ui-icons arrows-1_minimal-left" />
            </span>
            Back
          </Button>
          <div className="container rounded bg-white">
            <div className="p-3 py-5">
              <h4 className="text-center">Appointment Information</h4>

              <div class="row justify-content-center">
                <div class="col-4 mt-4">
                  <b>Customer name: </b>
                  {appointment.account.fullName}
                </div>
                <div class="col-4 mt-4">
                  <b>Customer phone: </b>
                  {appointment.account.phone}
                </div>
              </div>
              <div class="row justify-content-center">
                <div class="col-4 mt-4">
                  <b>Appointment Date: </b>
                  {appointment.appointmentDate}
                </div>
                <div class="col-4 mt-4">
                  <b>Appointment Time: </b>
                  {appointment.appointmentTime}
                </div>
              </div>
              <div class="row justify-content-center">
                <div class="col-4 mt-4">
                  <b>Service (s): </b>Khám răng thông thường
                </div>
                <div class="col-4 mt-4">
                  <b> Status: </b>
                  <div style={{ color: "grey" }}>
                    <i className="fas fa-check-circle"> </i> Done
                  </div>
                </div>
              </div>
              <div className="text-center">                
                <div className="mt-4">
                  <Button color="primary">Done</Button>
                </div>                
                <div class="col-4 mt-4"></div>
              </div>
            </div>
          </div>
        </Col>
      </div>
    </>
  );
}
export default Appointment;
