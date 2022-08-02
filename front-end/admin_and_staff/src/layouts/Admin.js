/*!

=========================================================
* Now UI Dashboard PRO React - v1.5.0
=========================================================

* Product Page: https://www.creative-tim.com/product/now-ui-dashboard-pro-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useEffect, useState } from "react";
import {
  Route,
  Switch,
  Redirect,
  useLocation,
  Navigate,
} from "react-router-dom";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
// react plugin for creating notifications
import NotificationAlert from "react-notification-alert";

// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import routes from "routes.js";
import { ToastContainer, toast } from "react-toastify";
import LoginPage from "views/Pages/LoginPage";
import NewBranchPage from "views/Pages/dbs-page/Add-page/NewBranchPage";
import NewServicePage from "views/Pages/dbs-page/Add-page/NewServicePage";
import NewServiceTypePage from "views/Pages/dbs-page/Add-page/NewServiceTypePage";
import NewDiscountPage from "views/Pages/dbs-page/Add-page/NewDiscountPage";
import NewDoctorPage from "views/Pages/dbs-page/Add-page/NewDoctorPage";
import NewAccountStaffPage from "views/Pages/dbs-page/Add-page/NewAccountStaffPage";
import BranchEdit from "views/Pages/dbs-page/edit-form/BranchEdit";

var ps;

function Admin(props) {
  const location = useLocation();
  const [sidebarMini, setSidebarMini] = React.useState(true);
  const [backgroundColor, setBackgroundColor] = React.useState("blue");
  const notificationAlert = React.useRef();
  const mainPanel = React.useRef();
  // const [time, setTime] = useState(1);
  useEffect(() => {
    const interval = setInterval(() => {
      sessionStorage.clear();
      window.location.replace("/auth/login");
    }, 1000 * 60 * 50);
    return () => clearInterval(interval);
  });

  useEffect(() => {
    if (sessionStorage.getItem("user") !== null) {
      toast("Login successfully");
      console.log("admin ");
    }
  }, []);

  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      document.documentElement.className += " perfect-scrollbar-on";
      document.documentElement.classList.remove("perfect-scrollbar-off");
      ps = new PerfectScrollbar(mainPanel.current);
    }
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
        document.documentElement.className += " perfect-scrollbar-off";
        document.documentElement.classList.remove("perfect-scrollbar-on");
      }
    };
  });
  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainPanel.current.scrollTop = 0;
  }, [location]);
  const minimizeSidebar = () => {
    var message = "Sidebar mini ";
    if (document.body.classList.contains("sidebar-mini")) {
      setSidebarMini(false);
      message += "deactivated...";
    } else {
      setSidebarMini(true);
      message += "activated...";
    }
    // setSidebarMini(false);
    document.body.classList.toggle("sidebar-mini");
    var options = {};
    options = {
      place: "tr",
      message: message,
      type: "info",
      icon: "now-ui-icons ui-1_bell-53",
      autoDismiss: 7,
    };
    notificationAlert.current.notificationAlert(options);
  };
  const handleColorClick = (color) => {
    setBackgroundColor(color);
  };
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return getRoutes(prop.views);
      }
      if (prop.layout === "/admin") {
        return (
          <Route
            exact
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  const getActiveRoute = (routes) => {
    let activeRoute = "Default Brand Text";
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveRoute = getActiveRoute(routes[i].views);
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute;
        }
      } else {
        if (
          window.location.pathname.indexOf(
            routes[i].layout + routes[i].path
          ) !== -1
        ) {
          return routes[i].name;
        }
      }
    }
    return activeRoute;
  };

  return (
    <div className="wrapper">
      <NotificationAlert ref={notificationAlert} />
      <Sidebar
        {...props}
        routes={routes}
        minimizeSidebar={minimizeSidebar}
        backgroundColor={backgroundColor}
      />
      <div className="main-panel" ref={mainPanel}>
        <AdminNavbar {...props} brandText={getActiveRoute(routes)} />
        <Switch>
          {/* <Route path="/admin/service/add" component={NewServicePage} /> */}
          {/* <Route path="/admin/discount/add" component={NewDiscountPage} /> */}
          {/* <Route path="/admin/doctor/add" component={NewDoctorPage} /> */}
          {/* <Route path="/admin/account/add" component={NewAccountStaffPage} /> */}
          <Route
            path="/admin/type-service/add"
            component={NewServiceTypePage}
          />
          {sessionStorage.getItem("user") !== null ? (
            ""
          ) : (
            <Redirect from="*" to="/auth/login-page" />
          )}
          {getRoutes(routes)}
        </Switch>
        {
          // we don't want the Footer to be rendered on full screen maps page
          window.location.href.indexOf("full-screen-maps") !== -1 ? null : (
            <Footer fluid />
          )
        }
      </div>
    </div>
  );
}

export default Admin;
