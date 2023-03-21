import { useEffect, useState } from "react";
import { Typography, useTheme, Box } from "@mui/material";
import axios from "axios";
// import useMediaQuery from "@mui/material/useMediaQuery";
import useApiPrivate from "../../../hooks/useApiPrivate";
import Header from "../../../components/Header";
import EcgChart from "../../../components/EcgChart";
import { tokens } from "../../../theme";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";

const { API, RECORDS } = require("../../../config");

const Profile = () => {
  const apiPrivate = useApiPrivate();
  // const isNonMobile = useMediaQuery("(min-width:600px)");
  const [patientId, setPatientId] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [recordingDate, setRecordingDate] = useState("");
  const [report, setReport] = useState("");
  const [ecgUrl, setEcgUrl] = useState("");

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const pathnames = window.location.pathname.split("/");
        const patientId = pathnames[pathnames.length - 1];
        const response = await apiPrivate.get(
          `${API.v1.patients}/${patientId}`
        );
        const patient = response.data;

        setPatientId(patient.patient_id);
        setAge(`${patient.age} yrs`);
        setSex(patient.sex);
        setHeight(`${patient.height}cm`);
        setWeight(`${patient.weight}kg`);
        setDiagnosis(patient.diagnosis);
        setRecordingDate(patient.recording_date);
        setReport(patient.report);
      } catch (err) {
        // not is 200 repoonse range
        console.log(err);
      }
    };
    fetchPatient();
  }, [apiPrivate]);

  useEffect(() => {
    const fetchEcgUrl = async () => {
      try {
        const pathnames = window.location.pathname.split("/");
        const patientId = pathnames[pathnames.length - 1];
        const response = await apiPrivate.get(
          `${API.v1.records}?folderName=${RECORDS.ecg.folder}&fileName=${patientId}.${RECORDS.ecg.fileType}`
        );
        const url = response.data?.url;
        setEcgUrl(url);
      } catch (err) {
        // not is 200 repoonse range
        console.log(err);
      }
    };
    fetchEcgUrl();
  }, [apiPrivate]);

  return (
    <Box m="20px">
      <Header title={patientId} />

      <Box
        mb="25px"
        sx={{
          width: 500,
          height: 500,
          backgroundColor: colors.primary[400],
          padding: 2,
        }}
      >
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell align="left" style={{ verticalAlign: "bottom" }}>
                  <Typography variant="h6">Age</Typography>
                </TableCell>
                <TableCell align="left" style={{ verticalAlign: "bottom" }}>
                  <Typography variant="h5">{age}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left" style={{ verticalAlign: "bottom" }}>
                  <Typography variant="h6">Sex</Typography>
                </TableCell>
                <TableCell align="left" style={{ verticalAlign: "bottom" }}>
                  <Typography variant="h5">{sex}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left" style={{ verticalAlign: "bottom" }}>
                  <Typography variant="h6">Height</Typography>
                </TableCell>
                <TableCell align="left" style={{ verticalAlign: "bottom" }}>
                  <Typography variant="h5">{height}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left" style={{ verticalAlign: "bottom" }}>
                  <Typography variant="h6">Weight</Typography>
                </TableCell>
                <TableCell align="left" style={{ verticalAlign: "bottom" }}>
                  <Typography variant="h5">{weight}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left" style={{ verticalAlign: "bottom" }}>
                  <Typography variant="h6">Diagnosis</Typography>
                </TableCell>
                <TableCell align="left" style={{ verticalAlign: "bottom" }}>
                  <Typography variant="h5">{diagnosis}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left" style={{ verticalAlign: "bottom" }}>
                  <Typography variant="h6">Recording Date</Typography>
                </TableCell>
                <TableCell align="left" style={{ verticalAlign: "bottom" }}>
                  <Typography variant="h5">{recordingDate}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left" style={{ verticalAlign: "bottom" }}>
                  <Typography variant="h6">Report</Typography>
                </TableCell>
                <TableCell align="left" style={{ verticalAlign: "bottom" }}>
                  <Typography variant="h5">{report}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="left" style={{ verticalAlign: "bottom" }}>
                  <Typography variant="h6">ECG File</Typography>
                </TableCell>
                <TableCell align="left" style={{ verticalAlign: "bottom" }}>
                  <Typography variant="h5">
                    <a href={ecgUrl} download="ecg">
                      download ecg
                    </a>
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box>
        <EcgChart csvUrl={ecgUrl} />
      </Box>
    </Box>
  );
};

export default Profile;
