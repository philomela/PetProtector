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

const App = () => {
  return (
    <>
      <div className="wrapper_container">
        <Header />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="login" element={<Login />} />
            <Route path="logout" element={<Logout />} />

            <Route path="/" element={<Home />} />
            <Route path="register" element={<RegistrationForm />} />
            <Route path="quest/:id" element={<Questionnaire />} />

            <Route element={<PrivateRoute allowedRole={"User"} />}>
              <Route path="profile" element={<Profile />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </>
  );
};

export default App;
