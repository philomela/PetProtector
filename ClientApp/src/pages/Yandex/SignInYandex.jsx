import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "../../api/axios"; // axios с преднастроенным URL
import useAuth from "../../hooks/useAuth";

const SignInYandex = () => {
  const { setAuth } = useAuth(); // Сеттер для сохранения данных аутентификации
  const location = useLocation();
  const navigate = useNavigate();
  
  const [error, setError] = useState(null);

  useEffect(() => {

      const authenticateWithYandex = async () => {
        try {
          // Отправляем код на сервер для проверки и создания пользователя
         // const response = await axios.get(`/api/users/sign-in-yandex`);
          window.location.href = "/api/users/sign-in-yandex";

          // Навигация на страницу профиля
          navigate("/profile");
        } catch (err) {
          setError("Ошибка при аутентификации через Яндекс");
        }
      };

      authenticateWithYandex();
    
  }, [location.search, navigate, setAuth]);

  return (
    <div>
      {error && <div>{error}</div>}
      <p>Завершаем авторизацию...</p>
    </div>
  );
};

export default SignInYandex;
