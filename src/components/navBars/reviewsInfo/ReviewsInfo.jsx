import ReviewsItem from "../reviewsItem/ReviewsItem";
import "./ReviewsInfo.scss";
import ProfileServices from "../../../services/ProfileServices";

const ReviewsInfo = () => {

    const userData = ProfileServices.getUsers();
    console.log(userData);

  return (
    <div>
      <span>Мои отзывы</span>
      {/* Добавить кнопки сортировки - врач и клиника */}
      <ReviewsItem

      />
    </div>
  );
};

export default ReviewsInfo;
