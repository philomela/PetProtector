import React, { useState } from "react";
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

const REGISTER_URL = "/api/users/register";

const RegistrationForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/profile";

  const handleSubmit = async (e) => {
    e.preventDefault();

    const command = {
      fullName,
      email,
      password,
    };

    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify(command),
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response?.status === 200) {
        navigate(from, { replace: true });
      } else {
        setErrMsg("Registration Failed");
      }
    } catch (error) {
      setErrMsg("Registration Failed");
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
              autoFocus
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
  );
};

export default RegistrationForm;
