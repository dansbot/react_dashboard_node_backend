import * as React from "react";
import * as yup from "yup";
import { Formik } from "formik";
import { useNavigate, useLocation } from "react-router-dom";
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
import useApiPrivate from "../../../hooks/useApiPrivate";
import Header from "../../../components/Header";
import useAuth from "../../../hooks/useAuth";
const { API } = require("../../../config");

const Form = () => {
  const apiPrivate = useApiPrivate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState("");
  const [variantName, setVariantName] = React.useState([]);
  const { auth } = useAuth();

  const handleAccessChange = (event) => {
    const {
      target: { value },
    } = event;

    console.log("value", value);

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

  const navigate = useNavigate();
  const location = useLocation();

  const handleFormSubmit = async (values) => {
    setUserEmail(values.email);
    values.email = values.email.toLowerCase();
    console.log(API.v1.users, values);
    try {
      await apiPrivate.post(API.v1.users, {
        values,
        headers: { Authorization: `Bearer ${auth?.accessToken}` },
      });
      setSuccess(true);
    } catch (err) {
      console.log(`error: ${err}, status: ${err.status}`);
      console.log(err);
      if (err.response.status === 409) {
        setError(true);
      }
    }
  };

  return (
    <Box m="20px">
      <Header title="CREATE USER" subtitle="" />
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
          User "{userEmail}" successfuly added.
        </Alert>
      </Dialog>
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
          User "{userEmail}" already exists.
        </Alert>
      </Dialog>
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleFormSubmit,
        }) => (
          <form onSubmit={handleFormSubmit}>
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
                value={values.firstName}
                name="firstName"
                error={!!touched.firstName && !!errors.firstName}
                helperText={touched.firstName && errors.firstName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Middle Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.middleName}
                name="middleName"
                error={!!touched.middleName && !!errors.middleName}
                helperText={touched.middleName && errors.middleName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Last Name*"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lastName}
                name="lastName"
                error={!!touched.lastName && !!errors.lastName}
                helperText={touched.lastName && errors.lastName}
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
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create New User
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
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

const checkoutSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  access: yup.string().required("required"),
});

const initialValues = {
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  title: "",
  access: "",
};

export default Form;
