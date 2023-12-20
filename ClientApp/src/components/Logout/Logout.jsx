import { useRef, useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
//import jwt from 'jsonwebtoken';
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import axios from "../../api/axios";
const LOGOUT_URL = "/api/accounts/login";

const Logout = () => {
  const { auth, setAuth } = useAuth();

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const logout = async () => {
      try {
        const responseUserInfo = await axiosPrivate.post("/api/accounts/Logout", {
          token: auth.accessToken
        });
        setAuth({});
        navigate("/", { state: { from: location }, replace: true });
      } catch (err) {
        console.error(err);
        navigate("/", { state: { from: location }, replace: true });
      }
    };

    logout();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <></>
  );
};

export default Logout;
