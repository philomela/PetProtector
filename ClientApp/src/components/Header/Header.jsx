import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import useAuth from "../../hooks/useAuth";

const Header = () => {
  //const isAuth = localStorage.getItem('userInfo') != null ? true : false; //Как брать из контекста если это возможно?
  const { auth } = useAuth();

  return (
    <header className={styles.horizontal_menu}>
      <nav>
        <ul>
          <li>
            <Link to="/">Главная</Link>{" "}
          </li>
          {!auth.isAuth ? (
            <li className={styles.right_menu_buttons}>
              <Link to="login">Войти</Link> <span className={styles.delimeter}> или </span>
              <Link to="register" className={styles.register_link}>
                зарегистрироваться
              </Link>
            </li>
          ) : (
            <li>
              <Link to="profile">Профиль</Link><span className={styles.delimeter}> | </span>
              <Link to="logout">Выйти</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
