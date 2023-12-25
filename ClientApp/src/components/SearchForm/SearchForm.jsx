import { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const SearchForm = ( {handleSearchInfo} ) => {
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
          <input
            type="text"
            id="fullName"
            placeholder="Секретный ключ"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
          />
        </div>
        <button type="submit">Найти</button>
      </form>
    </div>
  );
};

export default SearchForm;
