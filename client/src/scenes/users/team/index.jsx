import { Box, Button, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import { tokens } from "../../../theme";
import useApiPrivate from "../../../hooks/useApiPrivate";
import Header from "../../../components/Header";
import useAuth from "../../../hooks/useAuth";

const { API } = require("../../../config");

const Team = () => {
  const [rows, setRows] = useState([]);
  const apiPrivate = useApiPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();

  function getFullName(params) {
    return `${params.row.firstName || ""} ${params.row.lastName || ""}`;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiPrivate.get(API.v1.users);
        setRows(response.data);
      } catch (err) {
        // not is 200 repoonse range
        console.log(err);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };
    fetchData();
  }, [auth, apiPrivate, location, navigate]);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = [
    {
      field: "fullName",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
      valueGetter: getFullName,
      renderCell: (params) => {
        return (
          <Button
            color="info"
            onClick={() => {
              navigate(`/user_profile/${params.row._id}`);
            }}
          >
            {getFullName(params)}
          </Button>
        );
      },
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      cellClassName: "name-column--cell",
      renderCell: (params) => {
        return (
          <Button
            color="info"
            onClick={() => {
              navigate(`/user_profile/${params.row._id}`);
            }}
          >
            {params.row.email}
          </Button>
        );
      },
    },
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "access",
      headerName: "Access",
      flex: 1,
      renderCell: ({ row }) => {
        const access = row?.access ?? "";
        // Define access levels in order of importance
        const accessLevels = [
          "admin",
          "manager",
          "reviewer",
          "annotater",
          "read_only",
        ];
        // Find the most important access level that the user has
        const userAccess = accessLevels.find((level) => access.includes(level));

        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              userAccess === "admin"
                ? colors.greenAccent[600]
                : userAccess === "manager"
                ? colors.greenAccent[700]
                : colors.greenAccent[700]
            }
            borderRadius="4px"
          >
            {userAccess === "admin" && <AdminPanelSettingsOutlinedIcon />}
            {userAccess === "manager" && <SecurityOutlinedIcon />}
            {userAccess === "read_only" && <LockOpenOutlinedIcon />}
            {userAccess === "reviewer" && <LockOpenOutlinedIcon />}
            {userAccess === "annotater" && <LockOpenOutlinedIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {userAccess}
            </Typography>
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="TEAM" subtitle="Managing the Team Members" />

        <Box>
          <Tooltip title="Add team member" key="2">
            <IconButton
              color="inherit"
              sx={{ fontSize: "40px" }}
              onClick={() => {
                navigate("/create_user");
              }}
            >
              <AddIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid
          checkboxSelection
          rows={rows}
          columns={columns}
          getRowId={(row) => row._id}
        />
      </Box>
    </Box>
  );
};

export default Team;
