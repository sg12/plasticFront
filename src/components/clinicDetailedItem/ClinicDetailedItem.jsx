import './ClinicDetailedItem.scss';

import PropTypes from 'prop-types';

import Review from '../review/Review';
import Contacts from '../contacts/Contacts';

import clinicImg from '../../assets/imgs/clinic-1.png';
import parkingImg from '../../assets/icons/parking.svg';

const ClinicDetailedItem = (props) => {
	return (
		<div className='clinic-detailed-item'>
			<div className='clinic-detailed-item__box-title'>
				<img src={clinicImg} alt="клиника" />
				<Review />
				<h2>{props.post.title}</h2>
			</div>
			<div className='clinic-detailed-item__wrapper-first'>
				<div className='clinic-detailed-item__wrapper-first-left'>
					<div className='clinic-detailed-item__wrapper-first-item'>
						<div className='clinic-detailed-item__description-first'>
							<h3>ОФИЦИАЛЬНОЕ НАЗВАНИЕ</h3>
							<p>{props.post.id}</p>
						</div>
						<div className='clinic-detailed-item__description-first'>
							<h3>РУКОВОДИТЕЛЬ</h3>
							<p>Дунаева Тамара Ивановна</p>
						</div>
					</div>
					<div className='clinic-detailed-item__wrapper-first-item'>
						<div className='clinic-detailed-item__description-first'>
							<h3>ЛИЦЕНЗИЯ</h3>
							<p>(Добавить компонент лицензий)</p>
						</div>
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
				<p>{props.post.body}</p>
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
		id: PropTypes.number.isRequired,
		title: PropTypes.string.isRequired,
		body: PropTypes.string.isRequired,
	}).isRequired,
};

export default ClinicDetailedItem;