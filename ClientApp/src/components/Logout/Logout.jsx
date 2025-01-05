import { useRef, useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Snackbar, Alert } from "@mui/material";
const LOGOUT_URL = "/api/accounts/logout";

const Logout = () => {
  const { auth, setAuth } = useAuth();

  const { axiosPrivate, errorMessage, setErrorMessage } = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleCloseSnackbar = () => {
    setErrorMessage("");
    if (window.history.length > 1) {
      navigate(-1); // Возвращаемся на предыдущую страницу
    } else {
      navigate("/"); // Если истории нет, отправляем на главную
    }
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const logout = async () => {
      try {
        await axiosPrivate.post(LOGOUT_URL, {
          token: auth.accessToken,
        });
        setAuth({});
        navigate("/", { state: { from: location }, replace: true });
      } catch (err) {
        console.error(err);
      }
    };

    logout();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [axiosPrivate]);

  return (
    <>
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Logout;
