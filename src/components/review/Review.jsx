import classes from './Review.module.scss';

// import PropTypes from 'prop-types';

import star from '../../assets/icons/star.png';

const Review = ({ ...props }) => {
	return (
		<div {...props} className={classes.review}>
			<div className={classes.review__box}>
				<img className={classes.review__img} src={star} alt="оценка" />
				<p>3,1/5,0</p>
			</div>
			<a href='#' className={classes.review__a}>12 отзыва</a>
		</div>
	);
};

export default Review;