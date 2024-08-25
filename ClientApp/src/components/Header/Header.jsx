import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import useAuth from "../../hooks/useAuth";
import HorizontalMenu from "../HorizontalMenu/HorizontalMenu"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome/index";
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons/faArrowRightToBracket";

const Header = () => {
  return (
    <header>
      <HorizontalMenu></HorizontalMenu>
    </header>
  );
};

export default Header;
