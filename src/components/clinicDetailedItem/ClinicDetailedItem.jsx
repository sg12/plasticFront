import './ClinicDetailedItem.scss';

import PropTypes from 'prop-types';
import { useState } from 'react';

import Review from '../review/Review';
import Contacts from '../contacts/Contacts';
import CenterModal from '../UI/modals/centerModal/CenterModal';
import WhiteButton from '../UI/buttons/whiteButton/WhiteButton';
import Stars from '../UI/stars/Stars';

import clinicImg from '../../assets/imgs/clinic-1.png';
import parkingImg from '../../assets/icons/parking.svg';
import licenseImg from '../../assets/imgs/license.png';
import licenseBigImg from '../../assets/imgs/license-big.png';

const ClinicDetailedItem = (props) => {
	const [modal, setModal] = useState(false);
	const [modal2, setModal2] = useState(false);
	const [modal3, setModal3] = useState(false);

	const [reviews, setReviews] = useState([]);

	const handleReviewSubmit = () => {
		console.log("Отзывы:");
		reviews.forEach((review, index) => {
			console.log(`${review.text}: ${review.rating}`);
		});
	};

	const handleReviewChange = (index, rating, text) => {
		const updatedReviews = [...reviews];
		updatedReviews[index] = { rating, text };
		setReviews(updatedReviews);
	};

	return (
		<div className='clinic-detailed-item'>
			<div className='clinic-detailed-item__box-title'>
				<img src={clinicImg} alt="клиника" />
				<Review />
				<button onClick={() => setModal3(true)}>Оставить отзыв</button>
				<h2>{props.post.user.username}</h2>
			</div>
			<CenterModal visible={modal3} setVisible={setModal3}>
				<div className='doctor-detailed-item__modal-send-review'>
					<h3 className='doctor-detailed-item__modal-send-review-title'>Оставить отзыв о клинике</h3>
					<div className='doctor-detailed-item__modal-send-review-block'>
						<p className='doctor-detailed-item__modal-send-review-description'>Здание и помещения</p>
						<Stars totalStars={5} onChange={(rating) => handleReviewChange(0, rating, "Здание и помещения")} />
					</div>

					<div className='doctor-detailed-item__modal-send-review-block'>
						<p className='doctor-detailed-item__modal-send-review-description'>Оборудование и медикаменты</p>
						<Stars totalStars={5} onChange={(rating) => handleReviewChange(1, rating, "Оборудование и медикаменты")} />
					</div>

					<div className='doctor-detailed-item__modal-send-review-block'>
						<p className='doctor-detailed-item__modal-send-review-description'>Отношение медперсонала</p>
						<Stars totalStars={5} onChange={(rating) => handleReviewChange(2, rating, "Отношение медперсонала")} />
					</div>

					<div className='doctor-detailed-item__modal-send-review-block'>
						<p className='doctor-detailed-item__modal-send-review-description'>Комфорт пребывания</p>
						<Stars totalStars={5} onChange={(rating) => handleReviewChange(3, rating, "Комфорт пребывания")} />
					</div>

					<div className='doctor-detailed-item__modal-send-review-block'>
						<p className='doctor-detailed-item__modal-send-review-description'>Время ожидания</p>
						<Stars totalStars={5} onChange={(rating) => handleReviewChange(4, rating, "Время ожидания")} />
					</div>

					<button onClick={handleReviewSubmit}>Оставить отзыв</button>
				</div>
			</CenterModal>
			<div className='clinic-detailed-item__wrapper-first'>
				<div className='clinic-detailed-item__wrapper-first-left'>
					<div className='clinic-detailed-item__wrapper-first-item'>
						<div className='clinic-detailed-item__description-first'>
							<h3>ОФИЦИАЛЬНОЕ НАЗВАНИЕ</h3>
							<p>{props.post.id} {props.post.official_name}</p>
						</div>
						<div className='clinic-detailed-item__description-first'>
							<h3>РУКОВОДИТЕЛЬ</h3>
							<p>{props.post.director}</p>
						</div>
					</div>
					<div className='clinic-detailed-item__wrapper-first-item'>
						<div className='clinic-detailed-item__description-first'>
							<div className='clinic-detailed-item__flex'>
								<div>
									<h3>ЛИЦЕНЗИЯ</h3>
									<img className='clinic-detailed-item__license-img' src={licenseImg} alt="Лицензия" onClick={() => setModal2(true)} />
									<img className='clinic-detailed-item__license-img' src={licenseImg} alt="Лицензия" onClick={() => setModal2(true)} />
									<img className='clinic-detailed-item__license-img' src={licenseImg} alt="Лицензия" onClick={() => setModal2(true)} />
									<img className='clinic-detailed-item__license-img' src={licenseImg} alt="Лицензия" onClick={() => setModal2(true)} />
								</div>
								<div>
									<WhiteButton className='doctor-detailed-item__license-button' onClick={() => setModal(true)}>Показать подробнее</WhiteButton>
								</div>
							</div>
						</div>
						<CenterModal visible={modal} setVisible={setModal}>
							<div className='doctor-detailed-item__modal'>
								<h3 className='doctor-detailed-item__modal-title'>ЛИЦЕНЗИЯ</h3>
								<p className='doctor-detailed-item__modal-description'>*нажмите на изображение для его увеличения</p>
								<div>
									<img className='doctor-detailed-item__modal-license-img' src={licenseImg} alt="Лицензия" onClick={() => setModal2(true)} />
									<img className='doctor-detailed-item__modal-license-img' src={licenseImg} alt="Лицензия" onClick={() => setModal2(true)} />
									<img className='doctor-detailed-item__modal-license-img' src={licenseImg} alt="Лицензия" onClick={() => setModal2(true)} />
									<img className='doctor-detailed-item__modal-license-img' src={licenseImg} alt="Лицензия" onClick={() => setModal2(true)} />
									<img className='doctor-detailed-item__modal-license-img' src={licenseImg} alt="Лицензия" onClick={() => setModal2(true)} />
									<img className='doctor-detailed-item__modal-license-img' src={licenseImg} alt="Лицензия" onClick={() => setModal2(true)} />
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
				<h3>СПЕЦИАЛИЗАЦИЯ</h3>
				<p>{props.post.description}</p>
			</div>
			<div className='clinic-detailed-item__wrapper-second'>
				<div className='clinic-detailed-item__wrapper-second-left'>
					<div className='clinic-detailed-item__description-second clinic-detailed-item__description-second_nav'>
						<h3>Навигация</h3>
						<p>(Добавить список)</p>
					</div>
				</div>
				<div className='clinic-detailed-item__wrapper-second-right'>
					<div className='clinic-detailed-item__description-second'>
						<h3>Перечень услуг</h3>
						<p>(Добавить компонент)</p>
					</div>
					<div className='clinic-detailed-item__description-second'>
						<h3>Достижения</h3>
						<p>(Добавить компонент)</p>
					</div>
					<div className='clinic-detailed-item__description-second'>
						<h3>Фотографии</h3>
						<p>(Добавить компонент)</p>
					</div>
					<div className='clinic-detailed-item__description-second'>
						<h3>Отзывы клиентов</h3>
						<p>(Добавить компонент)</p>
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
		}).isRequired,
		id: PropTypes.number.isRequired,
		director: PropTypes.string.isRequired,
		official_name: PropTypes.string.isRequired,
		description: PropTypes.string.isRequired,
	}).isRequired,
};

export default ClinicDetailedItem;