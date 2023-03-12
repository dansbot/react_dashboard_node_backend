import * as React from "react";
import * as yup from "yup";
import { Formik } from "formik";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Header from "../../components/Header";

import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth.js";
import api from "../../api/connection.js";

const { API } = require("../../config");

const Login = () => {
  const { setAuth, persist } = useAuth();
  const [error, setError] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const handleSubmit = async (values) => {
    setEmail(values.email);
    values.email = values.email.toLowerCase();
    try {
      const response = await api.post(API.v1.auth, values, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      const accessToken = response?.data?.accessToken;
      const userInfo = response?.data?.userInfo;

      setAuth({ accessToken, userInfo });
      navigate(from, { replace: true });
    } catch (err) {
      setError(true);
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg(
          err?.response?.data?.message || `Could not login with "${email}"`
        );
      }
    }
  };

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);
  return (
    <Box m="20px">
      <Header title="Sign In" subtitle="" />

      <Dialog
        open={error}
        onClose={() => {
          setError(false);
        }}
      >
        <Alert
          severity="error"
          closeText="close"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setError(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          <AlertTitle>Error</AlertTitle>
          {errMsg}
        </Alert>
      </Dialog>

      <Formik
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gridTemplateRows: "repeat(4, auto)",
                rowGap: "20px",
                width: "50%",
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 2" }}
              />
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                sx={{ width: "25%" }}
              >
                Sign In
              </Button>
              <FormControlLabel
                control={<Checkbox />}
                label="Remember this device"
              />
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const initialValues = {
  email: "",
  password: "",
};

export default Login;
