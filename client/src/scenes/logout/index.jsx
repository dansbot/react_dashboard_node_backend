import * as React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import useLogout from "../../hooks/useLogout";

const Logout = () => {
  const logout = useLogout();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <Button variant="outlined" color="primary" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default Logout;
