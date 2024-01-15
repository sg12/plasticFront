import React from "react";

const CurrentTime = ({ date }) => {
  const currentDate = new Date(date);

  const formattedDate = () => {
    return `${currentDate.getDate().toString().padStart(2, "0")}.${(currentDate.getMonth() + 1).toString().padStart(2, "0")}.${currentDate.getFullYear()}
    ${currentDate.getHours().toString().padStart(2, "0")}:${currentDate.getMinutes().toString().padStart(2, "0")}:${currentDate.getSeconds().toString().padStart(2, "0")}`;
  };

  return <span>{formattedDate()}</span>;
};

export default CurrentTime;
