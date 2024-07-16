import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Button from "@mui/material/Button";
import { deepOrange } from "@mui/material/colors";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Preloader from "../../components/Preloader/Preloader";
import SearchForm from "../../components/SearchForm/SearchForm";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Box, Typography, Avatar, TextField } from "@mui/material";
import { Email, Person, CalendarToday, Edit } from "@mui/icons-material";
import { InputAdornment } from "@mui/material";
import moment from "moment";

import styles from "./Profile.module.css";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [profileInfo, setProfileInfo] = useState(null);
  const [searchCollarsInfo, setSearchCollarsInfo] = useState(null);
  const [searchedCollar, setSearchedCollar] = useState(null);
  const [collarInfo, setCollarInfo] = useState([]); // Изменено для использования данных collarInfo
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const [formValues, setFormValues] = useState({
    fullName: "",
    email: "",
    createdAt: "",
  });

  // Функция для обработки изменений в текстовых полях
  const handleCollarChange = (event, collarId, propName) => {
    setCollarInfo(
      collarInfo.map((collar) => {
        if (collar.id === collarId) {
          return { ...collar, [propName]: event.target.value };
        }
        return collar;
      })
    );
  };

  // Функция для сохранения данных ошейника на сервере
  const saveCollarData = async (collarId) => {
    const collarToUpdate = collarInfo.find((collar) => collar.id === collarId);
    try {
      const response = await axiosPrivate.put(
        `/api/collars/${collarId}`,
        collarToUpdate
      );
      console.log(response.data);
      // Обновите состояние collarInfo здесь, если необходимо
    } catch (error) {
      console.error(error);
    }
  };
  const handleSearchInfo = async (collar) => setSearchCollarsInfo(collar);

  const handleLinkCollar = async () => {
    try {
      setIsLoading(true);
      // Отправка данных на сервер
      const response = await axiosPrivate.put(
        `/api/collars/${searchCollarsInfo}`,
        {}
      );

      // Обновление компонента после успешного запроса
      setSearchedCollar(response.data);

      // Сброс информации о поиске
      setSearchCollarsInfo(null);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUserProfile = async () => {
      try {
        const responseUserInfo = await axiosPrivate.get("/api/users/UserInfo", {
          signal: controller.signal,
        });
        const responseUserCollars = await axiosPrivate.get(
          "/api/collars/GetAll",
          {
            signal: controller.signal,
          }
        );
        console.log(responseUserInfo.data);
        console.log(responseUserCollars.data);

        isMounted &&
          setProfileInfo({
            ...responseUserInfo.data,
            ...responseUserCollars.data,
          });
        setIsLoading(false);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };

    getUserProfile();

    return () => {
      isMounted = false;
      //controller.abort();
    };
  }, [searchedCollar]);

  const handleInputChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      {isLoading ? (
        <Preloader />
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              fontFamily: "Russo",
              fontWeight: 100,
              justifyContent: "space-between",
            }}
          >
            {profileInfo && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  width: "300px",
                  margin: "0 auto",
                }}
              >
                <TextField
                  id="fullName"
                  label="Ваше имя"
                  variant="standard"
                  value={profileInfo.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  id="email"
                  label="Ваш email"
                  variant="standard"
                  value={profileInfo.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  id="createdAt"
                  label="Дата регистрации"
                  variant="standard"
                  value={moment(profileInfo.createdAt).format("DD.MM.YYYY")}
                  onChange={(e) =>
                    handleInputChange("createdAt", e.target.value)
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            )}

            <Box
              className={styles.search_collar}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <Typography variant="h6" component="h4">
                Поиск адресника:
              </Typography>
              <SearchForm handleSearchInfo={handleSearchInfo} />
              {searchCollarsInfo && (
                <>
                  <Typography variant="h6" component="h6">
                    Браслет найден:
                  </Typography>
                  <Typography variant="body1" component="p">
                    {searchCollarsInfo}
                  </Typography>
                  <Button
                    onClick={handleLinkCollar}
                    variant="contained"
                    sx={{ bgcolor: "#1f5d6d" }}
                  >
                    Активировать
                  </Button>
                </>
              )}
            </Box>
          </Box>

          <Typography variant="h4" component="h4">
        Ваши адресники:
      </Typography>
      <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
        <Table>
          <TableHead>
            <TableRow>
              {/* Заголовки столбцов */}
              <TableCell>ID</TableCell>
              <TableCell>Имя владельца</TableCell>
              <TableCell>Кличка питомца</TableCell>
              <TableCell>Номер телефона</TableCell>
              {/* Добавьте другие заголовки столбцов */}
            </TableRow>
          </TableHead>
          <TableBody>
            {profileInfo.collars.map((collar) => (
              <TableRow key={collar.id}>
                <TableCell>{collar.id}</TableCell>
                <TableCell>
                  <TextField
                    defaultValue={collar.questionnaire.ownersName ?? "Еще не заполнено"}
                    value={collar.questionnaire.ownersName}
                    onChange={(event) => handleCollarChange(event, collar.id, "ownersName")}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    defaultValue={collar.questionnaire.petsName ?? "Еще не заполнено"}
                    value={collar.questionnaire.petsName}
                    onChange={(event) => handleCollarChange(event, collar.id, "petsName")}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    defaultValue={collar.questionnaire.phoneNumber ?? "Еще не заполнено"}
                    value={collar.questionnaire.phoneNumber}
                    onChange={(event) => handleCollarChange(event, collar.id, "phoneNumber")}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() => saveCollarData(collar.id)}
                  >
                    Сохранить
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
        </>
      )}
    </>
  );
};

export default Profile;
