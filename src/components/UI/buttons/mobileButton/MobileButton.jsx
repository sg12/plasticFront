import classes from './MobileButton.module.scss';

import PropTypes from 'prop-types';

const MobileButton = ({ children, ...props }) => {
	return (
		<button {...props} className={`${classes.mobileButton} ${props.className}`}>
			{children}
		</button>
	);
};

MobileButton.propTypes = {
	children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]).isRequired,
	className: PropTypes.string,
};

export default MobileButton;