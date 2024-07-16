import * as React from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import ShieldIcon from "@mui/icons-material/Shield";
import useAuth from "../../hooks/useAuth";
import { lightBlue } from "@mui/material/colors";
import styles from "./HorizontalMenu.module.css";

const pages = ["Помощь"];
const menuItems = [
  { label: "Профиль", path: "/profile" },
  { label: "Выйти", path: "/logout" },
];

function HorizontalMenu() {
  const { auth } = useAuth();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleHelpButtonClick = () => {
    window.open("https://t.me/your_public_channel", "_blank");
  };

  return (
    <AppBar position="static" sx={{ bgcolor: "#638889" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <ShieldIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "Roboto",
              fontWeight: 900,
              letterSpacing: ".3rem",
              color: "white !important",
              textDecoration: "none",
            }}
          >
            PETPROTECTOR
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleHelpButtonClick}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {auth.isAuth ? (
              <>
                <Tooltip title="Открыть профиль">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, bgColor: lightBlue[500] }}>
                    <Avatar
                      alt={auth.userName}
                      src="/static/images/avatar/2.jpg"
                      sx={{ bgcolor: "white", color: "black" }}
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {menuItems.map(({ label, path }) => (
                    <MenuItem key={label} onClick={handleCloseUserMenu}>
                      <Typography textAlign="center" component={Link} to={path}>
                        {label}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              <div className={styles.right_menu_buttons}>
                <Link to="login" className={styles.login_link}>
                  Войти
                </Link>{" "}
                <span className={styles.delimeter}> или </span>
                <Link to="register" className={styles.register_link}>
                  зарегистрироваться
                </Link>
              </div>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default HorizontalMenu;
