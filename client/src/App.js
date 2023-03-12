import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Line from "./scenes/line";
import Login from "./scenes/login";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Create_User from "./scenes/users/create";
import User_Profile from "./scenes/users/profile";
import Team from "./scenes/users/team";
import Create_Patient from "./scenes/patients/create";
import Patient_Profile from "./scenes/patients/profile";
import Patients from "./scenes/patients/patients";
import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import RequireAuth from "./components/RequireAuth";
import PersistLogin from "./components/PersistLogin";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              {/* public routes */}
              <Route path="/login" element={<Login />} />

              <Route element={<PersistLogin />}>
                <Route path="/" element={<Dashboard />} />
                {/* admin and manager routes */}
                <Route
                  element={<RequireAuth allowedRoles={["admin", "manager"]} />}
                >
                  <Route path="/create_user" element={<Create_User />} />
                  <Route path="/create_patient" element={<Create_Patient />} />
                </Route>

                {/* read_all routes */}
                <Route element={<RequireAuth allowedRoles={["read_only"]} />}>
                  <Route path="/team" element={<Team />} />
                  <Route path="/patients" element={<Patients />} />
                  <Route path="/invoices" element={<Invoices />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/user_profile/:id" element={<User_Profile />} />
                  <Route path="/patient/:id" element={<Patient_Profile />} />
                  <Route path="/contacts" element={<Contacts />} />
                  <Route path="/bar" element={<Bar />} />
                  <Route path="/pie" element={<Pie />} />
                  <Route path="/line" element={<Line />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/geography" element={<Geography />} />
                </Route>
              </Route>

              {/* catch all */}
              <Route path="/" element={<Dashboard />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
