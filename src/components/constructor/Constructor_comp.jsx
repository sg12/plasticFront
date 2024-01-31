import { useState } from "react";
import ConstructorFace from "../constructorFace/ConstructorFace";
import ConstructorFilter from "../constructorFilter/ConstructorFilter";
import About_operation from "../about_operation/about_operation";
import "./Construcror_comp.scss";

const Constructor = () => {
  const [activeLine, setActiveLine] = useState(null);

  return (
    <div>
      <h1>Не бойся меняться!</h1>
      <ConstructorFilter />
      <ConstructorFace activeLine={activeLine} setActiveLine={setActiveLine} />
      {/* <About_operation activeLine={activeLine}/> */}
    </div>
  );
};

export default Constructor;
