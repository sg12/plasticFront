import { useState } from "react";
import ReviewsItem from "../reviewsItem/ReviewsItem";
import "./ReviewsInfo.scss";
import Filter from "../../UI/filter/Filter";

const ReviewsInfo = () => {
  // Данные отзывов TODO: Подключить запрос на сервер
  const [reviews, setReviews] = useState([
    {
      id: 1,
      fullName: "Кристал",
      rating: 5,
      userType: "Клиника",
      rusStatus: "Проверено",
      engStatus: "verified",
      date: "10.01.2024",
      message:
        "Пациент прошел все этапы обследования и лечения. Спасибо за посещение!",
    },
    {
      id: 2,
      fullName: "Семенова Ирини Васильева",
      rating: 3,
      userType: "Пациент",
      rusStatus: "Не проверено",
      engStatus: "not verified",
      date: "16.02.2024",
      message:
        "Хочу выразить огромную благодарность Генадию В.В, он сделал сделал меня ещё краше!",
    },
    {
      id: 3,
      fullName: "Тарасов Валентин Фёдорович",
      rating: 4,
      userType: "Доктор",
      rusStatus: "Отклонено",
      engStatus: "rejected",
      date: "05.04.2024",
      message: "Ирина Васильева своевременно прибыла на прием!",
    },
  ]);
  
  // Фильтры для выбора типа пользователя
  const userTypeFilters = [
    { value: "all", name: "Все" },
    { value: "Клиника", name: "Клиника" },
    { value: "Пациент", name: "Пациент" },
    { value: "Доктор", name: "Доктор" },
  ];
  const [filter, setFilter] = useState("all");

  const handleSave = (id, updatedText) => {
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.id === id ? { ...review, message: updatedText } : review
      )
    );
    console.log(`Отзыв сохранён с id ${id} и текстом "${updatedText}"`);
  };

  const handleCancel = (id) => {
    console.log(`Редактирование отзыва с id ${id} отменено`);
  };

  // Функция для обновления фильтра
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  // Фильтрация отзывов
  const filteredReviews =
    filter === "all"
      ? reviews
      : reviews.filter((review) => review.userType === filter);

  return (
    <div className="reviews__info">
      <span className="reviews__title">Мои отзывы</span>
      <Filter
        filter={filter}
        onFilterChange={handleFilterChange}
        filters={userTypeFilters}
      />
      <div className="reviews__list">
        {filteredReviews?.map((review) => (
          <ReviewsItem
            key={review.id}
            date={review.date}
            rating={review.rating}
            userType={review.userType}
            engStatus={review.engStatus}
            rusStatus={review.rusStatus}
            name={review.fullName}
            text={review.message}
            onSave={(updatedText) => handleSave(review.id, updatedText)}
            onCancel={() => handleCancel(review.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ReviewsInfo;
