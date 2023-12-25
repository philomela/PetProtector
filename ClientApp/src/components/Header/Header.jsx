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
          {auth.isAuth ? (
            <li>
              <Link to="profile">Профиль</Link>
            </li>
          ) : null}
          {!auth.isAuth ? (
            <li>
              <Link to="login">Войти</Link> или{" "}
              <Link to="register" className={styles.register_link}>
                зарегистрироваться
              </Link>
            </li>
          ) : (
            <li>
              <Link to="logout">Выйти</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
