import PropTypes from "prop-types";

const Tag = ({ label, size = "default", ...props }) => {
  const tagStyle = {
    ...styles.tag,
    ...styles.size[size],
  };
  return (
    <div {...props} style={tagStyle}>
      {label}
    </div>
  );
};

const styles = {
  tag: {
    display: "inline-block",
    backgroundColor: "#5985cb",
    color: "#fff",
    borderRadius: "4px",
    fontSize: "12px",
    padding: "4px 8px",
    cursor: "default",
  },
  size: {
    default: {
      fontSize: "12px",
      padding: "4px 8px",
    },
    medium: {
      fontSize: "14px",
      padding: "6px 12px",
    },
    large: {
      fontSize: "16px",
      padding: "8px 16px",
    },
  },
};

Tag.propTypes = {
  label: PropTypes.string.isRequired,
  size: PropTypes.oneOf(["default", "medium", "large"]),
};

export default Tag;
