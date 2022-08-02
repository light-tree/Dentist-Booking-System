import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
// used for making the prop types of this component
import PropTypes from "prop-types";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";

// reactstrap components
import { Nav, Collapse, Button, Toast } from "reactstrap";

// core components
import avatar from "assets/img/avatar.png";
import logo from "assets/img/logoBooking.png";
import authApi from "api/AuthApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import AccountApi from "api/AccountApi";

var ps;

function Sidebar(props) {
  const [openAvatar, setOpenAvatar] = React.useState(false);
  const [collapseStates, setCollapseStates] = React.useState({});
  const sidebar = React.useRef();
  const [account, setAccount] = useState(null);

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = () => {
    AccountApi.getAccount(sessionStorage.getItem("phone")).then((res) => {
      setAccount(res.data);
      console.log(res);
    });
  };

  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      // if you are using a Windows Machine, the scrollbars will have a Mac look
      ps = new PerfectScrollbar(sidebar.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
    }
    return function cleanup() {
      // we need to destroy the false scrollbar when we navigate
      // to a page that doesn't have this component rendered
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
      // to stop the warning of calling setState of unmounted component
      var id = window.setTimeout(null, 0);
      while (id--) {
        window.clearTimeout(id);
      }
    };
  });
  React.useEffect(() => {
    setCollapseStates(getCollapseStates(props.routes));
  }, []);
  // this creates the intial state of this component based on the collapse routes
  // that it gets through props.routes
  const getCollapseStates = (routes) => {
    let initialState = {};
    routes.map((prop, key) => {
      if (prop.collapse) {
        initialState = {
          [prop.state]: getCollapseInitialState(prop.views),
          ...getCollapseStates(prop.views),
          ...initialState,
        };
      }
      return null;
    });
    return initialState;
  };
  // this verifies if any of the collapses should be default opened on a rerender of this component
  // for example, on the refresh of the page,
  // while on the src/views/forms/RegularForms.js - route /admin/regular-forms
  const getCollapseInitialState = (routes) => {
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse && getCollapseInitialState(routes[i].views)) {
        return true;
      } else if (window.location.href.indexOf(routes[i].path) !== -1) {
        return true;
      }
    }
    return false;
  };
  // this function creates the links and collapses that appear in the sidebar (left menu)
  const createLinks = (routes) => {
    return routes.map((prop, key) => {
      if (prop.invisible) return null;
      if (window.location.href.indexOf(prop.layout) <= -1) return null;
      if (prop.collapse) {
        var st = {};
        st[prop["state"]] = !collapseStates[prop.state];
        return (
          <li
            className={getCollapseInitialState(prop.views) ? "active" : ""}
            key={key}
          >
            <a
              href="#pablo"
              data-toggle="collapse"
              aria-expanded={collapseStates[prop.state]}
              onClick={(e) => {
                e.preventDefault();
                setCollapseStates(st);
              }}
            >
              {prop.icon !== undefined ? (
                <>
                  <i className={prop.icon} />
                  <p>
                    {prop.name}
                    <b className="caret" />
                  </p>
                </>
              ) : (
                <>
                  <span className="sidebar-mini-icon">{prop.mini}</span>
                  <span className="sidebar-normal">
                    {prop.name}
                    <b className="caret" />
                  </span>
                </>
              )}
            </a>
            <Collapse isOpen={collapseStates[prop.state]}>
              <ul className="nav">{createLinks(prop.views)}</ul>
            </Collapse>
          </li>
        );
      }
      return (
        <li className={activeRoute(prop.layout + prop.path)} key={key}>
          <NavLink to={prop.layout + prop.path} activeClassName="">
            {prop.icon !== undefined ? (
              <>
                <i className={prop.icon} />
                <p>{prop.name}</p>
              </>
            ) : (
              <>
                <span className="sidebar-mini-icon">{prop.mini}</span>
                <span className="sidebar-normal">{prop.name}</span>
              </>
            )}
          </NavLink>
        </li>
      );
    });
  };
  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return window.location.href.indexOf(routeName) > -1 ? "active" : "";
  };
  return (
    <>
      <div className="sidebar" data-color={props.backgroundColor}>
        <div className="logo">
          <a
            href={
              sessionStorage.getItem("role") === "ROLE_STAFF"
                ? "/staff/home"
                : "/admin/booking"
            }
            className="simple-text logo-mini"
            // target="_blank"
          >
            <div className="logo-img">
              <img src={logo} alt="react-logo" />
            </div>
          </a>
          <a
            href={
              sessionStorage.getItem("role") === "ROLE_STAFF"
                ? "/staff/home"
                : "/admin/booking"
            }
            className="simple-text logo-normal"
            // target="_blank"
          >
            RADE System
          </a>
          {/* <div className="navbar-minimize">
            <Button
              outline
              className="btn-round btn-icon"
              color="neutral"
              id="minimizeSidebar"
              onClick={() => props.minimizeSidebar()}
            >
              <i className="now-ui-icons text_align-center visible-on-sidebar-regular" />
              <i className="now-ui-icons design_bullet-list-67 visible-on-sidebar-mini" />
            </Button>
          </div> */}
        </div>

        <div className="sidebar-wrapper" ref={sidebar}>
          <div className="user">
            <div className="photo">
              <img src={avatar} alt="Avatar" />
            </div>
            <div className="info">
              <a
                href="#pablo"
                // href="/staff/account/profile"
                data-toggle="collapse"
                aria-expanded={openAvatar}
                onClick={() => setOpenAvatar(!openAvatar)}
              >
                <span>
                  {account?.fullName}
                  <b className="caret" />
                </span>
              </a>
              <Collapse isOpen={openAvatar}>
                <ul className="nav">
                  <li>
                    <a
                      href={
                        sessionStorage.getItem("role") === "ROLE_ADMIN"
                          ? "/admin/account/profile"
                          : sessionStorage.getItem("role") === "ROLE_STAFF"
                          ? "/staff/account/profile"
                          : null
                      }
                    >
                      <span className="sidebar-normal">Profile</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#pablo"
                      onClick={(e) => {
                        e.preventDefault();
                        authApi.logout();
                      }}
                    >
                      <span className="sidebar-normal">Log out</span>
                    </a>
                  </li>
                </ul>
              </Collapse>
            </div>
          </div>
          <Nav>{createLinks(props.routes)}</Nav>
        </div>
      </div>
    </>
  );
}

Sidebar.defaultProps = {
  routes: [],
  showNotification: false,
  backgroundColor: "blue",
  minimizeSidebar: () => {},
};

Sidebar.propTypes = {
  // links that are rendered
  routes: PropTypes.arrayOf(PropTypes.object),
  // if you want to show a notification when switching between mini sidebar and normal
  showNotification: PropTypes.bool,
  // background color for the component
  backgroundColor: PropTypes.oneOf([
    "blue",
    "yellow",
    "green",
    "orange",
    "red",
  ]),
  // function that is called upon pressing the button near the logo
  minimizeSidebar: PropTypes.func,
};

export default Sidebar;
