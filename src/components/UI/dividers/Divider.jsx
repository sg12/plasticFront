const Divider = ({ color, thickness, margin, opacity }) => {
  const style = {
    backgroundColor: color || "#3066be",
    width: "100%",
    height: thickness || 1,
    margin: margin || 0,
    opacity: opacity || .25,
  };

  return <div style={style} />;
};

export default Divider;
