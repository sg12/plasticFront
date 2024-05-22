import PropTypes from "prop-types";
import { CiSquarePlus } from "react-icons/ci";
import styles from "./AddCard.module.scss";

const AddCard = ({ onClick }) => {
  return (
    <div onClick={onClick} className={styles.add}>
      <CiSquarePlus className={styles.add__icon} />
    </div>
  );
};

AddCard.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default AddCard;
