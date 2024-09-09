import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Box, FormControl, Typography, TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import axios from "../../api/axios";

const RESET_PASSWORD_URL = "/api/accounts/reset-password";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        RESET_PASSWORD_URL,
        JSON.stringify({ email }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setSuccessMsg(
        "Инструкции по восстановлению пароля отправлены на ваш email."
      );
      setEmail("");
    } catch (err) {
      if (!err.response) {
        setErrMsg("Нет ответа от сервера");
      } else if (err.response?.status === 400) {
        setErrMsg("Неверный email");
      } else {
        setErrMsg("Не удалось отправить запрос");
      }
    }
  };

  return (
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
          <Typography
            sx={{ fontSize: "1rem", color: "gray", textAlign: "center" }}
          >
            Введите email при регистрации, на него будут отправлены инструкции по восстановлению пароля
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
              id="email"
              label="Email адрес"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              Восстановить
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ResetPassword;
