import React, { Component } from "react";
import Carousel from "react-simply-carousel";
import "./MyCarousel.scss";
import Slides from "./slides/Slides";
import image1 from "../../assets/imgs/image_44.png";
import image2 from "../../assets/imgs/image44.png";

class MyCarousel extends Component {
	state = {
		activeSlideIndex: 0,
	};

	slidesData = [
		{
			id: 1,
			text:
				"СОМНЕВАЕТЕСЬ, ЧТО ПОТРАТИТЕ ДЕНЬГИ И НЕ ПОНРАВИТСЯ НОВАЯ ВНЕШНОСТЬ?",
			aiText:
				"Искусственный интеллект поможет Вам, просто загрузите свою фотографию и посмотрите на нового себя!",
			buttonText: "ПОПРОБОВАТЬ",
			backgroundImage: `url(${image1})`,
		},
		{
			id: 2,
			text:
				"СОМНЕВАЕТЕСЬ, ЧТО ПОТРАТИТЕ ДЕНЬГИ И НЕ ПОНРАВИТСЯ НОВАЯ ВНЕШНОСТЬ?",
			aiText:
				"Искусственный интеллект поможет Вам, просто загрузите свою фотографию и посмотрите на нового себя!",
			buttonText: "ПОПРОБОВАТЬ",
			backgroundImage: `url(${image2})`,
		},
		{
			id: 3,
			text:
				"СОМНЕВАЕТЕСЬ, ЧТО ПОТРАТИТЕ ДЕНЬГИ И НЕ ПОНРАВИТСЯ НОВАЯ ВНЕШНОСТЬ?",
			aiText:
				"Искусственный интеллект поможет Вам, просто загрузите свою фотографию и посмотрите на нового себя!",
			buttonText: "ПОПРОБОВАТЬ",
			backgroundImage: `url(${image1})`,
		},
	];

	componentDidMount() {
		this.interval = setInterval(this.nextSlide, 5000);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	nextSlide = () => {
		const { activeSlideIndex } = this.state;
		const lastIndex = this.slidesData.length - 1;
		const newIndex = activeSlideIndex === lastIndex ? 0 : activeSlideIndex + 1;
		this.setState({ activeSlideIndex: newIndex });
	};

	setActiveSlideIndex = (newActiveSlideIndex) => {
		this.setState({
			activeSlideIndex: newActiveSlideIndex,
		});
	};

	render() {
		return (
			<Carousel
				activeSlideIndex={this.state.activeSlideIndex}
				onRequestChange={this.setActiveSlideIndex}
				itemsToShow={1}
				itemsToScroll={1}
				swipeTreshold={80}
				speed={1000}
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
							borderRadius: "50%",
							margin: 4,
							opacity: 1,
						},
					},
					activeItemBtnProps: {
						style: {
							height: 14,
							width: 15,
							border: 0,
							borderRadius: "50%",
							background: "rgba(75, 100, 189, 1)",
							margin: 4,
							opacity: 1,
						},
					},
				}}
			>
				{this.slidesData.map((slide) => (
					<Slides key={slide.id} data={slide} />
				))}
			</Carousel>
		);
	}
}

export default MyCarousel;
