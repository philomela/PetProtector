import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";

const Home = () => {
  return (
    <>
      <section className={styles.main_section}>
        <div className={styles.slogan_main_section}>
          <h1 className={styles.slogan}>
            <span className={styles.app_name}>PetProtector</span>
            <img src="/images/pet-protector-logo.png" height={70}></img> <br />-
            Ваше животное, наша безопасность
          </h1>
          <button className={styles.button_slogan}>Приобрести</button>
        </div>
        <div className={styles.pet_img_main_section}>
          
        </div>
      </section>
    </>
  );
};

export default Home;
