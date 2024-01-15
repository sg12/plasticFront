import classes from './WhiteButton.module.scss';

const WhiteButton = ({children, ...props}) => {
    return (
        <button {...props} className={classes.licenseButton}>
            {children}
        </button>
    );
};

export default WhiteButton;