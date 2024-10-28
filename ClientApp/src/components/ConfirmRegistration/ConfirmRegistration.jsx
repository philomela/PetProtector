import axios from "../../api/axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

const ConfirmRegistration = () => {
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

    const controller = new AbortController();

    const Confirm = async () => {
      try {
        const confirmRegistrationResponse = await axios.put(
          "/api/users/ConfirmRegister",
          { email, token}, // Отправляем email, token и новый пароль
        {
          headers: { "Content-Type": "application/json" },
        }
        );

        if (confirmRegistrationResponse.status === 200) {
          navigate("/login", true);
        } else {
          navigate("/", true);
        }
      } catch (err) {
        console.error(err);
      }
    };

    Confirm();

    return () => {
      //controller.abort();
    };
  }, [email, token, navigate]);
};

export default ConfirmRegistration;
