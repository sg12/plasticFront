import React, { useState } from 'react';
import { FaStar } from "react-icons/fa";

const Stars = ({ totalStars, onChange }) => {
  const [selectedStars, setSelectedStars] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleStarClick = (index) => {
    setSelectedStars(index + 1);
    onChange(index + 1);
  };

  const handleStarHover = (index) => {
    setHoveredStar(index + 1);
  };

  const handleStarHoverLeave = () => {
    setHoveredStar(0);
  };

  return (
    <div>
      {[...Array(totalStars)].map((_, index) => (
        <Star
          key={index}
          selected={index < selectedStars}
          hovered={index < hoveredStar}
          onClick={() => handleStarClick(index)}
          onMouseEnter={() => handleStarHover(index)}
          onMouseLeave={handleStarHoverLeave}
        />
      ))}
    </div>
  );
};

const Star = ({ selected, hovered, onClick, onMouseEnter, onMouseLeave }) => (
  <span
    style={{ color: selected || hovered ? 'gold' : 'gray', cursor: 'pointer' }}
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    <FaStar size={30} />
  </span>
);

export default Stars;
