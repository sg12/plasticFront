import classes from './WhiteButton.module.scss';

import PropTypes from 'prop-types';

const WhiteButton = ({ children, ...props }) => {
	return (
		<button {...props} className={`${classes.licenseButton} ${props.className}`}>
			{children}
		</button>
	);
};

WhiteButton.propTypes = {
	children: PropTypes.string.isRequired,
	className: PropTypes.string,
};

export default WhiteButton;