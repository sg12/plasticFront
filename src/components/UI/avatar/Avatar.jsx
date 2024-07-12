import React from "react";
import PropTypes from "prop-types";
import styles from "./Avatar.module.scss";

const Avatar = ({ src, icon, size, alt, className }) => {
  return (
    <div
      className={`${styles.avatar} ${className} ${size ? styles[size] : ""}`}
    >
      {src ? (
        <img src={src} alt={alt} className={styles.avatar__image} />
      ) : (
        <span className={`${styles.avatar__icon} ${size ? styles[size] : ""}`}>
          {icon}
        </span>
      )}
    </div>
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.elementType, PropTypes.any]).isRequired,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  alt: PropTypes.string,
  className: PropTypes.string,
};

Avatar.defaultProps = {
  size: "medium",
  alt: "",
  className: "",
};

export default Avatar;
