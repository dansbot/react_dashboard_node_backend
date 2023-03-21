import * as React from "react";
import { useEffect } from "react";
import { Typography, useTheme, Box } from "@mui/material";
// import useMediaQuery from "@mui/material/useMediaQuery";
import useApiPrivate from "../../../hooks/useApiPrivate";
import Header from "../../../components/Header";
import { tokens } from "../../../theme";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import useAuth from "../../../hooks/useAuth";

const { API } = require("../../../config");

const UserProfile = () => {
  const apiPrivate = useApiPrivate();
  // const isNonMobile = useMediaQuery("(min-width:600px)");
  const [userName, setUserName] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  // const [middleName, setMiddleName] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [access, setAccess] = React.useState("");
  const [image, setImage] = React.useState("");
  const { auth } = useAuth();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const pathnames = window.location.pathname.split("/");
        const userId = pathnames[pathnames.length - 1];
        const response = await apiPrivate.get(`${API.v1.users}/${userId}`);
        const user = response.data;
        setUserName(`${user.firstName || ""} ${user.lastName || ""}`);
        setFirstName(user.firstName);
        // setMiddleName(user.middleName);
        setLastName(user.lastName);
        setEmail(user.email);
        setImage(user.image);
        setTitle(user.title);

        // Define access levels in order of importance
        const accessLevels = [
          "admin",
          "manager",
          "reviewer",
          "annotater",
          "read_only",
        ];
        // Find the most important access level that the user has
        const userAccess = accessLevels.find((level) =>
          user.access.includes(level)
        );
        // Set the access state to the most important access level
        setAccess(userAccess || "");
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, [auth, apiPrivate]);

  if (!image) {
    setImage(`../../assets/user/img/default_user.png`);
  }

  return (
    <Box m="20px">
      <Header title={userName} subtitle={title} />

      <Box
        mb="25px"
        sx={{
          width: 500,
          height: 500,
          backgroundColor: colors.primary[400],
          padding: 2,
        }}
      >
        <Box display="flex" justifyContent="center" alignItems="center">
          <img
            alt="profile-user"
            width="250px"
            height="250px"
            // TODO: Store, Fetch and Display images to Mongo DB
            src={image}
            style={{
              cursor: "pointer",
              borderRadius: "50%",
              marginBottom: "10px",
            }}
          />
        </Box>
        <Box
          width="40%"
          m="0 auto"
          p="5px"
          display="flex"
          justifyContent="center"
          backgroundColor={colors.greenAccent[600]}
          borderRadius="4px"
        >
          {access === "admin" && <AdminPanelSettingsOutlinedIcon />}
          {access === "manager" && <SecurityOutlinedIcon />}
          {access === "read_only" && <LockOpenOutlinedIcon />}
          {access === "reviewer" && <LockOpenOutlinedIcon />}
          {access === "annotate_only" && <LockOpenOutlinedIcon />}
          <Typography sx={{ ml: "5px" }}>{access}</Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell align="left" style={{ verticalAlign: "bottom" }}>
                  <Typography variant="h6">First Name</Typography>
                </TableCell>
                <TableCell align="left" style={{ verticalAlign: "bottom" }}>
                  <Typography variant="h5">{firstName}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left" style={{ verticalAlign: "bottom" }}>
                  <Typography variant="h6">Last Name</Typography>
                </TableCell>
                <TableCell align="left" style={{ verticalAlign: "bottom" }}>
                  <Typography variant="h5">{lastName}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left" style={{ verticalAlign: "bottom" }}>
                  <Typography variant="h6">email</Typography>
                </TableCell>
                <TableCell align="left" style={{ verticalAlign: "bottom" }}>
                  <Typography variant="h5">{email}</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default UserProfile;
