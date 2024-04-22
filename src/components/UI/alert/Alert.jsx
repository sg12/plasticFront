import PropTypes from "prop-types";
import { useState } from "react";

const Alert = ({ label, icon: Icon, ...props }) => {
  const [visible, setVisible] = useState(true);

  const handleClick = () => {
    setVisible(!visible);
  };

  const styles = {
    alert: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
      border: "1px solid #3066be",
      borderRadius: "8px",
      padding: "8px 8px",
      width: "max-content",
      cursor: "pointer",
    },
    icon: {
      fontSize: "21px",
    },
  };

  return (
    <div onClick={handleClick} {...props} style={styles.alert}>
      {Icon && <Icon style={styles.icon} />}
      {visible && label}
    </div>
  );
};

Alert.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
};

export default Alert;
