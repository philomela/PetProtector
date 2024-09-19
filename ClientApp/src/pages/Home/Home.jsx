import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header"
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

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
        setIsLoading(false);
    }, 2000);
  });

  return (
    <>
    {isLoading ? (
      <Preloader />
    ) : (
      <><Header />
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Главный контент */}
      <Box
        sx={{
          flex: 1, // Контент растягивается, занимая всё доступное пространство
          display: "flex",
          width: "100%",
        }}
      >
        <Box
          sx={{
            width: "70%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            backgroundImage: "url(/images/main-slide-origin.png)",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "80% 100%",
            backgroundSize: "60em",
          }}
        >
          <Typography
            sx={{ width: "50%", color: "#76453B", fontFamily: "Russo" }}
            variant="h3"
            gutterBottom
          >
            Защитите своего питомца от потери нашим qr-адресником
          </Typography>
          <Box />
          <Typography
            sx={{ width: "50%", color: "#76453B", mt: 3 }}
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
        <Box sx={{ width: "30%" }}>
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
    </Box></>)}
    </>
  );
};

export default Home;
