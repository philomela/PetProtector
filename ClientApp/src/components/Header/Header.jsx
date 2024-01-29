import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import useAuth from "../../hooks/useAuth";
import ResponsiveAppBar from "../HorizontalMenu/HorizontalMenu"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome/index";
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons/faArrowRightToBracket";

const Header = () => {
  //const isAuth = localStorage.getItem('userInfo') != null ? true : false; //Как брать из контекста если это возможно?
  const { auth } = useAuth();

  return (
    <header className={styles.horizontal_menu}>
      <ResponsiveAppBar></ResponsiveAppBar>
    </header>
  );
};

export default Header;
