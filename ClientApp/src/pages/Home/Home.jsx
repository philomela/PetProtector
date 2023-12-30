import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";

const Home = () => {
  return (
    <>
      <section className={styles.main_section}>
        <div className={styles.slogan_main_section}>
          <div className={styles.slogan_container}>
            <h1 className={styles.slogan}>
              <span className={styles.app_name}>PetProtector</span>
              <img src="/images/pet-protector-logo.png" height={70}></img>
              <br />- Ваше животное, наша безопасность
            </h1>
            <p>Приобретите адресник <br></br>и защитите свое животное от потери</p>
            <button className={styles.button_slogan}>Приобрести</button>
          </div>
        </div>
        <div className={styles.pet_img_main_section}>
          <div className={styles.how_it_work}>
            <h3>Как это работает? </h3>
            <p className={styles.how_it_work_text}>
              -регистация на сайте<br></br>
              -заполнение анкеты <br></br>
              -активация qr адресника<br></br>
             <span className={styles.how_it_work_sacan_text}>Сканируйте qr код и получите информацию о владельце</span>
            </p>
          </div>
        </div>
      </section>
      <section className={styles.marketplaces}></section>
    </>
  );
};

export default Home;
