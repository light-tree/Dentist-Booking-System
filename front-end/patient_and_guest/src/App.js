import Nav from "./components/Navbar/Nav";
import "./App.css";
// import { BrowserRouter, Switch, Route } from "react-router-dom";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  // useNavigate,
} from "react-router-dom";

import Home from "./components/Home/Home";
import Footer from "./components/Footer/Footer";
import Appointment from "./components/Appointment/Appointment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookMessenger } from "@fortawesome/free-brands-svg-icons";
import ServiceInfo from "./components/Service/ServiceInfo";
import { useEffect, useState } from "react";
import Logout from "./components/Login-Logout/Logout";
import Profile from "./components/Profile/Profile";
import History from "./components/History/History";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import UpdateAppointment from "./components/Appointment/UpdateAppointment";
import { Redirect } from "react-router";
import LoginForm from "./components/Login-Logout/Login";
import UpdateProfile from "./components/Profile/UpdateProfile";
import SignIn from "./components/signIn/SignIn";

// import "bootstrap/dist/css/bootstrap.min.css";
// import { Button } from "bootstrap";
const token = localStorage.getItem("accessToken");
const phone = localStorage.getItem("phone");
const API_CHECK_ACCOUNT = "http://localhost:8080/rade/patient/account/";
function App() {
  // const navigate = useNavigate();
  const MINUTE_MS = 1000 * 60 * 60 * 24;
  const [stateLogin, setStateLogin] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("roleName")) {
      setStateLogin(true);
    }
    if (localStorage.getItem("loginSuccess")) {
      toast.success("Đăng nhập thành công");
      localStorage.removeItem("loginSuccess");
    }
    const interval = setInterval(() => {
      axios
        .get(API_CHECK_ACCOUNT + phone, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {})
        .catch((error) => {
          localStorage.clear();
          toast.warn(
            "Tài khoản cùa bạn hết hạn đang nhập. Hệ thống sẽ reload lại trong 5 giây."
          );
          setTimeout(() => {
            window.location.reload();
          }, 5000);
        });
    }, MINUTE_MS);

    return () => {
      clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
      localStorage.clear();
      sessionStorage.clear();
    };
  }, []);

  return (
    <div className="App">
      <Router>
        <div id="header">
          <Nav />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
        <div id="body">
          <Routes>
            {/* {stateLogin ? (
              <> */}
            <Route index element={<Home />} />
            <Route path="*" element={<Navigate replace to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route
              path="/user/profile"
              element={stateLogin ? <Profile /> : <LoginForm />}
            />
            <Route
              path="/user/profile/update"
              element={stateLogin ? <UpdateProfile /> : <LoginForm />}
            />
            <Route
              path="/user/history"
              element={stateLogin ? <History /> : <LoginForm />}
            />
            <Route exact path="/serviceType/:id" element={<ServiceInfo />} />
            <Route
              path="/user/appointment"
              element={stateLogin ? <Appointment /> : <LoginForm />}
            />
            <Route
              exact
              path="/user/appointment/update"
              element={stateLogin ? <UpdateAppointment /> : <LoginForm />}
            />

            <Route exact path="/account/register" element={<SignIn />} />
            <Route exact path="/logout" element={<Logout />} />
            {/* </>
            ) : (
              <>
                <Route
                  path="/user/*"
                  element={<Navigate replace to="/home" />}
                />
                <Route exact path="/home" element={<Home />} />
                <Route
                  exact
                  path="/serviceType/:id"
                  element={<ServiceInfo />}
                />
              </>
            )} */}
          </Routes>
        </div>
        <Footer />
      </Router>

      <div className="chatBox">
        <a
          className="p-0 m-0"
          href="https://l.messenger.com/l.php?u=http%3A%2F%2Fm.me%2F107337128652951&h=AT1R4u7pSoC4rdF5yHZ0e7myOVni1br5HBNiSsmK2Q_dUr9sNSEFQ8OmWGoFkVXMES6BM0nPWCzLh-JVLevAEg2xzp4WzOuFfUpW39WgQkILbTDH8jxEMSz9r2upi75kUed7uQ"
          target="_blank"
        >
          <FontAwesomeIcon
            icon={faFacebookMessenger}
            style={{ margin: `auto` }}
            className="icon-messenger"
          />
        </a>
      </div>
    </div>
  );
}

export default App;
