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
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Preloader from "../../components/Preloader/Preloader";
import SearchForm from "../../components/SearchForm/SearchForm";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Box, Typography, TextField } from "@mui/material";
import { Email, Person, CalendarToday, Edit, Pets, Badge } from "@mui/icons-material";
import { InputAdornment } from "@mui/material";
import moment from "moment";
import Link from "@mui/material/Link";
import { useRef } from 'react';
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import { PhoneNumberInput } from "../../utils/Masks/PhoneNumberMask";
import Header from "../../components/Header/Header"

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [profileInfo, setProfileInfo] = useState(null);
  const [searchCollarsInfo, setSearchCollarsInfo] = useState(null);
  const [searchedCollar, setSearchedCollar] = useState(null);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAgreementInfo, setDialogAgreementInfo] = useState({
    isOpen: false,
    collarId: null,
  });
  const [dialogSavedDataInfo, setDialogSavedDataInfo] = useState(false);
  const phoneInputRef = useRef(null);
   

  // Функция для обработки изменений в текстовых полях
  const handleCollarChange = (event, collarId, propName) => {
    setProfileInfo((prevProfileInfo) => ({
      ...prevProfileInfo,
      collars: prevProfileInfo.collars.map((collar) => {
        if (collar.id === collarId) {
          return {
            ...collar,
            questionnaire: {
              ...collar.questionnaire,
              [propName]: event.target.value,
            },
          };
        }
        return collar;
      }),
    }));
  };


  // Функция для подтверждения и сохранения
  const handleConfirmSaveQuestionnaire = async () => {
    if (dialogAgreementInfo.collarId) {
      await saveCollarData(dialogAgreementInfo.collarId);
      handleCloseDialog(); // Закрываем диалог после сохранения
      // Обновите состояние, если необходимо
      setDialogSavedDataInfo(true);
    }
  };

  // Функция для открытия диалога
  const handleOpenDialog = (collarId) => {
    setDialogAgreementInfo({
      isOpen: true,
      collarId: collarId,
    });
  };

  // Функция для закрытия диалога
  const handleCloseDialog = () => {
    setDialogAgreementInfo({
      isOpen: false,
      collarId: null,
    });
  };

  // Функция для сохранения данных ошейника на сервере
  const saveCollarData = async (collarId) => {
    const collarToUpdate = profileInfo.collars.find(
      (collar) => collar.id === collarId
    ).questionnaire;

    collarToUpdate.id = collarId;
    //collarToUpdate.phoneNumber = phoneNumber;  // Передаем актуальное значение phoneNumber

    try {
      const response = await axiosPrivate.put(`/api/questionnaries/`, JSON.stringify(collarToUpdate));
    } catch (error) {
      console.error(error);
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

        if (isMounted) {
          setProfileInfo({
            ...responseUserInfo.data,
            ...responseUserCollars.data,
          });
          

          setTimeout(() => {
            if (isMounted) {
              setIsLoading(false);
            }
          }, 2000);
        }
      } catch (err) {
        console.error(err);
        navigate("/login", { state: { from: location }, replace: true });
      }

      return () => {
        // Очищаем таймер, если компонент размонтирован
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
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
        <Header />
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
                    sx: {
                      color: "white !important", // Устанавливаем постоянный цвет лейбла
                      "&.Mui-focused": {
                        color: "white !important", // Оставляем цвет белым даже при фокусе
                      },
                    },
                  }}
                  sx={{
                    input: {
                      color: "white !important",
                      caretColor: "white !important"
                    },
                    "& .MuiInput-underline:before": {
                      borderBottom: "2px solid white !important", // Белая полоса до фокуса
                    },
                    "&:hover .MuiInput-underline:before": {
                      borderBottom: "2px solid white !important", // Белая полоса при наведении
                    },
                    "& .MuiInput-underline:after": {
                      borderBottom: "2px solid orange !important", // Оранжевая полоса при фокусе
                    },
                    "& .MuiInputBase-input": {
                      color: "white !important",
                      caretColor: "white !important"
                    },
                    "& .MuiInputLabel-root": {
                      color: "white !important", // Цвет лейбла
                    },
                    "&:hover .MuiInputLabel-root": {
                      color: "white !important", // Цвет лейбла при наведении
                    },
                    "& .Mui-focused .MuiInputLabel-root": {
                      color: "white !important", // Цвет лейбла при фокусе
                    },
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
                    sx: {
                      color: "white !important", // Устанавливаем постоянный цвет лейбла
                      "&.Mui-focused": {
                        color: "white !important", // Оставляем цвет белым даже при фокусе
                      },
                    },
                  }}
                  sx={{
                    input: {
                      color: "white !important",
                      caretColor: "white !important"
                    },
                    "& .MuiInput-underline:before": {
                      borderBottom: "2px solid white !important", // Белая полоса до фокуса
                    },
                    "&:hover .MuiInput-underline:before": {
                      borderBottom: "2px solid white !important", // Белая полоса при наведении
                    },
                    "& .MuiInput-underline:after": {
                      borderBottom: "2px solid orange !important", // Оранжевая полоса при фокусе
                    },
                    "& .MuiInputBase-input": {
                      color: "white !important",
                      caretColor: "white !important"
                    },
                    "& .MuiInputLabel-root": {
                      color: "white !important", // Цвет лейбла
                    },
                    "&:hover .MuiInputLabel-root": {
                      color: "white !important", // Цвет лейбла при наведении
                    },
                    "& .Mui-focused .MuiInputLabel-root": {
                      color: "white !important", // Цвет лейбла при фокусе
                    },
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
                    sx: {
                      color: "white !important", // Устанавливаем постоянный цвет лейбла
                      "&.Mui-focused": {
                        color: "white !important", // Оставляем цвет белым даже при фокусе
                      },
                    },
                  }}
                  sx={{
                    input: {
                      color: "white !important",
                      caretColor: "white !important"
                    },
                    "& .MuiInput-underline:before": {
                      borderBottom: "2px solid white !important", // Белая полоса до фокуса
                    },
                    "&:hover .MuiInput-underline:before": {
                      borderBottom: "2px solid white !important", // Белая полоса при наведении
                    },
                    "& .MuiInput-underline:after": {
                      borderBottom: "2px solid orange !important", // Оранжевая полоса при фокусе
                    },
                    "& .MuiInputBase-input": {
                      color: "white !important",
                      caretColor: "white !important"
                    },
                    "& .MuiInputLabel-root": {
                      color: "white !important", // Цвет лейбла
                    },
                    "&:hover .MuiInputLabel-root": {
                      color: "white !important", // Цвет лейбла при наведении
                    },
                    "& .Mui-focused .MuiInputLabel-root": {
                      color: "white !important", // Цвет лейбла при фокусе
                    },
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
                  linear-gradient(to bottom right, rgba(99, 136, 137, 0.1), rgba(248, 250, 229, 0)), 
                  url(/images/png-lk.png) 
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

          <Box
            sx={{
              background: `
                  linear-gradient(to bottom right, rgba(99, 136, 137, 0.1), rgba(248, 250, 229, 0)), 
                  url(/images/png-lk.png) 
                `,
            }}
          >
            <Typography
              variant="h6"
              component="h6"
              sx={{ justifyContent: "center", textAlign: "center", mt: "2%" }}
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
                  mb: "2%",
                }}
              >
                Вы пока не привязали ни одного qr-адресника
                <br /> <Link>Как привязать qr-адресник?</Link>
              </Typography>
            )}

            <TableContainer
              component={Paper}
              sx={{
                backgroundColor: "#638889",
                color: "white",
                mt: 3,
                mb: 2,
              }}
            >
              <Table sx={{ color: "white" }}>
                {profileInfo.collars.length > 0 && (
                  <TableHead sx={{ color: "white"}}>
                    <TableRow sx={{ color: "white"}}>
                      {/* Заголовки столбцов */}
                      <TableCell sx={{ color: "white", textAlign: "center" }}>Изображение</TableCell>
                      <TableCell sx={{ color: "white", textAlign: "center" }}>QR-паспорт</TableCell>
                      <TableCell sx={{ color: "white", textAlign: "center" }}>
                        Имя владельца
                      </TableCell>
                      <TableCell sx={{ color: "white", textAlign: "center" }}>
                        Кличка питомца
                      </TableCell>
                      <TableCell sx={{ color: "white", textAlign: "center" }}>
                        Номер телефона
                      </TableCell>
                      {/* Добавьте другие заголовки столбцов */}
                    </TableRow>
                  </TableHead>
                )}
                {profileInfo.collars.length > 0 &&
                  profileInfo.collars.map((collar) => (
                    <TableBody>
                      <TableRow key={collar.id}>
                        {/* Колонка с изображением */}
                        <TableCell
                          sx={{
                            color: "#638889",
                            backgroundColor: "white",
                            textAlign: "center",
                          }}
                        >
                          <img
                            src="/images/corousel2.png"
                            alt="Collar"
                            style={{
                              width: "80px",
                              height: "80px",
                              objectFit: "cover",
                            }} // Настройте размеры по вашему усмотрению
                          />
                        </TableCell>

                        {/* Остальные ячейки */}
                        <TableCell
                          sx={{ color: "#638889", backgroundColor: "white" }}
                        >
                          <Button
                            onClick={() =>
                              navigate(
                                `/quest/${collar.questionnaire.linkQuestionnaire}`
                              )
                            }
                          >
                            Просмотреть qr-паспорт
                          </Button>
                        </TableCell>
                        <TableCell
                          sx={{ color: "#638889", backgroundColor: "white" }}
                        >
                          <TextField
                            value={collar.questionnaire.ownersName || ""}
                            onChange={(event) =>
                              handleCollarChange(event, collar.id, "ownersName")
                            }
                            placeholder="Имя хозяина"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Badge />
                                </InputAdornment>
                              ),
                              sx: { color: "#638889" },
                            }}
                          />
                        </TableCell>
                        <TableCell
                          sx={{ color: "#638889", backgroundColor: "white" }}
                        >
                          <TextField
                            value={collar.questionnaire.petsName || ""}
                            onChange={(event) =>
                              handleCollarChange(event, collar.id, "petsName")
                            }
                            placeholder="Кличка"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Pets />
                                </InputAdornment>
                              ),
                              sx: { color: "#638889" },
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: "#638889", backgroundColor: "white" }}>
                <PhoneNumberInput
                  value={collar.questionnaire.phoneNumber || ""}
                  onChange={(e) => handleCollarChange(e, collar.id, "phoneNumber")}
                />
              </TableCell>
                        <TableCell
                          sx={{ color: "#638889", backgroundColor: "white" }}
                        >
                          <Button
                            variant="contained"
                            onClick={() => handleOpenDialog(collar.id)}
                            sx={{ backgroundColor: "#fdb750" }}
                          >
                            Сохранить
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  ))}
              </Table>
            </TableContainer>
          </Box>
          <Box
            sx={{
              background: `
                  linear-gradient(to bottom right, rgba(rgba(255, 165, 0, 1)), rgba(248, 250, 229, 0)),
                  url(/images/png-lk.png)
                `,
            }}
          >
            <Typography
              variant="h6"
              component="h6"
              sx={{ justifyContent: "center", textAlign: "center", mt: "2%" }}
            >
              Ваши браслеты на карте
            </Typography>
            <Typography
              sx={{
                fontSize: "1rem",
                color: "gray",
                textAlign: "center",
              }}
            >
              {profileInfo.collars.length > 0
                ? "Тут отображается последняя геопозиция сканирования адресников"
                : "У вас пока нет привязанных qr-адресников"}
            </Typography>
            <div style={{ width: "100%", height: "500px" }}>
              <YMaps query={{ apikey: "7c19277f-b6f6-4906-baff-f6e4a7dd9838" }}>
                <Map
                  defaultState={{
                    center: (() => {
                      const lastValidCollar = profileInfo.collars
                        .slice() // создаем копию массива
                        .reverse() // переворачиваем массив
                        .find(
                          (collar) =>
                            collar.location &&
                            collar.location.latitude !== null &&
                            collar.location.longitude !== null
                        );
                      return lastValidCollar && lastValidCollar.location
                        ? [
                            lastValidCollar.location.latitude,
                            lastValidCollar.location.longitude,
                          ]
                        : [55.75, 37.57]; // Использовать центр по умолчанию, если валидных меток нет
                    })(),
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
                      options={{
                        preset: "islands#orangeDotIconWithCaption", // Оранжевая метка
                      }}
                    />
                  ))}
                </Map>
              </YMaps>
            </div>
          </Box>
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
          <Dialog open={dialogAgreementInfo.isOpen} onClose={handleCloseDialog}>
            <DialogTitle>Вы уверены, что хотите сохранить данные?</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Данные будут обновлены в QR-паспорте, продолжить?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleConfirmSaveQuestionnaire} color="primary">
                Да
              </Button>
              <Button onClick={handleCloseDialog} color="secondary">
                Отмена
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={dialogSavedDataInfo}
            onClose={() => setDialogSavedDataInfo(false)}
          >
            <DialogTitle>Данные qr-паспорта сохранены</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Данные сохранены, они будут отображаться при сканировании
                qr-кода
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setDialogSavedDataInfo(false)}
                color="secondary"
              >
                Ок
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </>
  );
};

export default Profile;
