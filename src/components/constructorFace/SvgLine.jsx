const SvgLine = ({
  svgClassNames,
  pathClassNames,
  stroke,
  strokeOpacity,
  strokeDasharray,
  width,
  height,
  viewBox,
  pathD
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox={viewBox}
    fill="none"
    className={svgClassNames}
  >
    <path
      className={pathClassNames}
      d={pathD}
      strokeLinecap="round"
      stroke={stroke}
      strokeDasharray={strokeDasharray}
      strokeOpacity={strokeOpacity}
    />
  </svg>
);

export default SvgLine;
