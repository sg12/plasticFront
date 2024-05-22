import classes from './OutlineButton.module.scss';

import PropTypes from 'prop-types';

const OutlineButton = ({ children, ...props }) => {
	return (
		<button {...props} className={`${classes.outlineButton} ${props.className}`}>
			{children}
		</button>
	);
};

OutlineButton.propTypes = {
	children: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	className: PropTypes.string,
};

export default OutlineButton;