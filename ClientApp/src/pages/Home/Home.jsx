import React, { useState } from "react";
import styles from "./Home.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome/index";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Button from "@mui/material/Button";
import ShopIcon from "@mui/icons-material/Shop";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const Home = () => {
  return (
    <>
      <Box sx={{ width: "100%", display: "flex" }}>
        <Box
          sx={{
            width: "70%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            backgroundImage: "url(/images/main-slide-origin.png)",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "100% 50%",
            backgroundSize: "60em",
          }}
        >
          <Typography sx={{ width: "50%" }} variant="h3" gutterBottom>
            Защитите свое животное от потери нашим qr-адресником
          </Typography>
          <Typography sx={{ width: "50%" }} variant="h5" gutterBottom>
            Простая регистрация
            <br></br>
            Быстрое заполнение анкеты
            <br></br>
            Удобный интерфейс
          </Typography>

          <Button
            variant="contained"
            sx={{
              bgcolor: "#ED7D31",
              height: 60,
              width: 200,
              fontSize: 20,
            }}
            endIcon={<ShopIcon />}
          >
            Приобрести
          </Button>
        </Box>
        <Box sx={{ width: "30%" }}>
          <Carousel
            className={styles.corousel}
            showIndicators={false}
            autoPlay={true}
            infiniteLoop={true}
            showStatus={false}
            showArrows={false}
          >
            <div className={styles.carousel_slide}>
              <img src="/images/corousel1.png" alt="Slideshow Image 1" />
            </div>
            <div className={styles.carousel_slide}>
              <img src="/images/corousel2.png" alt="Slideshow Image 2" />
            </div>
            <div className={styles.carousel_slide}>
              <img src="/images/corousel3.png" alt="Slideshow Image 3" />
            </div>
            <div className={styles.carousel_slide}>
              <img src="/images/corousel4.png" alt="Slideshow Image 4" />
            </div>
          </Carousel>
          <Box>
            <Typography>
              Защити свое животное!<br></br>
              Сканируй qr код и получи информацию о владельце
              <br></br>
            </Typography>
            <Typography>
              Наш инстаграм <FontAwesomeIcon icon={faInstagram} />
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Home;
