import { Link } from 'react-router-dom'
import styles from "./Header.module.css";
import { useState } from 'react';

const Header = () => {
  const isAuth = localStorage.getItem('userInfo') != null ? true : false;

  return (

    <nav className={styles.horizontal_menu}>
      <ul>
        <li><Link to="/">Главная</Link> </li>
        <li><Link to="profile">Профиль</Link></li>
        <li><Link to="quest">Анкета</Link></li>
        {!isAuth ? (<li><Link to="login">Войти</Link></li>) : (<li><Link to="logout">Выйти</Link></li>)}
      </ul>
    </nav>
  );
};

export default Header;
