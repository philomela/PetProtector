import { Link } from 'react-router-dom'
import styles from "./Header.module.css";

const Header = () => {
  return (
    <nav className={styles.horizontal_menu}>
      <ul>
        <li><Link to="/">Главная</Link> </li>
        <li><Link to="login">Войти</Link></li>
        <li><Link to="profile">Профиль</Link></li>
        <li><Link to="quest">Анкета</Link></li>
      </ul>
    </nav>
  );
};

export default Header;
