import Dashboard from "views/Dashboard/Dashboard.js";
import Buttons from "views/Components/Buttons.js";
import GridSystem from "views/Components/GridSystem.js";
import Panels from "views/Components/Panels.js";
import SweetAlert from "views/Components/SweetAlertPage.js";
import Notifications from "views/Components/Notifications.js";
import Icons from "views/Components/Icons.js";
import Typography from "views/Components/Typography.js";
import RegularForms from "views/Forms/RegularForms.js";
import ExtendedForms from "views/Forms/ExtendedForms.js";
import ValidationForms from "views/Forms/ValidationForms.js";
// import Wizard from "views/Forms/Wizard/Wizard.js";
import RegularTables from "views/Tables/archive/RegularTables.js";
import ExtendedTables from "views/Tables/archive/ExtendedTables.js";
import ReactTable from "views/Tables/archive/ReactTable.js";
import GoogleMaps from "views/Maps/GoogleMaps.js";
import FullScreenMap from "views/Maps/FullScreenMap.js";
import VectorMap from "views/Maps/VectorMap.js";
import Charts from "views/Charts/Charts.js";
import Calendar from "views/Calendar/Calendar.js";
import Widgets from "views/Widgets/Widgets.js";
import UserPage from "views/Pages/dbs-page/UserPage.js";
import TimelinePage from "views/Pages/TimelinePage.js";
import RTL from "views/Pages/RTL.js";
import PricingPage from "views/Pages/PricingPage.js";
import LoginPage from "views/Pages/dbs-page/LoginPage.js";
import RegisterPage from "views/Pages/RegisterPage.js";
import LockScreenPage from "views/Pages/LockScreenPage.js";

import BranchTable from "views/Tables/BranchTable.js";
import ServiceTypeTable from "views/Tables/ServiceTypeTable.js";
import ServiceTable from "views/Tables/ServiceTable.js";
import DiscountTable from "views/Tables/DiscountTable.js";
import AccountTable from "views/Tables/AccountTable.js";
import DoctorTable from "views/Tables/DoctorTable.js";
import BookingTable from "views/Tables/BookingTable.js";
import FeedbackTable from "views/Tables/FeedbackTable.js";
import Discount from "views/Pages/dbs-page/edit-form/Discount";
import StaffHome from "views/Pages/staff-page/StaffHome";
import StaffCancelAppointment from "views/Pages/staff-page/StaffCancelAppointment";
import BranchEdit from "views/Pages/dbs-page/edit-form/BranchEdit";
import DoctorEdit from "views/Pages/dbs-page/edit-form/DoctorEdit";
import ServiceTypeEdit from "views/Pages/dbs-page/edit-form/ServiceTypeEdit";
import AccountEdit from "views/Pages/dbs-page/edit-form/AccountEdit";
import FeedbackTableAdmin from "views/Tables/FeedbackTableAdmin";
import UpdateProfile from "views/Pages/dbs-page/UpdateProfile";
import NewBranchPage from "views/Pages/dbs-page/Add-page/NewBranchPage";
import HistoryAppointmentTableStaff from "views/Tables/HistoryAppointmentTableStaff";
import HistoryAppointmentStaff from "views/Pages/staff-page/HistoryAppointmentStaff";
import NewServiceTypePage from "views/Pages/dbs-page/Add-page/NewServiceTypePage";
import NewServicePage from "views/Pages/dbs-page/Add-page/NewServicePage";
import NewDiscountPage from "views/Pages/dbs-page/Add-page/NewDiscountPage";
import NewDoctorPage from "views/Pages/dbs-page/Add-page/NewDoctorPage";
import NewAccountStaffPage from "views/Pages/dbs-page/Add-page/NewAccountStaffPage";

