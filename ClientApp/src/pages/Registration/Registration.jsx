import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

const RegistrationForm = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const command = {
      fullName: fullName,
      email: email,
      password: password
    };

    try {
      const response = await fetch('https://localhost:7100/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(command)
      });

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
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="fullName">Full Name:</label>
        <input
          type="text"
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Register</button>
    </form>
  );
};

export default RegistrationForm;