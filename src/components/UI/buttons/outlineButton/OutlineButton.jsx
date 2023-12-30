import classes from './OutlineButton.module.scss';

import PropTypes from 'prop-types';

const OutlineButton = ({ children, ...props }) => {
	return (
		<button {...props} className={classes.outlineButton}>
			{children}
		</button>
	);
};

OutlineButton.propTypes = {
	children: PropTypes.string.isRequired,
};

export default OutlineButton;