import * as React from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import useAuth from "../../hooks/useAuth";
import { lightBlue } from "@mui/material/colors";
import MyCustomIcon from '../../utils/MyIcon';

const pages = ["Помощь"];
const menuItems = [
  { label: "Профиль", path: "/profile" },
  { label: "Выйти", path: "/logout" },
];

function HorizontalMenu() {
  const { auth } = useAuth();
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
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
          
          <MyCustomIcon/>
          
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
                    <MenuItem sx={{bgColor: "blue"}} key={label} onClick={handleCloseUserMenu}>
                      <Typography sx={{color: "#638889", textDecoration: "none"}} textAlign="center" component={Link} to={path}>
                        {label}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Typography
                  component={Link}
                  to="login"
                  sx={{ color: 'white', mr: 1 }}
                >
                  Войти
                </Typography>
                <Typography sx={{ color: 'white' }}>или</Typography>
                <Typography
                  component={Link}
                  to="register"
                  sx={{ color: 'white', ml: 1 }}
                >
                  зарегистрироваться
                </Typography>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default HorizontalMenu;
