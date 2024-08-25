import { useEffect, useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const SearchForm = ({ handleSearchInfo }) => {
  const [secretKey, setSecretKey] = useState("");
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosPrivate.get(
        `https://localhost:7100/api/collars/${secretKey}`
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
      }}
    >
      <form onSubmit={handleSubmit}>
        <Box>
          <TextField
            id="fullName"
            label="Секретный ключ"
            variant="standard"
            onChange={(e) => setSecretKey(e.target.value)}
            value={secretKey}
            autoComplete="off"
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 5}}>
          <Button type="submit" variant="contained" sx={{ bgcolor: "#ED7D31" }}>
            Найти
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default SearchForm;
