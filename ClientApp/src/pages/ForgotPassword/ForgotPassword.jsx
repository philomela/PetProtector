import { useState, useEffect } from "react";
import {
  Button,
  Box,
  Typography,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom"; // For redirection
import axios from "../../api/axios";
import Header from "../../components/Header/Header";

const FORGOT_PASSWORD_URL = "/api/users/forgotpassword";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [open, setOpen] = useState(false); // State for dialog visibility
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [stepText, setStepText] = useState(""); // State for the text that changes
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    let stepIndex = 0;
    const steps = [
      "Собираем инструкции...",
      "Генерируем ссылку восстановления...",
      "Еще немного...",
    ];

    if (loading) {
      setStepText(steps[0]);
      const intervalId = setInterval(() => {
        stepIndex = (stepIndex + 1) % steps.length;
        setStepText(steps[stepIndex]);
      }, 3000);

      return () => clearInterval(intervalId); // Очищаем интервал, когда компонент размонтируется или загрузка завершится
    }
  }, [loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg(""); // Сбрасываем ошибку перед новым запросом
    setLoading(true); // Включаем индикатор загрузки

    try {
      const response = await axios.post(
        FORGOT_PASSWORD_URL,
        { email }, // Отправляем email как JSON объект
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setLoading(false); // Выключаем индикатор загрузки
      setOpen(true); // Открываем диалоговое окно
      setEmail(""); // Очищаем поле email
    } catch (err) {
      setLoading(false); // Выключаем индикатор загрузки при ошибке
      if (!err.response) {
        setErrMsg("Нет ответа от сервера");
      } else if (err.response?.status === 400) {
        setErrMsg("Неверный email");
      } else {
        setErrMsg("Ошибка при отправке запроса");
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    navigate("/"); // Редирект на главную страницу
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
              Восстановление пароля
            </Typography>
            {loading ? (
              <Typography
                sx={{ fontSize: "1rem", color: "gray", textAlign: "center" }}
              >
                {stepText} {/* Показываем динамический текст */}
              </Typography>
            ) : (
              <Typography
                sx={{ fontSize: "1rem", color: "gray", textAlign: "center" }}
              >
                Введите email при регистрации, на него будут отправлены инструкции
                по восстановлению пароля
              </Typography>
            )}

            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              {!loading && ( // Скрываем input, если идет загрузка
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email адрес"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              )}
              {errMsg && (
                <Typography color="error" variant="body2">
                  {errMsg}
                </Typography>
              )}
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                  <CircularProgress
                    sx={{ color: "rgba(31, 94, 109, 0.7)" }} // Устанавливаем цвет спиннера
                  />
                </Box>
              ) : (
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, bgcolor: "#ED7D31" }}
                >
                  Восстановить
                </Button>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Диалоговое окно для подтверждения */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Инструкции отправлены</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Инструкции по восстановлению пароля отправлены на ваш email.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Ок
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ForgotPassword;
