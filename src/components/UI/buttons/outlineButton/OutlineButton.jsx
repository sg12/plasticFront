import React from "react";
import classes from './OutlineButton.module.css'

const OutlineButton = ({children, ...props}) => {
    return (
        <button {...props} className={classes.myBtn}>
            {children}
        </button>
    );
};

export default OutlineButton;