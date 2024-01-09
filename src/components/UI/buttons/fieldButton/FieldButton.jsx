import classes from './FieldButton.module.scss';

const FieldButton = ({children, ...props}) => {
    return (
        <button {...props} className={classes.enter__button}>
            {children}
        </button>
    );
};

export default FieldButton;