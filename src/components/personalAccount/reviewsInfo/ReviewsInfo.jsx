import { useState } from "react";
import { useQuery } from "@siberiacancode/reactuse";
import { useUser } from "../../../context/UserContext";

import PlasticServices from "../../../services/PlasticServices";

import "./ReviewsInfo.scss";

import ReviewsItem from "../reviewsItem/ReviewsItem";
import Filter from "../../UI/filter/Filter";
import Spinner from "../../UI/preloader/Spinner";

const ReviewsInfo = () => {
  const { userData } = useUser();
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState("all");

  const { isLoading, isError, isSuccess, error, refetch } = useQuery(
    () => PlasticServices.getReviewsClinics(userData?.id),
    {
      keys: [userData?.id],
      onSuccess: (data) => {
        setReviews(Array.isArray(data) ? data : []);
      },
    }
  );

  // Фильтры для выбора типа пользователя
  const userTypeFilters = [
    { value: "all", name: "Все" },
    { value: "Клиника", name: "Клиника" },
    { value: "Пациент", name: "Пациент" },
    { value: "Доктор", name: "Доктор" },
  ];

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
      : reviews?.filter((review) => review.userType === filter);

  return (
    <div className="reviews__info">
      <span className="reviews__title">Мои отзывы</span>

      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <div>Ошибка: {error.message}</div>
      ) : reviews?.length === 0 ? (
        <span className="support__subtitle">Нет отзывов</span>
      ) : isSuccess ? (
        <>
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
        </>
      ) : null}
    </div>
  );
};

export default ReviewsInfo;
