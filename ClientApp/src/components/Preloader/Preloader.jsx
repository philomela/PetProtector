import React from 'react';
import styles from "./Preloader.module.css";

const Preloader = () => {
  return (
    <div className={styles.preloader_container}>
      <div className={styles.preloader_spinner}></div>
    </div>
  );
};

export default Preloader;