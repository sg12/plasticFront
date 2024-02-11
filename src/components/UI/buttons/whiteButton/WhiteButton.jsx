import classes from './WhiteButton.module.scss';

import PropTypes from 'prop-types';

const WhiteButton = ({children, ...props}) => {
    return (
        <button {...props} className={classes.licenseButton}>
            {children}
        </button>
    );
};

WhiteButton.propTypes = {
	children: PropTypes.string.isRequired,
};

export default WhiteButton;