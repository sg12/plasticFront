import React from "react";

const RenderStar = (rating) => {
  const starsTotal = 5;
  const fullStars = Math.floor(rating);
  const halfStars = Math.ceil(rating - fullStars);
  const emptyStars = starsTotal - fullStars - halfStars;

  const stars = [];

  // Полная звёздочка
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <svg
        key={i}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="#FF6767"
        strokeLinejoin="round"
        strokeWidth="80"
      >
        <path d="M12 2l3.09 6.31L22 9.36l-5.05 5.06 1.18 6.85L12 18.77l-6.13 3.49 1.18-6.85L2 9.36l6.91-1.05z" />
      </svg>
    );
  }

  // Половина звёздочки
  if (halfStars) {
    stars.push(
      <svg
        key="half"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="#FF6767"
        strokeLinejoin="round"
        strokeWidth="80"
      >
        <path d="M12 2l3.09 6.31L22 9.36l-5.05 5.06 1.18 6.85L12 18.77l-6.13 3.49 1.18-6.85L2 9.36l6.91-1.05z" />
      </svg>
    );
  }

  // Пустая звёздочка
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <svg
        key={starsTotal - i}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="#C4C4C4"
        strokeLinejoin="round"
        strokeWidth="80"
      >
        <path d="M12 2l3.09 6.31L22 9.36l-5.05 5.06 1.18 6.85L12 18.77l-6.13 3.49 1.18-6.85L2 9.36l6.91-1.05z" />
      </svg>
    );
  }

  return stars;
};


export default RenderStar;