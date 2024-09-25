import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Button,
  Box,
  Typography,
  TextField,
  Grid,
  CssBaseline,
  Paper,
  Avatar,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import axios from "../../api/axios";
import Header from "../../components/Header/Header";

const RESET_PASSWORD_URL = "/api/users/restore";

const RestoreAccount = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [openDialog, setOpenDialog] = useState(false); // Для отображения диалога
  const [countdown, setCountdown] = useState(5); // Обратный отсчет

  const navigate = useNavigate();
  const { search } = useLocation();

  const queryParams = new URLSearchParams(search);
  const email = queryParams.get("email");
  const token = queryParams.get("token");

  useEffect(() => {
    // Проверка на наличие токена и email
    if (!email || !token) {
      navigate("/notfound"); // Если отсутствуют email или token, перенаправляем на страницу Not Found
    }
  }, [email, token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg(""); // Сбрасываем ошибку перед новым запросом
    setSuccessMsg(""); // Сбрасываем успешное сообщение перед новым запросом

    if (newPassword !== confirmPassword) {
      setErrMsg("Пароли не совпадают");
      return;
    }

    try {
      await axios.post(
        RESET_PASSWORD_URL,
        { email, token, newPassword }, // Отправляем email, token и новый пароль
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setSuccessMsg("Пароль успешно изменен. Вы можете войти в систему.");
      setNewPassword(""); // Очищаем поля
      setConfirmPassword("");

      // Показываем диалог с обратным отсчетом
      setOpenDialog(true);
      let timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer); // Очищаем таймер
            navigate("/login"); // Редирект после окончания отсчета
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      if (!err.response) {
        setErrMsg("Нет ответа от сервера");
      } else if (err.response?.status === 400) {
        setErrMsg("Неверный запрос или неправильный токен");
      } else {
        setErrMsg("Ошибка при отправке запроса");
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
              Сброс пароля
            </Typography>
            <Typography
              sx={{ fontSize: "1rem", color: "gray", textAlign: "center" }}
            >
              Пожалуйста, введите новый пароль
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
                id="newPassword"
                label="Новый пароль"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                autoFocus
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="confirmPassword"
                label="Подтвердите новый пароль"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {errMsg && (
                <Typography color="error" variant="body2">
                  {errMsg}
                </Typography>
              )}
              {successMsg && (
                <Typography color="primary" variant="body2">
                  {successMsg}
                </Typography>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, bgcolor: "#ED7D31" }}
              >
                Изменить пароль
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Диалог с обратным отсчетом */}
      <Dialog open={openDialog}>
        <DialogContent>
          <DialogContentText>
            Пароль успешно изменён. Вы будете перенаправлены на страницу входа через {countdown}...
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => navigate("/login")} color="primary">
            Войти сейчас
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RestoreAccount;
