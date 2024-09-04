import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
import Link from "@mui/material/Link";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [profileInfo, setProfileInfo] = useState(null);
  const [searchCollarsInfo, setSearchCollarsInfo] = useState(null);
  const [searchedCollar, setSearchedCollar] = useState(null);
  const [collarInfo, setCollarInfo] = useState([]);
  const [showHint, setShowHint] = useState(true);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const [dialogOpen, setDialogOpen] = useState(false);

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

  const handleUpdate = async () => {
    try {
      const response = await axios.put("/api/profile", {
        fullName: profileInfo.fullName,
        email: profileInfo.email,
        createdAt: profileInfo.createdAt,
      });
      console.log("Profile updated:", response.data);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleSearchInfo = async (collar) => {
    setSearchCollarsInfo(collar);
    setDialogOpen(true); // Открытие диалогового окна при нахождении браслета
  };

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
      setDialogOpen(false);
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

  return (
    <>
      {isLoading ? (
        <Preloader />
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "stretch",
              fontFamily: "Russo",
              fontWeight: 100,
              marginTop: 2,
            }}
          >
            {profileInfo && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  width: "300px",
                  bgcolor: "#638889",
                  borderRadius: 1,
                  padding: 5,
                  color: "white",
                }}
              >
                <Typography variant="h6" component="h6">
                  Профиль
                </Typography>
                <TextField
                  id="fullName"
                  label="Ваше имя"
                  variant="standard"
                  value={profileInfo.fullName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: "white" }} />
                      </InputAdornment>
                    ),
                    readOnly: true,
                  }}
                  InputLabelProps={{
                    sx: { color: "white" }, // Цвет метки
                  }}
                  sx={{
                    input: { color: "white" }, // Цвет текста ввода
                    "& .MuiInput-underline:before": {
                      borderBottom: "2px solid white", // Подчеркивание в неактивном состоянии
                    },
                    "&:hover .MuiInput-underline:before": {
                      borderBottom: "2px solid white", // Подчеркивание при наведении
                    },
                    "&.Mui-focused .MuiInput-underline:before": {
                      borderBottom: "2px solid blue", // Цвет подчеркивания при фокусе
                    },
                    "&.Mui-focused .MuiInput-underline:after": {
                      borderBottom: "2px solid blue", // Цвет подчеркивания после фокуса
                    },
                    // Вы можете добавить дополнительные стили, если нужно
                  }}
                  autoComplete="off"
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
                        <Email sx={{ color: "white" }} />
                      </InputAdornment>
                    ),
                    readOnly: true,
                  }}
                  InputLabelProps={{
                    sx: { color: "white" }, // Цвет метки
                  }}
                  sx={{
                    input: { color: "white" }, // Цвет текста ввода
                    "& .MuiInput-underline:before": {
                      borderBottom: "2px solid white", // Подчеркивание в неактивном состоянии
                    },
                    "&:hover .MuiInput-underline:before": {
                      borderBottom: "2px solid #ED7D31", // Подчеркивание при наведении
                    },
                    "&.Mui-focused .MuiInput-underline:before": {
                      borderBottom: "2px solid blue", // Цвет подчеркивания при фокусе
                    },
                    "&.Mui-focused .MuiInput-underline:after": {
                      borderBottom: "2px solid blue", // Цвет подчеркивания после фокуса
                    },
                    // Вы можете добавить дополнительные стили, если нужно
                  }}
                  autoComplete="off"
                />
                <TextField
                  id="createdAt"
                  label="Дата регистрации"
                  variant="standard"
                  value={moment(profileInfo.createdAt).format("DD.MM.YYYY")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday sx={{ color: "white" }} />
                      </InputAdornment>
                    ),
                    readOnly: true,
                  }}
                  InputLabelProps={{
                    sx: { color: "white" }, // Цвет метки
                  }}
                  sx={{
                    input: { color: "white" }, // Цвет текста ввода
                    "& .MuiInput-underline:before": {
                      borderBottom: "2px solid white", // Подчеркивание в неактивном состоянии
                    },
                    "&:hover .MuiInput-underline:before": {
                      borderBottom: "2px solid #ED7D31", // Подчеркивание при наведении
                    },
                    "&.Mui-focused .MuiInput-underline:before": {
                      borderBottom: "2px solid blue", // Цвет подчеркивания при фокусе
                    },
                    "&.Mui-focused .MuiInput-underline:after": {
                      borderBottom: "2px solid blue", // Цвет подчеркивания после фокуса
                    },
                    // Вы можете добавить дополнительные стили, если нужно
                  }}
                  autoComplete="off"
                />
              </Box>
            )}

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                alignItems: "center",
                justifyContent: "center",
                width: "70%",
                boxShadow: "0px -5px 5px -5px rgba(34, 60, 80, 0.6) inset",
                borderRadius: 1,
                marginLeft: 1,
                background: `
                  linear-gradient(to bottom right, rgba(99, 136, 137, 0.1), rgba(248, 250, 229, 0)), /* Градиентный фон */
                  url(/images/png-lk.png) /* Картинка фона */
                `,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "160% -10%",
               
              }}
            >
              <Typography variant="h6" component="h6">
                Поиск qr-адресника
              </Typography>
              <SearchForm handleSearchInfo={handleSearchInfo} />
            </Box>
          </Box>

          <Typography
            variant="h6"
            component="h6"
            sx={{ justifyContent: "center", textAlign: "center" }}
          >
            Ваши адресники
          </Typography>

          {profileInfo.collars.length > 0 ? (
            <Typography
              sx={{
                fontSize: "1rem",
                color: "gray",
                textAlign: "center",
              }}
            >
              Заполните карточку qr-паспорта данными о питомце и нажмите
              сохранить, Ваш qr-адресник готов{" "}
              <Link>Как заполнить qr-паспорт?</Link>
            </Typography>
          ) : (
            <Typography
              sx={{
                fontSize: "1rem",
                color: "gray",
                textAlign: "center",
              }}
            >
              Вы пока не привязали ни одного qr-адресника
              <br /> <Link>Как привязать qr-адресник?</Link>
            </Typography>
          )}

          <TableContainer
            component={Paper}
            sx={{ backgroundColor: "#638889", color: "white", mt: 3 }}
          >
            <Table sx={{ color: "white" }}>
              <TableHead sx={{ color: "white" }}>
                <TableRow sx={{ color: "white" }}>
                  {/* Заголовки столбцов */}
                  <TableCell sx={{ color: "white" }}>ID</TableCell>
                  <TableCell sx={{ color: "white" }}>Имя владельца</TableCell>
                  <TableCell sx={{ color: "white" }}>Кличка питомца</TableCell>
                  <TableCell sx={{ color: "white" }}>Номер телефона</TableCell>
                  {/* Добавьте другие заголовки столбцов */}
                </TableRow>
              </TableHead>
              <TableBody>
                {profileInfo.collars.length > 0 ? (
                  profileInfo.collars.map((collar) => (
                    <TableRow key={collar.id}>
                      <TableCell
                        sx={{ color: "#638889", backgroundColor: "#F8FAE5" }}
                      >
                        <Button>
                          <Link>Просмотреть qr-паспорт</Link>
                        </Button>
                      </TableCell>
                      <TableCell
                        sx={{ color: "#638889", backgroundColor: "#F8FAE5" }}
                      >
                        <TextField
                          defaultValue={
                            collar.questionnaire.ownersName ??
                            "Еще не заполнено"
                          }
                          value={collar.questionnaire.ownersName}
                          onChange={(event) =>
                            handleCollarChange(event, collar.id, "ownersName")
                          }
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Edit />
                              </InputAdornment>
                            ),
                            sx: { color: "#638889" },
                          }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{ color: "#638889", backgroundColor: "#F8FAE5" }}
                      >
                        <TextField
                          defaultValue={
                            collar.questionnaire.petsName ?? "Еще не заполнено"
                          }
                          value={collar.questionnaire.petsName}
                          onChange={(event) =>
                            handleCollarChange(event, collar.id, "petsName")
                          }
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Edit />
                              </InputAdornment>
                            ),
                            sx: { color: "#638889" },
                          }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{ color: "#638889", backgroundColor: "#F8FAE5" }}
                      >
                        <TextField
                          defaultValue={
                            collar.questionnaire.phoneNumber ??
                            "Еще не заполнено"
                          }
                          value={collar.questionnaire.phoneNumber}
                          onChange={(event) =>
                            handleCollarChange(event, collar.id, "phoneNumber")
                          }
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Edit />
                              </InputAdornment>
                            ),
                            sx: { color: "#638889" },
                          }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{ color: "#638889", backgroundColor: "#F8FAE5" }}
                      >
                        <Button
                          variant="contained"
                          onClick={() => saveCollarData(collar.id)}
                        >
                          Сохранить
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      sx={{ textAlign: "center", color: "white" }}
                    >
                      Здесь будут ваши qr-адресники...
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
            <DialogTitle>QR-адресник найден</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Вы нашли QR-адресник. Хотите активировать его?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleLinkCollar} color="primary">
                Активировать
              </Button>
              <Button onClick={() => setDialogOpen(false)} color="secondary">
                Отмена
              </Button>
            </DialogActions>
          </Dialog>
          <div style={{ width: "100%", height: "500px" }}>
            <YMaps>
              <Map
                defaultState={{
                  center:
                    profileInfo.collars.length > 0
                      ? [
                          profileInfo.collars[profileInfo.collars.length - 1]
                            .location?.latitude ?? 55.75,
                          profileInfo.collars[profileInfo.collars.length - 1]
                            .location?.longitude ?? 37.57,
                        ]
                      : [55.75, 37.57], // Если меток нет, использовать центр по умолчанию
                  zoom: 9,
                }}
                style={{ width: "100%", height: "100%" }}
              >
                {profileInfo.collars.map((collar, index) => (
                  <Placemark
                    key={index}
                    geometry={[
                      collar.location?.latitude ?? null,
                      collar.location?.longitude ?? null,
                    ]}
                    properties={{
                      iconContent: "sdsd", // Название метки
                      balloonContent: collar.id, // Описание метки во всплывающем окне
                    }}
                    options={{
                      preset: "islands#blueDotIconWithCaption", // Стиль метки
                    }}
                  />
                ))}
              </Map>
            </YMaps>
          </div>
        </>
      )}
    </>
  );
};

export default Profile;
