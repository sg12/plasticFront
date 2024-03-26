import classes from './LikeButton.module.scss';

import PropTypes from 'prop-types';

import { useState } from 'react';

const LikeButton = ({ ...props }) => {

	const [isFilled, setIsFilled] = useState(false);

	const handleClick = () => {
		setIsFilled(!isFilled);
	};

	return (
		<button {...props} className={`${classes.likeBtn} ${props.className} ${isFilled ? classes.likeBtn__active : ''}`} onClick={handleClick}>
			<svg className={classes.likeBtn__img} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 26">
				<path d="M14.1428 4.41498L15 5.84184L15.8572 4.41498C17.1167 2.31854 19.3217 1 21.8182 1C25.7124 1 29 4.39726 29 8.66667C29 10.5493 28.181 12.5165 26.8341 14.462C25.4931 16.399 23.6852 18.2328 21.8451 19.8276C20.0093 21.4186 18.1688 22.7483 16.7848 23.6812C16.0937 24.147 15.5188 24.5124 15.1182 24.7604C15.0776 24.7855 15.0389 24.8094 15.002 24.8321C14.9647 24.809 14.9255 24.7847 14.8846 24.7592C14.4838 24.5093 13.9087 24.1413 13.2175 23.6726C11.8331 22.7339 9.99222 21.3973 8.15597 19.8015C6.3153 18.2018 4.5069 16.3653 3.1655 14.4309C1.81768 12.4873 1 10.5297 1 8.66667C1 4.39726 4.28756 1 8.18182 1C10.6783 1 12.8833 2.31854 14.1428 4.41498Z" />
			</svg>
		</button>
	);
};

LikeButton.propTypes = {
	className: PropTypes.string,
};

export default LikeButton;