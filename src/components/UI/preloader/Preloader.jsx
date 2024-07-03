import React, { useState, useEffect, useRef } from "react";
import styles from "./Preloader.module.scss";
import Spinner from "./Spinner";

const Preloader = ({ isDataLoaded, isLoading }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [errorMessage, setErrorMessage] = useState();
  const preloaderRef = useRef();

  useEffect(() => {
    if (isDataLoaded) {
      // Плавное затухание прелоадера
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 2000); // Задержка перед скрытием прелоадера

      // Очищаем таймер при размонтировании компонента или при изменении isDataLoaded
      return () => clearTimeout(timer);
    }
    if (!isDataLoaded && !isLoading) {
      setErrorMessage("Личный кабинет временно недоступен. Попробуйте позже");
    }
  }, [isDataLoaded, isLoading]);

  useEffect(() => {
    if (!isVisible) {
      // Удаляем прелоадер после затухания
      const preloader = preloaderRef.current;
      if (preloader) {
        preloader.addEventListener("transitionend", () => {
          preloader.remove();
        });
      }
    }
  }, [isVisible]);

  return (
    <div
      ref={preloaderRef}
      className={`${styles.loader} ${isVisible ? styles.show : styles.hide}`}
    >
      {errorMessage ? (
        <div className={styles.errorMessage}>{errorMessage}</div>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default Preloader;
