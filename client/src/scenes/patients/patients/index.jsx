import { Box, Button, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiPrivate.get(API.v1.patients);
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
      field: "patient_id",
      headerName: "Patient ID",
      flex: 1,
      cellClassName: "name-column--cell",
      renderCell: (params) => {
        return (
          <Button
            color="info"
            onClick={() => {
              navigate(`/patient/${params.row.patient_id}`);
            }}
          >
            {params.row.patient_id}
          </Button>
        );
      },
    },
    {
      field: "sex",
      headerName: "Sex",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "age",
      headerName: "Age",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "height",
      headerName: "Height",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "weight",
      headerName: "Weight",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "diagnosis",
      headerName: "Diagnosis",
      flex: 1,
      cellClassName: "name-column--cell",
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
                navigate("/create_patient");
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
