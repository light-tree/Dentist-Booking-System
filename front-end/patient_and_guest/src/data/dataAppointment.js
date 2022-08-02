let branchId = "";
let servicetype_id = "";
let service_id = "";
let doctor_id = "";
let phone_id = "";
let name = "";
let time = "";

class DataAppointment {
  getbranchId() {
    return branchId;
  }
  getServicetype_id() {
    return servicetype_id;
  }
  getService_id() {
    return service_id;
  }
  getDoctor_id() {
    return doctor_id;
  }
  getPhone_id() {
    return phone_id;
  }
  getName() {
    return name;
  }
  getTime() {
    return time;
  }
  //set
  setbranchId(x) {
    branchId = x;
  }
  setServicetype_id(x) {
    servicetype_id = x;
  }
  setService_id(x) {
    service_id = x;
  }
  setDoctor_id(x) {
    doctor_id = x;
  }
  setPhone_id(x) {
    phone_id = x;
  }
  setName(x) {
    name = x;
  }
  setTime(x) {
    time = x;
  }
}

export default new DataAppointment();
