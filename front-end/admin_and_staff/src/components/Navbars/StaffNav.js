import React from "react";
import { Link, useLocation } from "react-router-dom";
// used for making the prop types of this component
import PropTypes from "prop-types";

// reactstrap components
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Button,
} from "reactstrap";
import routes from "routes.js";
import { useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

function StaffNav(props) {
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [color, setColor] = React.useState("transparent");
  const sidebarToggle = React.useRef();
  const notAddPage = [
    {
      page: "Account",
      status: true,
    },
    {
      page: "Booking",
      status: false,
    },
    {
      page: "Feedback",
      status: false,
    },
    {
      page: "Branch",
      status: true,
    },
    {
      page: "Service type",
      status: true,
    },
    {
      page: "Service",
      status: true,
    },
    {
      page: "Doctor",
      status: true,
    },
    {
      page: "Discount",
      status: true,
    },
  ];

  const getStatusPage = (buttonName) => {
    for (let index = 0; index < notAddPage.length; index++) {
      const page = notAddPage[index].page;
      if (page === buttonName) {
        console.log("buttonName");
        return notAddPage[index].status;
      }
    }
    return false;
  };
  const getPath = (branchText) => {
    for (let index = 0; index < routes.length; index++) {
      const name = routes[index].name;
      if (name === branchText) {
        return routes[index].path;
      }
    }
    return "/";
  };
  const path = getPath(props.brandText);

  const navigate = useHistory();
  function navigateToPage() {
    navigate.push(path + "/add");
  }

  const toggle = () => {
    if (isOpen) {
      setColor("transparent");
    } else {
      setColor("white");
    }
    setIsOpen(!isOpen);
  };
  const dropdownToggle = (e) => {
    setDropdownOpen(!dropdownOpen);
  };
  const openSidebar = () => {
    document.documentElement.classList.toggle("nav-open");
    sidebarToggle.current.classList.toggle("toggled");
  };
  // function that adds color white/transparent to the navbar on resize (this is for the collapse)
  const updateColor = () => {
    if (window.innerWidth < 993 && isOpen) {
      setColor("white");
    } else {
      setColor("transparent");
    }
  };

  const getPathBack = (branchText) => {
    for (let index = 0; index < routes.length; index++) {
      const name = routes[index].name;
      if (name === branchText) {
        return routes[index].layout + routes[index].path;
      }
    }
    return "/";
  };
  React.useEffect(() => {
    window.addEventListener("resize", updateColor);

    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    if (
      window.innerWidth < 993 &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
      sidebarToggle.current.classList.toggle("toggled");
    }
  }, [location]);
  return (
    // add or remove classes depending if we are on full-screen-maps page or not
    <>
      <Navbar
        color={
          window.location.href.indexOf("full-screen-maps") !== -1
            ? "white"
            : color
        }
        expand="lg"
        className={
          window.location.href.indexOf("full-screen-maps") !== -1
            ? "navbar-absolute "
            : "navbar-absolute " +
              (color === "transparent" ? "navbar-transparent " : "")
        }
      >
        <Container fluid>
          <div className="navbar-wrapper">
            <div className="navbar-toggle">
              <button
                type="button"
                ref={sidebarToggle}
                className="navbar-toggler"
                onClick={() => openSidebar()}
              >
                <span className="navbar-toggler-bar bar1" />
                <span className="navbar-toggler-bar bar2" />
                <span className="navbar-toggler-bar bar3" />
              </button>
            </div>
            <NavbarBrand href={getPathBack(props.brandText)}>
              {props.brandText}
            </NavbarBrand>
          </div>
          <NavbarToggler onClick={toggle}>
            <span className="navbar-toggler-bar navbar-kebab" />
            <span className="navbar-toggler-bar navbar-kebab" />
            <span className="navbar-toggler-bar navbar-kebab" />
          </NavbarToggler>
          <Collapse isOpen={isOpen} navbar className="justify-content-end">
            <form>
              <InputGroup className="no-border">
                {/* <Input placeholder="Search..." /> */}
                {getStatusPage(props.brandText) ? (
                  <Button
                    color="info"
                    className="btn-round"
                    onClick={() => navigateToPage()}
                  >
                    Add {props.brandText}
                  </Button>
                ) : (
                  <></>
                )}
              </InputGroup>
            </form>
          </Collapse>
        </Container>
      </Navbar>
      <div>
        <h2
          className="text-center p-5"
          style={{
            backgroundColor: "#2ca8ff",
            color: `white`,
            fontWeight: `bold`,
          }}
        >
          {window.location.href.includes("/cancel")
            ? "Cancel appointment"
            : window.location.href.includes("/feedback")
            ? "Check feedback"
            : window.location.href.includes("/home")
            ? "Check-in appointment"
            : window.location.href.includes("/history")
            ? "History appointment"
            : "Profile"}
        </h2>
      </div>
    </>
  );
}

StaffNav.defaultProps = {
  brandText: "Default Brand Text",
  link: "/",
};

StaffNav.propTypes = {
  // string for the page name
  brandText: PropTypes.string,
  link: PropTypes.string,
};

export default StaffNav;
