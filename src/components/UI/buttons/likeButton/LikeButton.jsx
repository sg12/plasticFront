import classes from './LikeButton.module.scss';

import { useState } from 'react';

import like from '../../../../assets/icons/like.svg';

const LikeButton = ({ ...props }) => {

	const [isFilled, setIsFilled] = useState(false);

	const handleClick = () => {
		setIsFilled(!isFilled);
	};

	return (
		<button {...props} className={classes.likeBtn + ' ' + (isFilled ? classes.likeBtn__active : '')} onClick={handleClick}>
			<img className={classes.likeBtn__img} src={like} alt="избранное" />
		</button>
	);
};

export default LikeButton;