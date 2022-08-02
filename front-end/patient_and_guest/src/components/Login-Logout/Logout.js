import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.clear();
    // window.location.replace("/");
    navigate("/");
    return window.location.reload();
  }, []);
  return <div>Logout</div>;
}
