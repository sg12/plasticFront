import { useEffect, useState } from "react";
import { useQuery } from "@siberiacancode/reactuse";
import { useUser } from "../../../context/UserContext";

import PlasticServices from "../../../services/PlasticServices";

import "./ReviewsInfo.scss";

import ReviewsItem from "./reviewsItem/ReviewsItem";
import Filter from "../../UI/filter/Filter";
import Spinner from "../../UI/preloader/Spinner";
import useFilter from "../../../hooks/useFilter";

const ReviewsInfo = () => {
  // TODO: Рефакторить отзывы
  const { userData } = useUser();
  const [reviews, setReviews] = useState([
    {
      id: 0,
      author: {
        id: 0,
        email: "user@example.com",
        username: "Васильев Петр Олегович",
        avatar: "string",
      },
      text: "string",
      rating: 5,
      created_at: "2024-07-11T19:39:22.754Z",
      updated_at: "2024-07-11T19:39:22.754Z",
      reply: {
        id: 0,
        author: {
          id: 0,
          email: "user@example.com",
          username: "string",
          avatar: "string",
        },
        created_at: "2024-07-11T19:39:22.754Z",
        updated_at: "2024-07-11T19:39:22.754Z",
        text: "string",
      },
    },
    {
      id: 1,
      author: {
        id: 0,
        email: "user@example.com",
        username: "Васильев Петр Олегович",
        avatar: "string",
      },
      text: "string",
      rating: 5,
      created_at: "2024-07-11T19:39:22.754Z",
      updated_at: "2024-07-11T19:39:22.754Z",
      reply: {
        id: 0,
        author: {
          id: 0,
          email: "user@example.com",
          username: "string",
          avatar: "string",
        },
        created_at: "2024-07-11T19:39:22.754Z",
        updated_at: "2024-07-11T19:39:22.754Z",
        text: "string",
      },
    },
  ]);

  // const { isLoading, isError, isSuccess, error, refetch } = useQuery(
  //   () => PlasticServices.getReviewsClinics(userData?.id),
  //   {
  //     keys: [userData?.id],
  //     onSuccess: (data) => {
  //       setReviews(Array.isArray(data) ? data : []);
  //     },
  //   }
  // );

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

  return (
    <div className="reviews">
      <span className="reviews__title">Мои отзывы</span>

      {/* {isLoading ? (
        <Spinner />
      ) : isError ? (
        <div>Ошибка: {error.message}</div>
      ) : reviews?.length === 0 ? (
        <span className="support__subtitle">Нет отзывов</span>
      ) : isSuccess ? (
        <>
        */}
      <div className="reviews__list">
        {reviews?.map((review, index) => (
          <ReviewsItem
            key={index}
            data={review}
            onSave={(updatedText) => handleSave(review.id, updatedText)}
            onCancel={() => handleCancel(review.id)}
          />
        ))}
      </div>
      {/* </>
      ) : null} */}
    </div>
  );
};

export default ReviewsInfo;
