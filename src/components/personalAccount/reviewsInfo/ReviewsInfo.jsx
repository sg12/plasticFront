import { useUser } from "../../../context/UserContext";
import ReviewsItem from "../reviewsItem/ReviewsItem";
import "./ReviewsInfo.scss";

const ReviewsInfo = () => {
  const { userData, userType } = useUser();

  return (
    <div className="reviews__info">
      <span className="reviews__title">Мои отзывы</span>
      {/* Добавить кнопки сортировки - врач и клиника */}
      <ReviewsItem /> 
    </div>
  );
};

export default ReviewsInfo;
