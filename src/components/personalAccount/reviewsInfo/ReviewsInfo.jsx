import { useEffect, useState } from "react";
import ReviewsItem from "../reviewsItem/ReviewsItem";
import "./ReviewsInfo.scss";
import Filter from "../../UI/filter/Filter";
import { useFetching } from "../../../hooks/useFetching";
import PlasticServices from "../../../services/PlasticServices";
import Spinner from "../../UI/preloader/Spinner";

const ReviewsInfo = () => {
  // Данные отзывов TODO: Подключить запрос на сервер
  const [reviews, setReviews] = useState([]);

  const [fetchReviews, isReviewsLoading, reviewsError] = useFetching(
    async () => {
      const response = await PlasticServices.getReviews();
      return setReviews(response.data);
    }
  );

  useEffect(() => {
    fetchReviews();
  }, []);

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
      {reviewsError}
      {isReviewsLoading ? (
        <Spinner />
      ) : (
        <>
          {reviews.length > 0 && (
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
          )}
        </>
      )}
    </div>
  );
};

export default ReviewsInfo;
