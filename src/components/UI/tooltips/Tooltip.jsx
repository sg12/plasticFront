import React, { useState, useRef, useEffect } from "react";

const Tooltip = ({ children, text, position }) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef();

  useEffect(() => {
    if (isVisible) {
      tooltipRef.current.style.opacity = 1;
      tooltipRef.current.style.visibility = "visible";
    } else {
      tooltipRef.current.style.opacity = 0;
      tooltipRef.current.style.visibility = "hidden";
    }
  }, [isVisible]);

  const showTooltip = () => {
    setIsVisible(true);
  };

  const hideTooltip = () => {
    setIsVisible(false);
  };

  // Определение стилей на основе выбранной позиции
  const getTooltipStyles = () => {
    let styles = {
      fontSize: "12px",
      position: "absolute",
      padding: "4px 8px",
      color: "white",
      background: "black",
      borderRadius: "4px",
      transition: "opacity 0.3s ease, visibility 0.3s ease",
      whiteSpace: "nowrap",
      zIndex: 1000,
      opacity: 0,
      visibility: "hidden",
    };

    switch (position) {
      case "top":
        styles = {
          ...styles,
          bottom: `100%`,
          left: "50%",
          transform: "translateX(-50%) translateY(-4px)",
        };
        break;
      case "bottom":
        styles = {
          ...styles,
          top: `100%`,
          left: "50%",
          transform: "translateX(-50%) translateY(4px)",
        };
        break;
      case "left":
        styles = {
          ...styles,
          right: `100%`,
          top: "50%",
          transform: "translateX(-4px) translateY(-50%)",
        };
        break;
      case "right":
        styles = {
          ...styles,
          left: `100%`,
          top: "50%",
          transform: "translateX(4px) translateY(-50%)",
        };
        break;
      default:
        break;
    }

    return styles;
  };

  return (
    <div
      style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      <div style={getTooltipStyles()} ref={tooltipRef}>
        {text}
      </div>
    </div>
  );
};

export default Tooltip;
