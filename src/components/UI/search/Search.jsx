import React from "react";

import classes from "../search/Search.module.css";

const Search = ({ children, ...props }) => {
  return (
    <input
      type="search"
      name="doctor"
      placeholder="Поиск"
      value={children}
      {...props}
      className={classes.search}
    />
  );
};

export default Search;

// import React from "react";
// import classes from './MyButton.module.css'

// const MyButton = ({children, ...props}) => {
//     return (
//         <button {...props} className={classes.myBtn}>
//             {children}
//         </button>
//     );
// };

// export default MyButton;
