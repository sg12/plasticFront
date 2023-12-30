import classes from './LikeButton.module.scss';

const LikeButton = ({ ...props }) => {
	return (
		<button {...props} className={classes.likeBtn}></button>
	);
};

export default LikeButton;