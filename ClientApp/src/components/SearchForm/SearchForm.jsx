import { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import TextField from "@mui/material/TextField";
import Button from '@mui/material/Button';

const SearchForm = ({ handleSearchInfo }) => {
  const [secretKey, setSecretKey] = useState("");
  const axiosPrivate = useAxiosPrivate();

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
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField
            id="fullName"
            label="Секретный ключ"
            variant="standard"
            onChange={(e) => setSecretKey(e.target.value)}
            value={secretKey}
          />
        </div>
        <Button type="submit" variant="contained" sx={{ bgcolor: "#1f5d6d" }}>
          Найти
        </Button>
      </form>
    </div>
  );
};

export default SearchForm;
