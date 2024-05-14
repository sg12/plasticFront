import "./Slides.scss";

import PropTypes from "prop-types"; // Добавляем импорт PropTypes

import { Link } from 'react-router-dom';

const Slides = ({ data }) => {
	const { text, aiText, buttonText, backgroundImage } = data;

	return (
		// <div className={`slide_${data.id}`} style={{ backgroundImage: backgroundImage }}>
		<div className="slide" style={{ backgroundImage: backgroundImage }}>
			<div className="slide__container container">
				<div className="slide__info title-h2">
					<p>{text}</p>
				</div>
				<div className="AI-text title-h3">
					<p>{aiText}</p>
				</div>
				<Link to={'constructor'} className="button-item">
					{/* <div className="button-item" id="button-slide"> */}
					<p>{buttonText}</p>
					{/* </div> */}
				</Link>
			</div>
		</div>
	);
};


Slides.propTypes = {
	data: PropTypes.shape({
		text: PropTypes.string.isRequired,
		aiText: PropTypes.string.isRequired,
		buttonText: PropTypes.string.isRequired,
		backgroundImage: PropTypes.string.isRequired,
	}).isRequired,
};

export default Slides;
