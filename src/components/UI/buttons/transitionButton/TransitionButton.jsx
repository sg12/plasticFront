import classes from './TransitionButton.module.scss';

import PropTypes from 'prop-types';

import transition from '../../../../assets/icons/transition.svg';

const TransitionButton = ({ children, ...props }) => {
	return (
		<div {...props} className={`${classes.TransitionButton} ${props.className}`}>
			<button className={classes.TransitionButton__img}>
				<img src={transition} alt="переход" />
			</button>
			<div className={classes.TransitionButton__number}>
				{children}
			</div>
		</div>
	);
};

TransitionButton.propTypes = {
	children: PropTypes.string.isRequired,
	className: PropTypes.string,
};

export default TransitionButton;