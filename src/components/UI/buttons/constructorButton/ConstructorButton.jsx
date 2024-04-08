import classes from './ConstructorButton.module.scss';

import PropTypes from 'prop-types';

const ConstructorButton = ({ children, ...props }) => {
	return (
		<button {...props} className={`${classes.ConstructorButton} ${props.className}`} onClick={handleClick}>
			{children}
		</button>
	);
};

ConstructorButton.propTypes = {
	children: PropTypes.string.isRequired,
	className: PropTypes.string,
};

export default ConstructorButton;