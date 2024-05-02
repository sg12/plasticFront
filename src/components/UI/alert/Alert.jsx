import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const Alert = ({ label, icon: Icon, ...props }) => {
  const [visible, setVisible] = useState(true);

  const handleClick = () => {
    setVisible(!visible);
  };

  useEffect(() => {
    const handleResize = () => {
      if (!visible) {
        setTimeout(() => {
          setVisible(true);
        }, 300); 
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [visible]);

  const styles = {
    alert: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
      border: "1px solid #3066be",
      borderRadius: "8px",
      padding: "8px 8px",
      width: visible ? "auto" : "39px",
      cursor: "pointer",
      transition: "width 0.3s ease",
      overflow: "hidden",
    },
    icon: {
      fontSize: "21px",
      color:"#3066be",
      flexShrink: 0,
    },
    label: {
      maxWidth: visible ? "100%" : "39px",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      transition: "max-width 0.3s ease",
    },
  };

  return (
    <div onClick={handleClick} {...props} style={styles.alert}>
      {Icon && <Icon style={styles.icon} />}
      <span style={styles.label}>{label} </span>
    </div>
  );
};

Alert.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
};

export default Alert;
