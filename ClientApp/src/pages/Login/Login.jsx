import React, { useState } from 'react';

const LoginForm = () => {
  const [email, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Отправка запроса на сервер для аутентификации
    try {
      const response = await fetch('https://localhost:5001/api/account/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        debugger;
        console.log(data);
        const token = data.token;

        // Сохранение токена в локальном хранилище
        localStorage.setItem('token', token);

        // Переход на предыдущую страницу
        window.history.back();
      } else {
        setError('Неверные учетные данные');
      }
    } catch (error) {
      setError('Ошибка при отправке запроса');
    }
  };

  return (
    <div>
      <h1>Вход</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Имя пользователя:</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          <label htmlFor="password">Пароль:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button type="submit">Войти</button>
      </form>
    </div>
  );
};

export default LoginForm;