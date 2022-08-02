import React, { useEffect } from "react";
import { Route, Switch, Redirect, useLocation } from "react-router-dom";
import PerfectScrollbar from "perfect-scrollbar";
import NotificationAlert from "react-notification-alert";

import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import routes from "routes.js";
import StaffNav from "components/Navbars/StaffNav";
import { ToastContainer } from "react-toastify";

var ps;

function Staff(props) {
  const location = useLocation();
  const [sidebarMini, setSidebarMini] = React.useState(true);
  const [backgroundColor, setBackgroundColor] = React.useState("blue");
  const notificationAlert = React.useRef();
  const mainPanel = React.useRef();
  useEffect(() => {
    const interval = setInterval(() => {
      sessionStorage.clear();
      window.location.reload();
    }, 1000 * 60 * 60);

    return () => clearInterval(interval);
  });

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
      if (prop.layout === "/staff") {
        return (
          <Route
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
        layout="/staff"
      />
      <div className="main-panel" ref={mainPanel}>
        <StaffNav {...props} brandText={getActiveRoute(routes)} />
        <Switch>
          {getRoutes(routes)}
          {/* <Redirect from="/staff" to="/staff/home" /> */}
        </Switch>
        {window.location.href.indexOf("full-screen-maps") !== -1 ? null : (
          <Footer fluid />
        )}
      </div>
    </div>
  );
}

export default Staff;
