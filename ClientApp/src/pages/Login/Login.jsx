import { useRef, useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome/index";
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons/faArrowRightToBracket";
import { Button, Box, FormControl, Typography, TextField } from "@mui/material";
import Grid from '@mui/material/Grid';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import axios from "../../api/axios";
import Header from "../../components/Header/Header"

const LOGIN_URL = "/api/accounts/login";


const Login = () => {
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/profile";

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [errMsg, setErrMsg] = useState(null);
  const errMsgRef = useRef(null);

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
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Неверный логин или пароль");
      } else if (err.response?.status === 401) {
        setErrMsg("Неверный логин или пароль");
        if (errMsgRef.current) {
          errMsgRef.current.focus(); // Фокусируемся на элементе с сообщением об ошибке
        }
      } else {
        setErrMsg("Login Failed");
      }
    }
  };

  return (
    <>
    <Header/>
    <Box sx={{width: '100%', bgColor: 'F8FAE5'}}>
    <Grid container  sx={{ height: '90vh', bgColor: 'F8FAE5' }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundRepeat: 'no-repeat',
          backgroundColor: 'F8FAE5',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: '#638889' }}>
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
                    ref={errMsgRef} // Присваиваем реф
                    tabIndex="-1" // Убираем элемент из табуляции
                  >
                    {errMsg}
                  </Typography>
                )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, bgcolor: '#ED7D31' }}
            >
              Войти
            </Button>
            <Grid container>
              <Grid item xs>
                <Link to={"/forgot-password"} href="/forgot-password" variant="body2">
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
