import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import SearchIcon from "@mui/icons-material/Search";
import Typography from "@mui/material/Typography";

const SearchForm = ({ handleSearchInfo }) => {
  const [secretKey, setSecretKey] = useState("");
  const { axiosPrivate, errorMessage, setErrorMessage } = useAxiosPrivate();

  useEffect(() => {}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!secretKey) return;

    try {
      const response = await axiosPrivate.get(
        `/api/collars/${secretKey}`
      );

      if (response.ok) {
      } else {
        handleSearchInfo(response.data.id);
      }
    } catch (error) {
      // Обработка ошибки запроса
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
        <Typography
          sx={{
            fontSize: "1rem",
            color: "gray",
            textAlign: "center",
          }}
        >
          Найдите свой qr-адресник по секретному ключу, полученном при приобретении,<br/> введите его ниже и нажмите поиск, затем активировать<br/><Link>Где мой секретный ключ?</Link>
        </Typography>
  

      <form onSubmit={handleSubmit}>
        <Box sx={{ position: "relative", width: "100%" }}>
          <TextField
            id="secretKey"
            label="Секретный ключ"
            variant="standard"
            onChange={(e) => setSecretKey(e.target.value)}
            value={secretKey}
            autoComplete="off"
            fullWidth
          />
          
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 5 }}>
          <Button
            type="submit"
            variant="contained"
            sx={{ bgcolor: "#ED7D31" }}
            startIcon={<SearchIcon />}
          >
            Поиск
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default SearchForm;
