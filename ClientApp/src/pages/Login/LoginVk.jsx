import { useRef, useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button, Box, FormControl, Typography, TextField } from "@mui/material";
import Grid from '@mui/material/Grid';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axios from "../../api/axios";
import Header from "../../components/Header/Header"
import VKIDComponent from '../../components/VKIDComponent/VKIDComponent';


const LOGIN_URL = "/api/accounts/loginVk"; // Если планируется использовать JWT для обычного логина

const LoginVk = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();


  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [errMsg, setErrMsg] = useState(null);
  const errMsgRef = useRef(null);


   // Добавляем обработку редиректа с VK OAuth
   useEffect(async () => {
    const params = new URLSearchParams(location.search);
    const state = params.get("state"); // Предполагаем, что токен возвращается
    const redirectUrl = params.get("redirectUrl"); // Сохраненный путь до авторизации
    const from = location.state?.from?.pathname || "/profile";

      try {
        const response = await axios.post(
          LOGIN_URL,
          JSON.stringify({ state, redirectUrl }),
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
        // Перенаправляем пользователя на сохранённый или стандартный маршрут
      navigate(redirectUrl || from, { replace: true });
      } catch (err) {
        navigate("/unauthorize", { replace: true });
      }

      
    
  }, [location, navigate, setAuth]);
  

  return (
    <>
    Входим под учеткой Vk...
    </>
  );
};

export default LoginVk;
