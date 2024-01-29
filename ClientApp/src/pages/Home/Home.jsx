import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome/index";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Button from "@mui/material/Button";
import ShopIcon from "@mui/icons-material/Shop";

const Home = () => {
  return (
    <>
      <section className={styles.main_section}>
        <div className={styles.slogan_main_section}>
          <div className={styles.slogan_container}>
            <h1 className={styles.slogan}>
              <span className={styles.app_name}>
                Защитите свое животное от потери нашим qr-адресником
              </span>
              <br />
              <span className={styles.slogan_text}>
                Ваше животное, наша безопасность
              </span>
            </h1>
            <p>
              Простая регистрация
              <br></br>
              Быстрое заполнение анкеты
              <br></br>
              Удобный интерфейс
            </p>

            <Button
              variant="contained"
              sx={{ bgcolor: "#ED7D31", height: 60, width: 200, fontSize: 20 }}
              endIcon={<ShopIcon />}
            >
              Приобрести
            </Button>
          </div>
        </div>
        <div className={styles.pet_img_main_section}>
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
          <div className={styles.statistics}>
            <p className={styles.how_it_work_text}>
              Защити свое животное!<br></br>
              Сканируй qr код и получи информацию о владельце
              <br></br>
              <a href="#" className={styles.link_instagram}>
                Наш инстаграм <FontAwesomeIcon icon={faInstagram} />
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
