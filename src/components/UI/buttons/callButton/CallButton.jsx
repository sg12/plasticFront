import classes from './CallButton.module.scss';

import PropTypes from 'prop-types';

import telephone from '../../../../assets/icons/telephone.svg';

const CallButton = ({ children, ...props }) => {
	return (
		<div {...props} className={`${classes.callBtn} ${props.className}`}>
			<button className={classes.callBtn__img}>
				<img src={telephone} alt="телефон" />
			</button>
			<div className={classes.callBtn__number}>
				{children}
			</div>
		</div>
	);
};

CallButton.propTypes = {
	children: PropTypes.string.isRequired,
	className: PropTypes.string.isRequired,
};

export default CallButton;