import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import Logout from "./components/Logout/Logout";
import Questionnaire from "./pages/Questionnaire/Questionnaire";
import Profile from "./pages/Profile/Profile";
import PrivateRoute from "./utils/PrivateRoute";
import Layout from "./components/Layout/layout";
import RegistrationForm from "./pages/Registration/Registration";
import Box from '@mui/system/Box';
import Container from '@mui/material/Container';
import ConfirmRegistration from "./components/ConfirmRegistration/ConfirmRegistration";
import RestoreAccount from "./components/RestoreAccount/RestoreAccount";
import NotFound from "./pages/NotFound/NotFound";

const App = () => {
  return (
    <>
      <Container maxWidth="lg" sx={{width: "100%"}}>
        <Box sx={{ bgcolor: "#F8FAE5", height: "100vh" }}>
          
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="/login" element={<Login />} />
              
              <Route path="/forgot-password" element={<ForgotPassword />} />

              <Route path="/" element={<Home />} />
              <Route path="/register" element={<RegistrationForm />} />
              <Route path="/quest/:id" element={<Questionnaire />} />
              <Route path="/confirmRegister" element={<ConfirmRegistration />} />
              <Route path="/restore" element={<RestoreAccount />} />

              <Route element={<PrivateRoute allowedRole={"User"} />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/logout" element={<Logout />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
       
        </Box>
      </Container> 
    </>
  );
};

export default App;
