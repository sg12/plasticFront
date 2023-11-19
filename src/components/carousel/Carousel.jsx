import { Component } from "react";
import Carousel from "react-simply-carousel";
import "./carousel.scss";
import Slides from "./slides/Slides";
import image1 from "../../assets/imgs/image_44.png";
import image2 from "../../assets/imgs/image44.png";

class Courusel extends Component {
    state = {
        activeSlideIndex: 0,
    };

    setActiveSlideIndex = (newActiveSlideIndex) => {
        this.setState({
            activeSlideIndex: newActiveSlideIndex,
        });
    };

    render() {
        const slidesData = [
            {
                id: 1,
                text:
                    "СОМНЕВАЕТЕСЬ, ЧТО ПОТРАТИТЕ ДЕНЬГИ И НЕ ПОНРАВИТЬСЯ НОВАЯ ВНЕШНОСТЬ?",
                aiText:
                    "Искусственный интеллект поможет Вам, просто загрузите свою фотографию и посмотрите на нового себя!",
                buttonText: "ПОПРОБОВАТЬ",
                backgroundImage: `url(${image1})`,
            },
            {
                id: 2,
                text:
                    "СОМНЕВАЕТЕСЬ, ЧТО ПОТРАТИТЕ ДЕНЬГИ И НЕ ПОНРАВИТЬСЯ НОВАЯ ВНЕШНОСТЬ?",
                aiText:
                    "Искусственный интеллект поможет Вам, просто загрузите свою фотографию и посмотрите на нового себя!",
                buttonText: "ПОПРОБОВАТЬ",
                backgroundImage: `url(${image2})`,
            },
            {
                id: 3,
                text:
                    "СОМНЕВАЕТЕСЬ, ЧТО ПОТРАТИТЕ ДЕНЬГИ И НЕ ПОНРАВИТЬСЯ НОВАЯ ВНЕШНОСТЬ?",
                aiText:
                    "Искусственный интеллект поможет Вам, просто загрузите свою фотографию и посмотрите на нового себя!",
                buttonText: "ПОПРОБОВАТЬ",
                backgroundImage: `url(${image1})`,
            },
        ];

        return (
            <Carousel
                activeSlideIndex={this.state.activeSlideIndex}
                onRequestChange={this.setActiveSlideIndex}
                itemsToShow={1}
                itemsToScroll={1}
                swipeTreshold={80}
                speed={500}
                forwardBtnProps={{
                    style: {
                        display: "none",
                    },
                }}
                backwardBtnProps={{
                    style: {
                        display: "none",
                    },
                }}
                dotsNav={{
                    show: true,
                    itemBtnProps: {
                        style: {
                            height: 14,
                            width: 15,
                            background: "rgba(148, 194, 233, 1)",
                            border: 10,
                            "border-radius": "50%",
                            margin: 4,
                            opacity: 1,
                        },
                    },
                    activeItemBtnProps: {
                        style: {
                            height: 14,
                            width: 15,
                            border: 0,
                            "border-radius": "50%",
                            background: "rgba(75, 100, 189, 1)",
                            margin: 4,
                            opacity: 1,
                        },
                    },
                }}
            >
                {slidesData.map((slide) => (
                    <Slides key={slide.id} data={slide} />
                ))}
            </Carousel>
        );
    }
}

export default Courusel;
