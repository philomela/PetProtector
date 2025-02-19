import { useRef, useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button, Box, FormControl, Typography, TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import usePublicAxios from "../../hooks/useAxiosPublic";
import Header from "../../components/Header/Header";
import VKIDComponent from "../../components/VKIDComponent/VKIDComponent";
import { Snackbar, Alert } from "@mui/material";

const LOGIN_URL = "/api/accounts/login"; // Если планируется использовать JWT для обычного логина

const Login = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { axios, errorMessage, setErrorMessage } = usePublicAxios();
  const from = location.state?.from?.pathname || "/profile";

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [errMsg, setErrMsg] = useState(null);
  const errMsgRef = useRef(null);

  const handleCloseSnackbar = () => {
    setErrorMessage("");
    if (window.history.length > 1) {
      navigate(-1); // Возвращаемся на предыдущую страницу
    } else {
      navigate("/"); // Если истории нет, отправляем на главную
    }
  };

  // Добавляем обработку редиректа с VK OAuth
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get("accessToken"); // Предполагаем, что токен возвращается
    const redirectUrl = params.get("redirect"); // Сохраненный путь до авторизации

    if (accessToken) {
      // Сохраняем токен и авторизационные данные
      localStorage.setItem("accessToken", accessToken);

      setAuth({
        accessToken,
        isAuth: true,
      });

      // Перенаправляем пользователя на сохранённый или стандартный маршрут
      navigate(redirectUrl || from, { replace: true });
    }
  }, [location, navigate, setAuth, from]);

  useEffect(() => {
    setErrMsg(null);
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ email, password }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const accessToken = response?.data?.token;
      const payload = accessToken.split(".")[1];
      const role = JSON.parse(atob(payload)).role;
      const userId = JSON.parse(atob(payload)).nameid;
      const userName = JSON.parse(atob(payload)).unique_name;
      const isAuth = true;

      setAuth({ userId, userName, role, accessToken, isAuth });
      setEmail("");
      setPassword("");
      navigate(from, { replace: true });
    } catch (err) {
      if (!err.response) {
        setErrMsg("Нет ответа от сервера");
      } else if (err.response?.status === 400) {
        setErrMsg("Неверный логин или пароль");
      } else if (err.response?.status === 401) {
        setErrMsg("Неверный логин или пароль");
      } else {
        setErrMsg("Невозможно войти");
      }
      if (errMsgRef.current) {
        errMsgRef.current.focus(); // Фокусируемся на элементе с сообщением об ошибке
      }
    }
  };

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
      <Header />
      <Box sx={{ width: "100%", bgColor: "F8FAE5" }}>
        <Grid container sx={{ height: "90vh", bgColor: "F8FAE5" }}>
          <CssBaseline />
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              backgroundRepeat: "no-repeat",
              backgroundColor: "#F8FAE5",
            }}
          />
          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            component={Paper}
            elevation={6}
            square
          >
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
                Войдите в аккаунт
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
                {errMsg && (
                  <Typography
                    color="error"
                    variant="body2"
                    ref={errMsgRef}
                    tabIndex="-1"
                  >
                    {errMsg}
                  </Typography>
                )}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, bgcolor: "#ED7D31" }}
                >
                  Войти
                </Button>
                <div>
                  <VKIDComponent />
                </div>
                <Grid container>
                  <Grid item xs>
                    <Link
                      to={"/forgot-password"}
                      href="/forgot-password"
                      variant="body2"
                    >
                      Забыли пароль?
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Login;
