import "./ConstructorComp.scss";

import { useState } from "react";

import ConstructorFace from "../constructorFace/ConstructorFace";

const ConstructorComp = () => {
  const [activeLine, setActiveLine] = useState(null);
  const [activeFace, setActiveFace] = useState("woman");
  const [activeFaceStyle, setActiveFaceStyle] = useState("european");
  return (
    <section className="constructor">
      <h1 className="head">Не бойся меняться!</h1>
      <ConstructorFace
        activeLine={activeLine}
        setActiveLine={setActiveLine}
        setActiveFace={setActiveFace}
        activeFace={activeFace}
        activeFaceStyle={activeFaceStyle}
        setActiveFaceStyle={setActiveFaceStyle}
      />
    </section>
  );
};

export default ConstructorComp;
