import classes from './CardsInput.module.scss';

const CardsInput = (props) => {
	return (
		<div>
			<input className={classes.input} {...props} />
		</div>
	);
};

export default CardsInput;