let routes = [
  //Admin
  // {
  //   path: "/dashboard",
  //   name: "Dashboard",
  //   icon: "now-ui-icons design_app",
  //   component: Dashboard,
  //   layout: "/admin",
  // },

  //Add
  {
    path: "/branch/add",
    name: "Branch",
    icon: "now-ui-icons location_pin",
    component: NewBranchPage,
    layout: "/admin",
    invisible: true,
  },

  {
    path: "/type-service/add",
    name: "Service type",
    icon: "now-ui-icons files_box",
    component: NewServiceTypePage,
    layout: "/admin",
    invisible: true,
  },
  {
    path: "/service/add",
    name: "Service",
    icon: "now-ui-icons files_box",
    component: NewServicePage,
    layout: "/admin",
    invisible: true,
  },
  {
    path: "/discount/add",
    name: "Discount",
    icon: "now-ui-icons files_box",
    component: NewDiscountPage,
    layout: "/admin",
    invisible: true,
  },
  {
    path: "/doctor/add",
    name: "Doctor",
    icon: "now-ui-icons files_box",
    component: NewDoctorPage,
    layout: "/admin",
    invisible: true,
  },
  {
    path: "/account/add",
    name: "Account",
    icon: "now-ui-icons files_box",
    component: NewAccountStaffPage,
    layout: "/admin",
    invisible: true,
  },

  //Update
  {
    path: "/branch/edit/:id",
    name: "Update Branch",
    component: BranchEdit,
    layout: "/admin",
    invisible: true,
  },

  {
    path: "/type-service/edit/:id",
    name: "Service Type",
    component: ServiceTypeEdit,
    layout: "/admin",
    invisible: true,
  },
  {
    path: "/discount/edit/:id",
    name: "Edit Discount",
    mini: "W",
    component: Discount,
    layout: "/admin",
    invisible: true,
  },
  {
    path: "/doctor/edit/:id",
    name: "Edit Doctor",
    mini: "W",
    component: DoctorEdit,
    layout: "/admin",
    invisible: true,
  },
  {
    path: "/account/edit/:id",
    name: "Edit Doctor",
    mini: "W",
    component: AccountEdit,
    layout: "/admin",
    invisible: true,
  },
  //list

  {
    path: "/booking",
    name: "Booking",
    icon: "now-ui-icons education_paper",
    component: BookingTable,
    layout: "/admin",
  },
  {
    path: "/feedback",
    name: "Feedback",
    icon: "now-ui-icons education_glasses",
    component: FeedbackTable,
    layout: "/staff",
  },
  {
    path: "/branch",
    name: "Branch",
    icon: "now-ui-icons location_pin",
    component: BranchTable,
    layout: "/admin",
  },

  {
    path: "/type-service",
    name: "Service type",
    icon: "now-ui-icons files_box",
    component: ServiceTypeTable,
    layout: "/admin",
  },
  {
    path: "/service",
    name: "Service",
    icon: "now-ui-icons files_paper",
    component: ServiceTable,
    layout: "/admin",
  },
  {
    path: "/discount",
    name: "Discount",
    icon: "now-ui-icons shopping_tag-content",
    component: DiscountTable,
    layout: "/admin",
  },
  {
    path: "/account",
    name: "Account",
    icon: "now-ui-icons users_single-02",
    component: AccountTable,
    layout: "/admin",
  },
  {
    path: "/doctor",
    name: "Doctor",
    icon: "now-ui-icons business_badge",
    component: DoctorTable,
    layout: "/admin",
  },

  {
    path: "/feedback",
    name: "Feedback",
    icon: "now-ui-icons education_glasses",
    component: FeedbackTableAdmin,
    layout: "/admin",
  },
  {
    path: "/login-page",
    name: "Login Page",
    short: "Login",
    mini: "LP",
    component: LoginPage,
    layout: "/auth",
    invisible: true,
  },

  {
    path: "/account/profile",
    name: "User page",
    mini: "S",
    component: UserPage,
    layout: "/admin",
    invisible: true,
  },
  {
    path: "/account/edit",
    name: "User page",
    mini: "S",
    component: UpdateProfile,
    layout: "/admin",
    invisible: true,
  },

  // Staff
  {
    path: "/home",
    name: "Home",
    icon: "now-ui-icons ui-1_calendar-60",
    component: StaffHome,
    layout: "/staff",
  },
  {
    path: "/appointment/cancel",
    name: "Cancel",
    icon: "now-ui-icons ui-1_simple-remove",
    component: StaffCancelAppointment,
    layout: "/staff",
  },
  {
    path: "/appointment/history",
    name: "History",
    icon: "now-ui-icons files_single-copy-04",
    component: HistoryAppointmentStaff,
    layout: "/staff",
  },

  {
    path: "/account/profile",
    name: "User page",
    mini: "S",
    component: UserPage,
    layout: "/staff",
    invisible: true,
  },
  {
    path: "/account/edit",
    name: "User page",
    mini: "S",
    component: UpdateProfile,
    layout: "/staff",
    invisible: true,
  },
];

export default routes;
