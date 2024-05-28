import "./ConstructorComp.scss";

import { useState } from "react";

import ConstructorFace from "../constructorFace/ConstructorFace";
import ConstructorFilter from "../constructorFilter/ConstructorFilter";
import AboutOperation from "../aboutOperation/AboutOperation";

const ConstructorComp = () => {
	const [activeLine, setActiveLine] = useState(null);
	const [activeFace, setActiveFace] = useState('woman');
  	const [activeFaceStyle, setActiveFaceStyle] = useState('european');
	return (
		<div className="constructor">
			<h1 className="head" id='constructor'>Не бойся меняться!</h1>
			{/* <ConstructorFilter /> */}
			<ConstructorFace activeLine={activeLine} setActiveLine={setActiveLine} setActiveFace={setActiveFace} activeFace={activeFace} activeFaceStyle={activeFaceStyle} setActiveFaceStyle={setActiveFaceStyle}/>
			{/* <AboutOperation activeLine={activeLine} /> */}
		</div>
	);
};

export default ConstructorComp;
