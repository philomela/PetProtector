import React from "react";
import { Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Typography variant="h2" color="error" gutterBottom>
        404 - Страница не найдена
      </Typography>
      <Typography variant="h6" color="textSecondary" gutterBottom>
        Извините, но страница, которую вы ищете, не существует.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/")}
        sx={{ mt: 2 }}
      >
        Вернуться на главную
      </Button>
    </Box>
  );
};

export default NotFound;
