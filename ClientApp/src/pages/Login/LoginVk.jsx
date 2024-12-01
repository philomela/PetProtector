import { useRef, useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../../api/axios";

const LOGIN_URL = "/api/accounts/loginVk"; // Если планируется использовать JWT для обычного логина

const LoginVk = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [errMsg, setErrMsg] = useState(null);
  const errMsgRef = useRef(null);

  // Добавляем обработку редиректа с VK OAuth
  useEffect(() => {
    async function fetchData() {
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
        // Перенаправляем пользователя на сохранённый или стандартный маршрут
        navigate(redirectUrl || from, { replace: true });
      } catch (err) {
        setErrMsg("Ошибка авторизации." + err);
        //navigate("/unauthorize", { replace: true });
      }
    }

    fetchData();
  }, [location, navigate, setAuth]);

  return (
    <div>
      Входим под учеткой Vk...
      {errMsg && <p>{errMsg}</p>}
    </div>
  );
};

export default LoginVk;
