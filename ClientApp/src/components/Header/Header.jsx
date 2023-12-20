import { Link } from 'react-router-dom'
import styles from "./Header.module.css";
import useAuth from "../../hooks/useAuth";

const Header = () => {
  //const isAuth = localStorage.getItem('userInfo') != null ? true : false; //Как брать из контекста если это возможно?
  const { auth } = useAuth();

  return (
    
    <nav className={styles.horizontal_menu}>
      <ul>
        <li><Link to="/">Главная</Link> </li>
        <li><Link to="profile">Профиль</Link></li>
        {!auth.isAuth ? (<li><Link to="register">Регистрация</Link></li>) : null}
        {!auth.isAuth ? (<li><Link to="login">Войти</Link></li>) : (<li><Link to="logout">Выйти</Link></li>)}
      </ul>
    </nav>
  );
};

export default Header;
