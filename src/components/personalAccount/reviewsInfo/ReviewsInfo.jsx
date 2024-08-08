import { useState } from "react";
import { useUser } from "../../../context/UserContext";

import PlasticServices from "../../../services/PlasticServices";

import "./ReviewsInfo.scss";

import ReviewsItem from "./reviewsItem/ReviewsItem";
import Spinner from "../../UI/preloader/Spinner";
import { useQuery } from "@siberiacancode/reactuse";

const ReviewsInfo = () => {
  // FIXME: Добавить edit, save, cancel, когда будут готовы отзывы на стороне главной страницы
  const { userData } = useUser();

  const {
    data: reviews,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useQuery(() => PlasticServices.getReviews(userData?.role, userData?.id), {
    keys: [userData?.role, userData?.id],
  });

  // const handleSave = (id, updatedText) => {
  //   setReviews((prevReviews) =>
  //     prevReviews.map((review) =>
  //       review.id === id ? { ...review, message: updatedText } : review
  //     )
  //   );
  //   console.log(`Отзыв сохранён с id ${id} и текстом "${updatedText}"`);
  // };

  // const handleCancel = (id) => {
  //   console.log(`Редактирование отзыва с id ${id} отменено`);
  // };

  return (
    <div className="reviews">
      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <div>Ошибка: {error.message}</div>
      ) : reviews?.data?.length === 0 ? (
        <span className="support__subtitle">Нет отзывов</span>
      ) : isSuccess ? (
        <>
          <div className="reviews__list">
            {reviews?.data?.map((review, index) => (
              <ReviewsItem
                key={index}
                data={review}
                // onSave={(updatedText) => handleSave(review.id, updatedText)}
                // onCancel={() => handleCancel(review.id)}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default ReviewsInfo;
