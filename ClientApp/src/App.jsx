import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home/Home";
import Header from "./components/Header/Header";
import Login from "./pages/Login/Login";
import Questionnaire from "./pages/questionnaire/questionnaire";
import Profile from "./pages/Profile/Profile";
import PrivateRoute from "./utils/PrivateRoute";
import Layout from "./components/Layout/layout";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="login" element={<Login />} />
          <Route path="/" element={<Home />} />

          <Route element={<PrivateRoute allowedRole={"User"} />}>
            <Route path="quest" element={<Questionnaire />} />
          </Route>

          <Route element={<PrivateRoute allowedRole={"User"} />}>
            <Route path="profile" element={<Profile />} />
          </Route>
          
        </Route>
      </Routes>
    </>
  );
};

export default App;
