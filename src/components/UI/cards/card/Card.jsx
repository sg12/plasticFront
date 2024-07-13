import React from "react";
import PropTypes from "prop-types";
import styles from "./Card.module.scss";
import Avatar from "../../avatar/Avatar";

const Card = ({
  avatarImage,
  title,
  subtitle,
  avatarIcon,
  onSelect,
  isSelected,
  actions,
  className,
  style,
  ...props
}) => {
  return (
    <div
      className={`${styles.card} ${
        isSelected ? styles.card__active : ""
      } ${className}`}
      style={style}
      onClick={onSelect}
      {...props}
    >
      {avatarImage ?? (
        <Avatar
          src={avatarImage}
          alt={title}
          size={"medium"}
          icon={avatarIcon}
        />
      )}
      <div className={styles.card__info}>
        <span className={styles.card__title}>{title || "Title"}</span>
        <span className={styles.card__subtitle}>{subtitle || "Subtitle"}</span>
      </div>
      <div className={styles.card_actions}>{actions}</div>
    </div>
  );
};

Card.propTypes = {
  avatarImage: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  avatarIcon: PropTypes.element.isRequired,
  onSelect: PropTypes.func,
  isSelected: PropTypes.bool,
  actions: PropTypes.element,
  className: PropTypes.string,
  style: PropTypes.object,
};

Card.defaultProps = {
  avatarImage: null,
  subtitle: "",
  isSelected: false,
  actions: null,
};

export default Card;
