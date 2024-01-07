import { useRef, useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import styles from "./Login.module.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome/index";
import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons/faArrowRightToBracket'

import axios from "../../api/axios";
const LOGIN_URL = "/api/accounts/login";

const Login = () => {
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/profile";

  const emailRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState("");
  const [password, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ email, password }),
        {
          headers: { "Content-Type": "application/json" },
          //withCredentials: true,
        }
      );
      console.log(JSON.stringify(response?.data));

      const accessToken = response?.data?.token;

      //const decodedToken = jwt.decode(accessToken);
      //const role = decodedToken?.role; //Попробовать выдывать реальный массив ролей с фронта если это нужно.
      const payload = accessToken.split(".")[1];
      const role = JSON.parse(atob(payload)).role;
      const userId = JSON.parse(atob(payload)).nameid;
      const isAuth = true;
      //const email = JSON.parse(atob(payload)).role;
      setAuth({ userId, role, accessToken, isAuth });
      setEmail("");
      setPwd("");
      navigate(from, { replace: true });
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <section className={styles.login_section}>
      <div className={styles.login_section_container}>
      <p
        ref={errRef}
        className={errMsg ? "errmsg" : "offscreen"}
        aria-live="assertive"
      >
        {errMsg}
      </p>
      <h1>Войдите <FontAwesomeIcon icon={faArrowRightToBracket} /></h1>
      <form className={styles.login_form} onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          className={styles.login_form_email}
          type="email"
          id="email"
          ref={emailRef}
          autoComplete="off"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        />
        <label htmlFor="password">Пароль:</label>
        <input
          type="password"
          id="password"
          autoComplete="off"
          onChange={(e) => setPwd(e.target.value)}
          value={password}
          required
        />
        <button>Войти</button>
      </form>
      <p>
        У Вас нет аккаунта?
        <br />
        <span className="line">
          {/*Вставить ссылку на страницу регистрации */}
          <a href="#">Зарегистрироваться</a>
        </span>
      </p>
      </div>
    </section>
  );
};

export default Login;
