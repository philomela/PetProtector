import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import {
  Box,
  TextField,
  Typography,
  CircularProgress,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";

const Questionnaire = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Hook for navigation

  const [questionnaireInfo, setQuestionnaireInfo] = useState(null);
  const [coordinates, setCoordinates] = useState({
    latitude: null,
    longitude: null,
  });
  const [locationError, setLocationError] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  const LOCATION_URL = "/api/locations";

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getQuestionnaireInfo = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7100/api/Questionnaries/${id}`,
          {
            signal: controller.signal,
          }
        );
        if (response.status === 200 && isMounted) {
          setQuestionnaireInfo(response.data);
        } else {
          console.error("No data or unexpected status code:", response.status);
          setQuestionnaireInfo(null);
        }
      } catch (err) {
        if (err.response && err.response.status === 429) {
          setShowDialog(true); // Show dialog on status 429
        } else {
          console.error("Error fetching questionnaire:", err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const sendCoordinates = async (latitude, longitude, id) => {
      try {
        await axios.post(LOCATION_URL, {
          latitude,
          longitude,
          linkQuestionnaire: id,
        });
      } catch (err) {
        if (err.response && err.response.status === 429) {
          setShowDialog(true); // Show dialog on status 429
        } else {
          console.error("Failed to send coordinates:", err);
        }
      }
    };

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            if (isMounted) {
              const { latitude, longitude } = position.coords;
              setCoordinates({ latitude, longitude });
              sendCoordinates(latitude, longitude, id); // Send coordinates
            }
          },
          (err) => {
            if (isMounted) setLocationError(err.message);
          }
        );
      } else {
        setLocationError("Geolocation is not supported by this browser.");
      }
    };

    getQuestionnaireInfo();
    getLocation();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [id]);

  const handleCloseDialog = () => {
    setShowDialog(false);
    navigate("/"); // Redirect to home page
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress sx={{ color: "white" }} />
      </Box>
    );
  }

  return (
    <Box>
      <Dialog
        open={showDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Слишком много запросов, попробуйте обновить страницу позже.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary" autoFocus>
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>

      {!showDialog && (
        <Box mt={5}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ textAlign: "center", color: "#638889" }}
          >
            Ура! Вы нашли питомца!
          </Typography>
        </Box>
      )}

      {!showDialog && (
        <Box
          sx={{
            maxWidth: 600,
            margin: "auto",
            padding: 3,
            bgcolor: "#638889",
            borderRadius: 2,
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ color: "white" }}>
            Анкета питомца
          </Typography>

          {questionnaireInfo ? (
            <>
              <TextField
                label="Номер телефона владельца"
                value={questionnaireInfo.phoneNumber}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                  style: { color: "white", caretColor: "white" },
                }}
                InputLabelProps={{ style: { color: "white" } }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white",
                    },
                    "&:hover fieldset": {
                      borderColor: "white",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "white",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "white",
                    caretColor: "white",
                  },
                }}
              />
              <TextField
                label="Имя владельца"
                value={questionnaireInfo.ownersName}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                  style: { color: "white", caretColor: "white" },
                }}
                InputLabelProps={{ style: { color: "white" } }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white",
                    },
                    "&:hover fieldset": {
                      borderColor: "white",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "white",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "white",
                    caretColor: "white",
                  },
                }}
              />
              <TextField
                label="Кличка питомца"
                value={questionnaireInfo.petsName}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                  style: { color: "white", caretColor: "white" },
                }}
                InputLabelProps={{ style: { color: "white" } }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white",
                    },
                    "&:hover fieldset": {
                      borderColor: "white",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "white",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "white",
                    caretColor: "white",
                  },
                }}
              />

              {/* Call and Email buttons */}
              <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PhoneIcon />}
                  href={`tel:${questionnaireInfo.phoneNumber}`}
                  sx={{
                    flex: 1,
                    marginRight: 1,
                    color: "white",
                    "&:hover": {
                      color: "white",
                    },
                  }}
                >
                  Позвонить
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<EmailIcon />}
                  href={`mailto:${questionnaireInfo.email}`}
                  sx={{
                    flex: 1,
                    marginLeft: 1,
                    color: "white",
                    "&:hover": {
                      color: "white",
                    },
                  }}
                >
                  Написать
                </Button>
              </Box>
            </>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 100,
              }}
            >
              <Typography variant="body1" color="error" gutterBottom sx={{ mt: 2, color: "white" }}>
                {locationError
                  ? `Ошибка: ${locationError}`
                  : "Получение координат..."}
              </Typography>
            </Box>
          )}

          {coordinates.latitude && coordinates.longitude ? (
            <>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ mt: 4, color: "white" }}
              >
                Ваши координаты:
              </Typography>
              <TextField
                label="Широта"
                value={coordinates.latitude}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                  style: { color: "white", caretColor: "white" },
                }}
                InputLabelProps={{ style: { color: "white" } }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white",
                    },
                    "&:hover fieldset": {
                      borderColor: "white",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "white",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "white",
                    caretColor: "white",
                  },
                }}
              />
              <TextField
                label="Долгота"
                value={coordinates.longitude}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                  style: { color: "white", caretColor: "white" },
                }}
                InputLabelProps={{ style: { color: "white" } }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "white",
                    },
                    "&:hover fieldset": {
                      borderColor: "white",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "white",
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "white",
                    caretColor: "white",
                  },
                }}
              />
            </>
          ) : (
            <Typography
              variant="body1"
              color="error"
              gutterBottom
              sx={{ mt: 2, color: "white" }}
            >
              {locationError
                ? `Ошибка: ${locationError}`
                : "Получение координат..."}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Questionnaire;
