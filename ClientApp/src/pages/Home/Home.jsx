import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome/index";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const Home = () => {
  return (
    <>
      <section className={styles.main_section}>
        <div className={styles.slogan_main_section}>
          <div className={styles.slogan_container}>
            <h1 className={styles.slogan}>
              <span className={styles.app_name}>PetProtector</span>
              <img src="/images/pet-protector-logo1.png" height={70}></img>
              <br />
              <span className={styles.slogan_text}>
                Ваше животное, наша безопасность
              </span>
            </h1>
            <p>
              Приобретите qr-адресник <br></br>и защитите свое животное от
              потери
            </p>
            <button className={styles.button_slogan}>
              Приобрести <FontAwesomeIcon icon={faShoppingBag} />
            </button>
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
            dynamicHeight={true}
          >
            <div className={styles.carousel_slide}>
              <img src="/images/corousel1.jpg" alt="Slideshow Image 1" />
            </div>
            <div className={styles.carousel_slide}>
              <img src="/images/corousel2.jpg" alt="Slideshow Image 2" />
            </div>
            <div className={styles.carousel_slide}>
              <img src="/images/corousel3.jpg" alt="Slideshow Image 3" />
            </div>
            <div className={styles.carousel_slide}>
              <img src="/images/corousel4.jpg" alt="Slideshow Image 4" />
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
