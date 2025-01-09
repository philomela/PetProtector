import {
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
import { Box, Typography, TextField, Avatar } from "@mui/material";
import { Email, Person, CalendarToday } from "@mui/icons-material";
import { InputAdornment } from "@mui/material";
import moment from "moment";
import Link from "@mui/material/Link";
import { useRef } from "react";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import { PhoneNumberInput } from "../../utils/Masks/PhoneNumberMask";
import Header from "../../components/Header/Header";
import { Card } from "@mui/material";
import { Snackbar, Alert } from "@mui/material";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [profileInfo, setProfileInfo] = useState(null);
  const [searchCollarsInfo, setSearchCollarsInfo] = useState(null);
  const [searchedCollar, setSearchedCollar] = useState(null);
  const { axiosPrivate, errorMessage, setErrorMessage } = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAgreementInfo, setDialogAgreementInfo] = useState({
    isOpen: false,
    collarId: null,
  });
  const [dialogSavedDataInfo, setDialogSavedDataInfo] = useState(false);
  const phoneInputRef = useRef(null);

  const handleCloseSnackbar = () => {
    setErrorMessage("");
    if (window.history.length > 1) {
      navigate(-1); // Возвращаемся на предыдущую страницу
    } else {
      navigate("/"); // Если истории нет, отправляем на главную
    }
  };

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
      const response = await axiosPrivate.put(
        `/api/questionnaries/`,
        JSON.stringify(collarToUpdate)
      );
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
  }, [searchedCollar, axiosPrivate]);

  return (
    <>
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
      {isLoading ? (
        <Preloader />
      ) : (
        <>
          <Header />

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
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
      alignItems: "center", // Центрируем содержимое
    }}
  >
    <Avatar
      alt={profileInfo.fullName}
      src={profileInfo.avatar || ""}
      sx={{
        width: 100,
        height: 100,
        bgcolor: "orange", // Цвет фона, если нет изображения
        fontSize: "2rem", // Размер текста, если используются инициалы
      }}
    >
      {profileInfo.fullName ? profileInfo.fullName[0] : "?"}
    </Avatar>
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
          color: "white !important",
          "&.Mui-focused": {
            color: "white !important",
          },
        },
      }}
      sx={{
        input: {
          color: "white !important",
          caretColor: "white !important",
        },
        "& .MuiInput-underline:before": {
          borderBottom: "2px solid white !important",
        },
        "&:hover .MuiInput-underline:before": {
          borderBottom: "2px solid white !important",
        },
        "& .MuiInput-underline:after": {
          borderBottom: "2px solid orange !important",
        },
        "& .MuiInputBase-input": {
          color: "white !important",
          caretColor: "white !important",
        },
        "& .MuiInputLabel-root": {
          color: "white !important",
        },
        "&:hover .MuiInputLabel-root": {
          color: "white !important",
        },
        "& .Mui-focused .MuiInputLabel-root": {
          color: "white !important",
        },
      }}
      autoComplete="off"
    />
    <TextField
      id="email"
      label="Ваш email"
      variant="standard"
      value={profileInfo.email}
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
          color: "white !important",
          "&.Mui-focused": {
            color: "white !important",
          },
        },
      }}
      sx={{
        input: {
          color: "white !important",
          caretColor: "white !important",
        },
        "& .MuiInput-underline:before": {
          borderBottom: "2px solid white !important",
        },
        "&:hover .MuiInput-underline:before": {
          borderBottom: "2px solid white !important",
        },
        "& .MuiInput-underline:after": {
          borderBottom: "2px solid orange !important",
        },
        "& .MuiInputBase-input": {
          color: "white !important",
          caretColor: "white !important",
        },
        "& .MuiInputLabel-root": {
          color: "white !important",
        },
        "&:hover .MuiInputLabel-root": {
          color: "white !important",
        },
        "& .Mui-focused .MuiInputLabel-root": {
          color: "white !important",
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
          color: "white !important",
          "&.Mui-focused": {
            color: "white !important",
          },
        },
      }}
      sx={{
        input: {
          color: "white !important",
          caretColor: "white !important",
        },
        "& .MuiInput-underline:before": {
          borderBottom: "2px solid white !important",
        },
        "&:hover .MuiInput-underline:before": {
          borderBottom: "2px solid white !important",
        },
        "& .MuiInput-underline:after": {
          borderBottom: "2px solid orange !important",
        },
        "& .MuiInputBase-input": {
          color: "white !important",
          caretColor: "white !important",
        },
        "& .MuiInputLabel-root": {
          color: "white !important",
        },
        "&:hover .MuiInputLabel-root": {
          color: "white !important",
        },
        "& .Mui-focused .MuiInputLabel-root": {
          color: "white !important",
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

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                mt: 3,
                mb: 2,
                backgroundColor: "#F8FAE5",
                borderRadius: 3,
              }}
            >
              {profileInfo.collars.length > 0 &&
                profileInfo.collars.map((collar) => (
                  <Card
                    key={collar.id}
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", md: "row" },
                      gap: 3,
                      p: 3,
                      backgroundColor: "#fdfdf4",
                      borderRadius: 3,
                      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
                      border: "1px solid #d9e2ec",
                    }}
                  >
                    {/* Левая колонка с изображением */}
                    <Box
                      sx={{
                        flexShrink: 0,
                        textAlign: "center",
                        borderRight: "1px solid #d9e2ec",
                        pr: 3,
                      }}
                    >
                      <Box
                        component="img"
                        src="/images/corousel2.png"
                        alt="Collar"
                        sx={{
                          width: 150,
                          height: 150,
                          objectFit: "cover",
                          borderRadius: 3,
                          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
                          mb: 2,
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ color: "#636e72", fontStyle: "italic" }}
                      >
                        QR-адресник #{collar.id.split("-").pop()}
                      </Typography>
                    </Box>

                    {/* Правая колонка с информацией */}
                    <Box
                      sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                      }}
                    >
                      {/* Информация об адреснике */}
                      <Box>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: "bold",
                            color: "#2c3e50",
                            borderBottom: "2px solid #f57c00",
                            display: "inline-block",
                            mb: 1,
                          }}
                        >
                          Паспорт питомца
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#636e72" }}>
                          Статус:{" "}
                          <span
                            style={{
                              color: collar.isActive ? "#4caf50" : "#e74c3c",
                              fontWeight: "bold",
                            }}
                          >
                            {collar.isActive ? "Активен" : "Неактивен"}
                          </span>
                        </Typography>
                      </Box>

                      {/* Поля для редактирования */}
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                          gap: 2,
                        }}
                      >
                        <TextField
                          value={collar.questionnaire.ownersName || ""}
                          onChange={(event) =>
                            handleCollarChange(event, collar.id, "ownersName")
                          }
                          label="Имя хозяина"
                          placeholder="Введите имя"
                          size="small"
                          fullWidth
                        />
                        <TextField
                          value={collar.questionnaire.petsName || ""}
                          onChange={(event) =>
                            handleCollarChange(event, collar.id, "petsName")
                          }
                          label="Кличка питомца"
                          placeholder="Введите кличку"
                          size="small"
                          fullWidth
                        />
                        <TextField
                          value={collar.questionnaire.phoneNumber || ""}
                          onChange={(event) =>
                            handleCollarChange(event, collar.id, "phoneNumber")
                          }
                          label="Телефон"
                          placeholder="Введите телефон"
                          size="small"
                          fullWidth
                        />
                        <TextField
                          value={collar.questionnaire.comment || ""}
                          onChange={(event) =>
                            handleCollarChange(event, collar.id, "comment")
                          }
                          label="Комментарий"
                          placeholder="Введите комментарий"
                          size="small"
                          fullWidth
                        />
                      </Box>

                      {/* Кнопки */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: { xs: "center", md: "flex-end" },
                          gap: 2,
                          mt: 2,
                        }}
                      >
                        <Button
                          variant="outlined"
                          onClick={() =>
                            navigate(
                              `/quest/${collar.questionnaire.linkQuestionnaire}`
                            )
                          }
                          sx={{
                            color: "#4caf50",
                            borderColor: "#4caf50",
                            textTransform: "none",
                            "&:hover": {
                              backgroundColor: "#e8f5e9",
                              borderColor: "#4caf50",
                            },
                          }}
                        >
                          Просмотреть QR-паспорт
                        </Button>
                        <Button
                          variant="contained"
                          onClick={() => handleOpenDialog(collar.id)}
                          sx={{
                            backgroundColor: "#f57c00",
                            color: "white",
                            fontWeight: "bold",
                            textTransform: "none",
                            "&:hover": {
                              backgroundColor: "#e57300",
                            },
                          }}
                        >
                          Сохранить
                        </Button>
                      </Box>
                    </Box>
                  </Card>
                ))}
            </Box>
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
