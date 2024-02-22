import classes from './FieldButton.module.scss';

import PropTypes from 'prop-types';

const FieldButton = ({ children, ...props }) => {
	return (
		<button {...props} className={`${classes.enter__button} ${props.className}`}>
			{children}
		</button>
	);
};

FieldButton.propTypes = {
	children: PropTypes.string.isRequired,
	className: PropTypes.string,
};

export default FieldButton;