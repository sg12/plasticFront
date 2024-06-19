import "./Slides.scss";
import image1 from "../../assets/imgs/image_44.png";
import { Link } from 'react-router-dom';

const slidesData = [
	{
		text: "СОМНЕВАЕТЕСЬ, ЧТО ПОТРАТИТЕ ДЕНЬГИ И НЕ ПОНРАВИТСЯ НОВАЯ ВНЕШНОСТЬ?",
		aiText: "Искусственный интеллект поможет Вам, просто загрузите свою фотографию и посмотрите на нового себя!",
		buttonText: "ПОПРОБОВАТЬ",
		backgroundImage: `url(${image1})`,
	},
];

const Slides = () => {
	const slide = slidesData[0];

	return (
		<div className="slide" style={{ backgroundImage: slide.backgroundImage }}>
			<div className="slide__container container">
				<div className="slide__info title-h2">
					<p>{slide.text}</p>
				</div>
				<div className="AI-text title-h3">
					<p>{slide.aiText}</p>
				</div>
				<Link to={'/constructor'} className="button-item">
					<p>{slide.buttonText}</p>
				</Link>
			</div>
		</div>
	);
};

export default Slides;
