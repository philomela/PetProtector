import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Button from "@mui/material/Button";
import ShopIcon from "@mui/icons-material/Shop";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Footer from "../../components/Footer/Footer";
import Preloader from "../../components/Preloader/Preloader";
import { Helmet } from "react-helmet";
import { useMediaQuery, useTheme } from "@mui/material";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <>
      <Helmet>
        <title>PetProtector - Главная</title>
        <meta
          name="description"
          content="Защитите своего питомца от потери с помощью нашего QR-адресника. Простая регистрация, удобный интерфейс, надежная защита."
        />
        <meta
          name="keywords"
          content="QR-адресник, защита питомцев, потерянный питомец, PetProtector, QR-паспорт, пропавший питомец, защита qr-кодом, qr код, потеря питомца, потеря домашнего животного, владелец питомца, координаты питомца."
        />
        <meta property="og:title" content="PetProtector - Главная" />
        <meta
          property="og:description"
          content="Лучший способ защитить своего питомца от потери — наш QR-адресник. Простота и удобство в использовании, удобный интерфейс, надежная защита, металлический qr-адресник, получение координат питомца при сканировании qr-адресника."
        />
        <meta property="og:image" content="/images/main-slide-origin.png" />
        <meta property="og:url" content="https://petprotector.ru" />
        <meta property="og:type" content="website" />
      </Helmet>

      {isLoading ? (
        <Preloader />
      ) : (
        <>
          <Header />
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            {/* Главный контент */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
                width: "100%",
                backgroundImage: {md: "url(/images/main-slide-origin.png)"},
                backgroundRepeat: "no-repeat",
                backgroundPosition: "80% 100%",
                backgroundSize: "60em",
              }}
            >
              <Typography
                sx={{ width: { xs: "100%", md: "50%" }, color: "#76453B", fontFamily: "Russo" }}
                textAlign={{xs: "center", md: 'left'}}
                variant={isMobile ? "h4" : "h3"} // Изменяем variant в зависимости от экрана
                gutterBottom
              >
                Защитите своего питомца от потери нашим qr-адресником
              </Typography>
              <Typography
                sx={{ width: { xs: "100%", md: "50%" }, color: "#76453B", mt: 3 }}
                variant="h6"
                gutterBottom
              >
                Простая регистрация
                <br />
                Быстрое заполнение анкеты
                <br />
                Удобный интерфейс
              </Typography>

              <Button
                variant="contained"
                sx={{
                  bgcolor: "#ED7D31",
                  height: 60,
                  width: 200,
                  fontSize: 20,
                  mt: 5,
                }}
                endIcon={<ShopIcon />}
              >
                Приобрести
              </Button>
            </Box>

            {/* Карусель */}
            <Box
              sx={{
                width: { xs: "100%", md: "30%" },
                mt: { xs: 3, md: 0 },
              }}
            >
              <Carousel
                showIndicators={false}
                autoPlay={true}
                infiniteLoop={true}
                showStatus={false}
                showArrows={false}
              >
                <div>
                  <img src="/images/corousel1.png" alt="Slideshow Image 1" />
                </div>
                <div>
                  <img src="/images/corousel2.png" alt="Slideshow Image 2" />
                </div>
                <div>
                  <img src="/images/corousel3.png" alt="Slideshow Image 3" />
                </div>
                <div>
                  <img src="/images/corousel4.png" alt="Slideshow Image 4" />
                </div>
              </Carousel>
              <Box>
                <Typography sx={{ textAlign: "center" }}>
                  Защити своего питомца!
                  <br />
                  Сканируй qr код и получи информацию о владельце
                  <br />
                </Typography>
                <Typography
                  sx={{
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "#76453B",
                  }}
                >
                  Наш instagram <FontAwesomeIcon icon={faInstagram} />
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Футер */}
          <Footer />
        </>
      )}
    </>
  );
};

export default Home;
