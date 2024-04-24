import './DoctorDetailedItem.scss';

import { useState } from 'react';

import PropTypes from 'prop-types';

import CenterModal from '../UI/modals/centerModal/CenterModal';
import Review from '../review/Review';
import Contacts from '../contacts/Contacts';
import Admission from '../admission/Admission';
import WhiteButton from '../UI/buttons/whiteButton/WhiteButton';
import Stars from '../UI/stars/Stars';

import doctorImg from '../../assets/imgs/doctor-1.png';
import licenseImg from '../../assets/imgs/license.png';
import licenseBigImg from '../../assets/imgs/license-big.png';
import FieldButton from '../UI/buttons/fieldButton/FieldButton';

import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

const DoctorDetailedItem = (props) => {
	const [modal, setModal] = useState(false);
	const [modal2, setModal2] = useState(false);
	const [modal3, setModal3] = useState(false);
	const [alertModal, setAlertModal] = useState(false);

	const token = Cookies.get("token");

	const privateReviews = () => {
		if (!token) {
			setAlertModal(true);
		} else {
			setModal3(true); 
		}
	};

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
		<div className='doctor-detailed-item'>
			<div className='doctor-detailed-item__box-title'>
				<img src={doctorImg} alt="доктор" />
				<Review />
				<button className='doctor-detailed-item__review-button' onClick={() => { privateReviews(); }}>Оставить отзыв</button>
				<CenterModal visible={alertModal} setVisible={setAlertModal}>
					<h3 style={{display:"flex", alignItems:"center", justifyContent:"center"}}>Вам нужно авторизоваться, чтобы оставлять отзывы</h3>
					<Link to={"/enterPage"} style={{ textDecoration: 'none', color: "white"}}><FieldButton>Войти</FieldButton></Link>
				</CenterModal>
				<h2 className='title-doctor'>{props.post.user.username}</h2>
			</div>
			<CenterModal visible={modal3} setVisible={setModal3}>
				<div className='doctor-detailed-item__modal-send-review'>
					<h3 className='doctor-detailed-item__modal-send-review-title'>Оставить отзыв о враче</h3>
					<div className='doctor-detailed-item__modal-send-review-block'>
						<p className='doctor-detailed-item__modal-send-review-description'>Тщательность обследования</p>
						<Stars totalStars={5} onChange={(rating) => handleReviewChange(0, rating, "Тщательность обследования")} />
					</div>

					<div className='doctor-detailed-item__modal-send-review-block'>
						<p className='doctor-detailed-item__modal-send-review-description'>Эффективность лечения</p>
						<Stars totalStars={5} onChange={(rating) => handleReviewChange(1, rating, "Эффективность лечения")} />
					</div>

					<div className='doctor-detailed-item__modal-send-review-block'>
						<p className='doctor-detailed-item__modal-send-review-description'>Отношение к пациенту</p>
						<Stars totalStars={5} onChange={(rating) => handleReviewChange(2, rating, "Отношение к пациенту")} />
					</div>

					<div className='doctor-detailed-item__modal-send-review-block'>
						<p className='doctor-detailed-item__modal-send-review-description'>Информирование пациента</p>
						<Stars totalStars={5} onChange={(rating) => handleReviewChange(3, rating, "Информирование пациента")} />
					</div>

					<div className='doctor-detailed-item__modal-send-review-block'>
						<p className='doctor-detailed-item__modal-send-review-description'>Посоветуете ли Вы врача?</p>
						<Stars totalStars={5} onChange={(rating) => handleReviewChange(4, rating, "Посоветуете ли Вы врача?")} />
					</div>

					<FieldButton className='doctor-detailed-item__modal-send-review-button' onClick={handleReviewSubmit}>Оставить отзыв</FieldButton>
				</div>
			</CenterModal>
			<div className='doctor-detailed-item__wrapper-first'>
				<div className='doctor-detailed-item__wrapper-first-left'>
					<div className='doctor-detailed-item__wrapper-first-item'>
						<div className='doctor-detailed-item__description-first'>
							<h3>Стаж</h3>
							<p>{props.post.id} лет</p>
						</div>
						<div className='doctor-detailed-item__description-first'>
							<h3>Категория</h3>
							<p>Высшая</p>
						</div>
						<div className='doctor-detailed-item__description-first'>
							<h3>Специализация</h3>
							<p>Пластический хирург</p>
						</div>
					</div>
					<div className='doctor-detailed-item__wrapper-first-item'>
						<div className='doctor-detailed-item__description-first'>
							<div className='doctor-detailed-item__flex'>
								<div>
									<h3>ЛИЦЕНЗИЯ</h3>
									<img className='doctor-detailed-item__license-img' src={licenseImg} alt="Лицензия" onClick={() => setModal2(true)} />
									<img className='doctor-detailed-item__license-img' src={licenseImg} alt="Лицензия" onClick={() => setModal2(true)} />
									<img className='doctor-detailed-item__license-img' src={licenseImg} alt="Лицензия" onClick={() => setModal2(true)} />
									<img className='doctor-detailed-item__license-img' src={licenseImg} alt="Лицензия" onClick={() => setModal2(true)} />
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
				<div className='doctor-detailed-item__wrapper-first-center'>
					<div className='doctor-detailed-item__description-first'>
						<Contacts />
					</div>
				</div>
				<div className='doctor-detailed-item__wrapper-first-right'>
					<div className='doctor-detailed-item__description-first'>
						<Admission />
					</div>
				</div>
			</div>
			<div className='doctor-detailed-item__description'>
				<h3>СПЕЦИАЛИЗАЦИЯ</h3>
				<p>{props.post.description}</p>
			</div>
			<div className='doctor-detailed-item__wrapper-second'>
				<div className='doctor-detailed-item__wrapper-second-left'>
					<div className='doctor-detailed-item__description-second doctor-detailed-item__description-second_nav'>
						<h3>Навигация</h3>
						<p>(Добавить список)</p>
					</div>
				</div>
				<div className='doctor-detailed-item__wrapper-second-right'>
					<div className='doctor-detailed-item__description-second'>
						<h3>Перечень услуг</h3>
						<p>(Добавить компонент)</p>
					</div>
					<div className='doctor-detailed-item__description-second'>
						<h3>Образование</h3>
						<p>(Добавить компонент)</p>
					</div>
					<div className='doctor-detailed-item__description-second'>
						<h3>Повышение квалификации</h3>
						<p>(Добавить компонент)</p>
					</div>
					<div className='doctor-detailed-item__description-second'>
						<h3>Опыт работы</h3>
						<p>(Добавить компонент)</p>
					</div>
					<div className='doctor-detailed-item__description-second'>
						<h3>Отзывы клиентов</h3>
						<p>(Добавить компонент)</p>
					</div>
				</div>
			</div>
		</div>
	);
};

DoctorDetailedItem.propTypes = {
	post: PropTypes.shape({
		id: PropTypes.number.isRequired,
		clinic_name: PropTypes.string.isRequired,
		description: PropTypes.string.isRequired,
	}).isRequired,
};

export default DoctorDetailedItem;