import './ClinicDetailedItem.scss';

import PropTypes from 'prop-types';
import { useState } from 'react';

import Review from '../review/Review';
import Contacts from '../contacts/Contacts';
import CenterModal from '../UI/modals/centerModal/CenterModal';
import WhiteButton from '../UI/buttons/whiteButton/WhiteButton';
import Stars from '../UI/stars/Stars';
import FieldButton from '../UI/buttons/fieldButton/FieldButton';

import clinicImg from '../../assets/imgs/clinic-1.png';
import parkingImg from '../../assets/icons/parking.svg';
import licenseImg from '../../assets/imgs/license.png';
import licenseBigImg from '../../assets/imgs/license-big.png';

import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import PlasticServices from '../../services/PlasticServices';

const ClinicDetailedItem = (props) => {
	const [modal, setModal] = useState(false);
	const [modal2, setModal2] = useState(false);
	const [modal3, setModal3] = useState(false);
	const [modal4, setModal4] = useState(false);
	const [alertModal, setAlertModal] = useState(false);

	const [reviews, setReviews] = useState([]);
	const [averageRating, setAverageRating] = useState(null);

	const token = Cookies.get("key");

	const privateReviews = () => {
		if (!token) {
			setAlertModal(true);
		} else {
			setModal3(true); 
		}
	};

	const handleReviewSubmit = async () => {
        const starRatings = reviews.slice(0, 5).map(review => review.rating);
        const sumRatings = starRatings.reduce((acc, rating) => acc + rating, 0);
        const avgRating = Math.round(sumRatings / starRatings.length);
        const text = reviews[5]?.textReview;
		const rating = avgRating;

        const data = { rating, text };

        setAverageRating(avgRating);

        console.log("Средний рейтинг: ", avgRating);

        await PlasticServices.postClinicReview(data, props.post.id);
    };

	const handleReviewChange = (index, rating, text, textReview) => {
		const updatedReviews = [...reviews];
		updatedReviews[index] = { rating, text, textReview };
		setReviews(updatedReviews);
	};
	console.log(reviews);

	return (
		<div className='clinic-detailed-item'>
			<div className='clinic-detailed-item__box-title'>
				<img src={clinicImg} alt="клиника" />
				<Review />
				<button className='clinic-detailed-item__review-button' onClick={() => { privateReviews(); }}>Оставить отзыв</button>
				<CenterModal visible={alertModal} setVisible={setAlertModal}>
					<h3 style={{display:"flex", alignItems:"center", justifyContent:"center"}}>Вам нужно авторизоваться, чтобы оставлять отзывы</h3>
					<Link to={"/enterPage"} style={{ textDecoration: 'none', color: "white"}}><FieldButton>Войти</FieldButton></Link>
				</CenterModal>
				<h2 className='title-doctor'>{props.post.name}</h2>
			</div>
			{averageRating !== null && (
				<div className='clinic-detailed-item__average-rating'>
					<h3>Средний рейтинг: {averageRating}</h3>
				</div>
			)}
			<CenterModal visible={modal3} setVisible={setModal3}>
				<div className='clinic-detailed-item__modal-send-review'>
					<h3 className='clinic-detailed-item__modal-send-review-title'>Оставить отзыв о клинике</h3>
					<div className='clinic-detailed-item__modal-send-review-block'>
						<p className='clinic-detailed-item__modal-send-review-description'>Здание и помещения</p>
						<Stars totalStars={5} onChange={(rating) => handleReviewChange(0, rating, "Здание и помещения")} />
					</div>

					<div className='clinic-detailed-item__modal-send-review-block'>
						<p className='clinic-detailed-item__modal-send-review-description'>Оборудование и медикаменты</p>
						<Stars totalStars={5} onChange={(rating) => handleReviewChange(1, rating, "Оборудование и медикаменты")} />
					</div>

					<div className='clinic-detailed-item__modal-send-review-block'>
						<p className='clinic-detailed-item__modal-send-review-description'>Отношение медперсонала</p>
						<Stars totalStars={5} onChange={(rating) => handleReviewChange(2, rating, "Отношение медперсонала")} />
					</div>

					<div className='clinic-detailed-item__modal-send-review-block'>
						<p className='clinic-detailed-item__modal-send-review-description'>Комфорт пребывания</p>
						<Stars totalStars={5} onChange={(rating) => handleReviewChange(3, rating, "Комфорт пребывания")} />
					</div>

					<div className='clinic-detailed-item__modal-send-review-block'>
						<p className='clinic-detailed-item__modal-send-review-description'>Время ожидания</p>
						<Stars totalStars={5} onChange={(rating) => handleReviewChange(4, rating, "Время ожидания")} />
					</div>

					<FieldButton className='clinic-detailed-item__modal-send-review-button' onClick={() => { setModal3(false); setModal4(true); }}>Продолжить</FieldButton>
				</div>
			</CenterModal>
			<CenterModal visible={modal4} setVisible={setModal4}>
				{/* Модальное окно для ввода текстовых отзывов */}
				<div className='doctor-detailed-item__modal-send-review'>
					<h3 className='doctor-detailed-item__modal-send-review-title'>Добавить текстовый отзыв</h3>
					<textarea className='review-textarea' placeholder="Расскажите подробнее вашу историю, что вам понравилось или не понравилось" onChange={(event) => handleReviewChange(5, null, "text", event.target.value)} />
					<FieldButton className='doctor-detailed-item__modal-send-review-button' onClick={handleReviewSubmit}>Оставить отзыв</FieldButton>
				</div>
			</CenterModal>
			<div className='clinic-detailed-item__wrapper-first'>
				<div className='clinic-detailed-item__wrapper-first-left'>
					<div className='clinic-detailed-item__wrapper-first-item'>
						<div className='clinic-detailed-item__description-first'>
							<h3 className='title-h3'>ОФИЦИАЛЬНОЕ НАЗВАНИЕ</h3>
							<p className='text'>{props.post.id} {props.post.official_name}</p>
						</div>
						<div className='clinic-detailed-item__description-first'>
							<h3 className='title-h3'>РУКОВОДИТЕЛЬ</h3>
							<p className='text'>{props.post.director}</p>
						</div>
					</div>
					<div className='clinic-detailed-item__wrapper-first-item'>
						<div className='clinic-detailed-item__description-first'>
							<div className='clinic-detailed-item__flex'>
								<div>
									<h3 className='title-h3'>ЛИЦЕНЗИЯ</h3>
									<img className='clinic-detailed-item__license-img' src={licenseImg} alt="Лицензия" onClick={() => setModal2(true)} />
									<img className='clinic-detailed-item__license-img' src={licenseImg} alt="Лицензия" onClick={() => setModal2(true)} />
									<img className='clinic-detailed-item__license-img' src={licenseImg} alt="Лицензия" onClick={() => setModal2(true)} />
									<img className='clinic-detailed-item__license-img' src={licenseImg} alt="Лицензия" onClick={() => setModal2(true)} />
								</div>
								<div>
									<WhiteButton className='clinic-detailed-item__license-button' onClick={() => setModal(true)}>Показать подробнее</WhiteButton>
								</div>
							</div>
						</div>
						<CenterModal visible={modal} setVisible={setModal}>
							<div className='clinic-detailed-item__modal'>
								<h3 className='clinic-detailed-item__modal-title'>ЛИЦЕНЗИЯ</h3>
								<p className='clinic-detailed-item__modal-description'>*нажмите на изображение для его увеличения</p>
								<div>
									<img className='clinic-detailed-item__modal-license-img' src={licenseImg} alt="Лицензия" onClick={() => setModal2(true)} />
									<img className='clinic-detailed-item__modal-license-img' src={licenseImg} alt="Лицензия" onClick={() => setModal2(true)} />
									<img className='clinic-detailed-item__modal-license-img' src={licenseImg} alt="Лицензия" onClick={() => setModal2(true)} />
									<img className='clinic-detailed-item__modal-license-img' src={licenseImg} alt="Лицензия" onClick={() => setModal2(true)} />
									<img className='clinic-detailed-item__modal-license-img' src={licenseImg} alt="Лицензия" onClick={() => setModal2(true)} />
									<img className='clinic-detailed-item__modal-license-img' src={licenseImg} alt="Лицензия" onClick={() => setModal2(true)} />
								</div>
							</div>
						</CenterModal>
						<CenterModal visible={modal2} setVisible={setModal2}>
							<img src={licenseBigImg} alt="Лицензия" />
						</CenterModal>
					</div>
				</div>
				<div className='clinic-detailed-item__wrapper-first-center'>
					<div className='clinic-detailed-item__description-first'>
						<Contacts />
					</div>
				</div>
				<div className='clinic-detailed-item__wrapper-first-right'>
					<div className='clinic-detailed-item__description-first'>
						<div className='clinic-detailed-item__description-first-box'>
							<img className='clinic-detailed-item__description-first-item' src={parkingImg} alt="парковка" />
							<div className='clinic-detailed-item__description-first-item'>Гостевая парковка</div>
						</div>
						<div className='clinic-detailed-item__description-first-box'>
							<img className='clinic-detailed-item__description-first-item' src={parkingImg} alt="парковка" />
							<div className='clinic-detailed-item__description-first-item'>Гостевая парковка</div>
						</div>
						<div className='clinic-detailed-item__description-first-box'>
							<img className='clinic-detailed-item__description-first-item' src={parkingImg} alt="парковка" />
							<div className='clinic-detailed-item__description-first-item'>Гостевая парковка</div>
						</div>
						<div className='clinic-detailed-item__description-first-box'>
							<img className='clinic-detailed-item__description-first-item' src={parkingImg} alt="парковка" />
							<div className='clinic-detailed-item__description-first-item'>Гостевая парковка</div>
						</div>
					</div>
				</div>
			</div>
			<div className='clinic-detailed-item__description'>
				<h3 className='title-h3'>СПЕЦИАЛИЗАЦИЯ</h3>
				<p className='text'>{props.post.description}</p>
			</div>
			<div className='clinic-detailed-item__wrapper-second'>
				<div className='clinic-detailed-item__wrapper-second-left'>
					<div className='clinic-detailed-item__description-second clinic-detailed-item__description-second_nav'>
						<h3 className='title-h3'>Навигация</h3>
						<p className='text'>(Добавить список)</p>
					</div>
				</div>
				<div className='clinic-detailed-item__wrapper-second-right'>
					<div className='clinic-detailed-item__description-second'>
						<h3 className='title-h3'>Перечень услуг</h3>
						<p className='text'>(Добавить компонент)</p>
					</div>
					<div className='clinic-detailed-item__description-second'>
						<h3 className='title-h3'>Достижения</h3>
						<p className='text'>(Добавить компонент)</p>
					</div>
					<div className='clinic-detailed-item__description-second'>
						<h3 className='title-h3'>Фотографии</h3>
						<p className='text'>(Добавить компонент)</p>
					</div>
					<div className='clinic-detailed-item__description-second'>
						<h3 className='title-h3'>Отзывы клиентов</h3>
						<p className='text'>(Добавить компонент)</p>
					</div>
				</div>
			</div>
		</div>
	);
};

ClinicDetailedItem.propTypes = {
	post: PropTypes.shape({
		user: PropTypes.shape({
			username: PropTypes.string.isRequired,
		}),
		id: PropTypes.number.isRequired,
		director: PropTypes.string.isRequired,
		official_name: PropTypes.string.isRequired,
		description: PropTypes.string.isRequired,
	}).isRequired,
};

export default ClinicDetailedItem;