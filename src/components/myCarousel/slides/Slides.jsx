
import {Link} from 'react-router-dom';
import PropTypes from "prop-types"; // Добавляем импорт PropTypes

import "./Slides.scss";

const Slides = ({ data }) => {
    const { text, aiText, buttonText, backgroundImage, id } = data;

    return (
        // <div className={`slide_${data.id}`} style={{ backgroundImage: backgroundImage }}>
            <div className="slide" style={{ backgroundImage: backgroundImage }}>
            <div className="slide__info title-h2">
                <p>{text}</p>
            </div>
            <div className="AI_text title-h3">
                <p>{aiText}</p>
            </div>
            <div className="button_item" id="button_slide">
                <Link to={'constructor'}>
                    <p>{buttonText}</p>
				</Link>
            </div>
        </div>
    );
};

// PropTypes для проверки типов свойств
Slides.propTypes = {
    data: PropTypes.shape({
        text: PropTypes.string.isRequired,
        aiText: PropTypes.string.isRequired,
        buttonText: PropTypes.string.isRequired,
        backgroundImage: PropTypes.string.isRequired,
    }).isRequired,
};

export default Slides;
