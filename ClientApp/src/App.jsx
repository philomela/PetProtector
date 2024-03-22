import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home/Home";
import Header from "./components/Header/Header";
import Login from "./pages/Login/Login";
import Logout from "./components/Logout/Logout";
import Questionnaire from "./pages/questionnaire/questionnaire";
import Profile from "./pages/Profile/Profile";
import PrivateRoute from "./utils/PrivateRoute";
import Layout from "./components/Layout/layout";
import RegistrationForm from "./pages/Registration/Registration";
import Box from '@mui/system/Box';
import Container from '@mui/material/Container';
import ConfirmRegistration from "./components/ConfirmRegistration/ConfirmRegistration";

const App = () => {
  return (
    <>
      <Container maxWidth="lg">
        <Box sx={{ bgcolor: "#F8FAE5", height: "100vh" }}>
          <Header />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="login" element={<Login />} />
              <Route path="logout" element={<Logout />} />

              <Route path="/" element={<Home />} />
              <Route path="register" element={<RegistrationForm />} />
              <Route path="quest/:id" element={<Questionnaire />} />
              <Route path="confirmRegister/:userId" element={<ConfirmRegistration />} />

              <Route element={<PrivateRoute allowedRole={"User"} />}>
                <Route path="profile" element={<Profile />} />
              </Route>
            </Route>
          </Routes>
        </Box>
      </Container>
    </>
  );
};

export default App;
