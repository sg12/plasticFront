import React, { useState } from 'react';
import styles from './UserGuide.module.scss';

const UserGuide = () => {
  const [step, setStep] = useState(1);

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const renderGuideContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2>Добро пожаловать в наше приложение!</h2>
            <p>Этот гид поможет вам освоить основные функции.</p>
          </>
        );
      case 2:
        return (
          <>
            <h3>1. Создание поста</h3>
            <p>Нажмите на кнопку "Создать пост" для добавления нового контента.</p>
          </>
        );
      case 3:
        return (
          <>
            <h3>2. Личный кабинет</h3>
            <p>Перейдите в свой личный кабинет, нажав на своё имя или аватар.</p>
          </>
        );
      // Добавьте дополнительные шаги, если необходимо
      default:
        return null;
    }
  };

  return (
    <div className={styles.guide__cont}>
      <div className={styles.guide__overlay}></div>
      <div className={styles.guide__container}>
        <div className={styles.guide__wrapper}>
          <div className={styles.guide__content}>
            {renderGuideContent()}
            <button onClick={handleNextStep}>Следующий шаг</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGuide;
