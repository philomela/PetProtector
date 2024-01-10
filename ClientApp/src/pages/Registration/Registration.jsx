import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Registration.module.css";

const RegistrationForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const command = {
      fullName: fullName,
      email: email,
      password: password,
    };

    try {
      const response = await fetch(
        "https://localhost:7100/api/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(command),
        }
      );

      if (response.ok) {
        navigate("/profile", { state: { from: location }, replace: true });
        // Регистрация прошла успешно
        // Дополнительные действия, например, перенаправление на другую страницу
      } else {
        // Обработка ошибки регистрации
        // Например, отображение сообщения об ошибке
      }
    } catch (error) {
      // Обработка ошибки запроса
    }
  };

  return (
    <>
      <section className={styles.registration_section}>
        <div className={styles.registration_section_container}>
          <h2>Зарегистрируйтесь</h2>
          <form className={styles.registration_form} onSubmit={handleSubmit}>
            <label htmlFor="fullName">Имя:</label>
            <input
              className={styles.registration_form_input}
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <label htmlFor="email">Email:</label>
            <input
              className={styles.registration_form_input}
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label htmlFor="password">Пароль:</label>
            <input
              className={styles.registration_form_input}
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className={styles.registration_form_button} type="submit">
              Зарегистрироваться
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default RegistrationForm;
