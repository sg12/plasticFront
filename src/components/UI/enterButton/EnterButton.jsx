import React from "react";
import classes from './EnterButton.module.scss'

const EnterButton = ({children, ...props}) => {
    return (
        <button {...props} className={classes.enter__button}>
            {children}
        </button>
    );
};

export default EnterButton;