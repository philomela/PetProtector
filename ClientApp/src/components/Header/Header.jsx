import { Link } from 'react-router-dom'
import styles from "./Header.module.css";

const Header = () => {
  return (
    <nav className={styles.horizontal_menu}>
      <Link to="/">Home</Link> <br />
      <Link to="login">Login</Link> <br />
      <Link to="profile">Profile</Link> <br />
      <Link to="quest">Questionnaire</Link> <br />
    </nav>
  );
};

export default Header;
