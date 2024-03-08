import "./ConstructorComp.scss";

import { useState } from "react";

import ConstructorFace from "../constructorFace/ConstructorFace";
import ConstructorFilter from "../constructorFilter/ConstructorFilter";
import AboutOperation from "../aboutOperation/AboutOperation";

const ConstructorComp = () => {
	const [activeLine, setActiveLine] = useState(null);

	return (
		<div>
			<h1 className="head">Не бойся меняться!</h1>
			<ConstructorFilter />
			<ConstructorFace activeLine={activeLine} setActiveLine={setActiveLine} />
			<AboutOperation activeLine={activeLine} />
		</div>
	);
};

export default ConstructorComp;
