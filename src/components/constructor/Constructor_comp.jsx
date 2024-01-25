import { useState } from "react";
import ConstructorFace from "../constructorFace/ConstructorFace";
import ConstructorFilter from "../constructorFilter/ConstructorFilter";
import "./Construcror_comp.scss";

const Constructor = () => {
  const [activeLine, setActiveLine] = useState(null);

  return (
    <div>
      <h1>Страница конструктора</h1>
      <ConstructorFilter />
      <ConstructorFace activeLine={activeLine} setActiveLine={setActiveLine} />
    </div>
  );
};

export default Constructor;
