import PropTypes from "prop-types";
import classes from "./Review.module.scss";
import star from "../../assets/icons/star.png";

const Review = ({ rating, reviewCount, ...props }) => {
  const formattedRating = rating?.toFixed(1);

  return (
    <div {...props} className={classes.review}>
      <div className={classes.review__box}>
        <img
          className={classes.review__img}
          src={star}
          alt={`${formattedRating}/5.0`}
        />
        <span>{formattedRating}/5.0</span>
      </div>
      <a
        href="#"
        className={classes.review__a}
        aria-label={`Read all ${reviewCount} reviews`}
      >
        {reviewCount} {reviewCount === 1 ? "отзыв" : "отзыва"}
      </a>
    </div>
  );
};

Review.propTypes = {
  rating: PropTypes.number.isRequired,
  reviewCount: PropTypes.number.isRequired,
};

export default Review;
