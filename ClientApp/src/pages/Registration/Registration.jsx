import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Avatar,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Paper,
  CssBaseline,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import axios from "../../api/axios";
import Header from "../../components/Header/Header";

const REGISTER_URL = "/api/users/register";

const RegistrationForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const errRef = useRef(); // создаем реф для сообщения об ошибке
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/profile";

  useEffect(() => {
    setErrMsg(""); // очищаем сообщение об ошибке при изменении полей
  }, [fullName, email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const command = {
      fullName,
      email,
      password,
    };

    try {
      const response = await axios.post(REGISTER_URL, JSON.stringify(command), {
        headers: { "Content-Type": "application/json" },
      });

      if (response?.status === 200) {
        navigate(from, { replace: true }); //Отобразить диалоговое окно, об успешной регистрации и проверки почты и обратным отсчетом
      }
    } catch (error) {
      if (!error?.response) {
        setErrMsg("Нет ответа от сервера");
      } else if (error.response?.status === 400) {
        setErrMsg("Неверные данные. Проверьте логин или пароль");
      } else if (error.response?.status === 409) {
        setErrMsg("Такой пользователь уже существует");
      } else {
        setErrMsg("Ошибка регистрации");
      }
      if (errMsgRef.current) {
        errMsgRef.current.focus(); // Фокусируемся на элементе с сообщением об ошибке
      }
    }
  };

  return (
    <>
      <Header />
      <Grid container sx={{ height: "90vh", bgColor: "F8FAE5" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundRepeat: "no-repeat",
            backgroundColor: "F8FAE5",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "#638889" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Зарегистрируйтесь
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="fullName"
                label="Имя"
                name="fullName"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email адрес"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Пароль"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {/* Сообщение об ошибке */}
              <Typography
                ref={errRef} // подключаем реф для фокуса
                color="error"
                variant="body2"
                sx={{
                  visibility: errMsg ? "visible" : "hidden"
                }}
              >
                {errMsg}
              </Typography>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, bgcolor: "#ED7D31" }}
              >
                Зарегистрироваться
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default RegistrationForm;
