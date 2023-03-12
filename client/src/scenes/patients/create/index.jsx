import * as yup from "yup";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField } from "@mui/material";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import useMediaQuery from "@mui/material/useMediaQuery";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";

import Header from "../../../components/Header";

import { useState } from "react";
import useAuth from "../../../hooks/useAuth.js";
import useApiPrivate from "../../../hooks/useApiPrivate";

const { API } = require("../../../config");

const Register = () => {
  const { auth } = useAuth();
  const apiPrivate = useApiPrivate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [variantName, setVariantName] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const handleSubmit = async (values) => {
    setEmail(values.email);
    values.email = values.email.toLowerCase();
    values.access = variantName.map((item) => item.value);
    try {
      await apiPrivate.post(API.v1.patients, values, {
        headers: { Authorization: `Bearer ${auth?.accessToken}` },
      });
      setSuccess(true);
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

  const handleAccessChange = (event) => {
    const {
      target: { value },
    } = event;

    let duplicateRemoved = [];

    value.forEach((item) => {
      if (duplicateRemoved.findIndex((o) => o.id === item.id) >= 0) {
        duplicateRemoved = duplicateRemoved.filter((x) => x.id === item.id);
      } else {
        duplicateRemoved.push(item);
      }
    });

    setVariantName(duplicateRemoved);
  };

  return (
    <Box m="20px">
      <Header title="Create New User" subtitle="" />
      {/* success popup */}
      <Dialog
        open={success}
        onClose={() => {
          setSuccess(false);
        }}
      >
        <Alert
          severity="success"
          closeText="close"
          action={[
            <Tooltip title="Add team member">
              <IconButton
                color="inherit"
                size="small"
                onClick={() => {
                  window.location.reload();
                }}
              >
                <AddIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>,
            <Tooltip title="Close">
              <IconButton
                label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  navigate("/team");
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>,
          ]}
        >
          <AlertTitle>Success</AlertTitle>
          User "{email}" successfuly added.
        </Alert>
      </Dialog>
      {/* error pop-up */}
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
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="First Name*"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.firstname}
                name="firstname"
                error={!!touched.firstname && !!errors.firstname}
                helperText={touched.firstname && errors.firstname}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Middle Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.middlename}
                name="middlename"
                error={!!touched.middlename && !!errors.middlename}
                helperText={touched.middlename && errors.middlename}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Last Name*"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lastname}
                name="lastname"
                error={!!touched.lastname && !!errors.lastname}
                helperText={touched.lastname && errors.lastname}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email*"
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
                type="text"
                label="Title"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.title}
                name="title"
                error={!!touched.title && !!errors.title}
                helperText={touched.title && errors.title}
                sx={{ gridColumn: "span 2" }}
              />
              <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="demo-multiple-checkbox-label">
                  Access
                </InputLabel>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  value={variantName}
                  onChange={handleAccessChange}
                  input={<OutlinedInput label="Access" />}
                  renderValue={(selected) =>
                    selected.map((x) => x.name).join(", ")
                  }
                  // MenuProps={MenuProps}
                >
                  {variants.map((variant) => (
                    <MenuItem key={variant.id} value={variant}>
                      <Checkbox
                        checked={
                          variantName.findIndex(
                            (item) => item.id === variant.id
                          ) >= 0
                        }
                      />
                      <ListItemText primary={variant.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box gridColumn="span 4">
                <Button
                  type="submit"
                  color="secondary"
                  variant="contained"
                  sx={{ width: "25%" }}
                >
                  Create
                </Button>
              </Box>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  firstname: yup.string().required("required"),
  lastname: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  //   access: yup.string().required("required"),
});

const initialValues = {
  firstname: "",
  middlename: "",
  lastname: "",
  email: "",
  title: "",
  access: "",
};

const variants = [
  {
    id: 0,
    name: "Admin",
    value: "admin",
  },
  {
    id: 1,
    name: "Manager",
    value: "manager",
  },
  {
    id: 2,
    name: "Reviewer",
    value: "reviewer",
  },
  {
    id: 3,
    name: "Annotater",
    value: "annotater",
  },
];

export default Register;
