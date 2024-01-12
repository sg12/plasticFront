import './DoctorDetailedItem.scss';

import PropTypes from 'prop-types';

import Review from '../review/Review';
import Contacts from '../contacts/Contacts';
import Admission from '../admission/Admission';

import doctorImg from '../../assets/imgs/doctor-1.png';

const DoctorDetailedItem = (props) => {
	return (
		<div className='doctor-detailed-item'>
			<div className='doctor-detailed-item__box-title'>
				<img src={doctorImg} alt="доктор" />
				<Review />
				<h2>{props.post.title}</h2>
			</div>
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
							<h3>ЛИЦЕНЗИЯ</h3>
							<p>(Добавить компонент лицензий)</p>
						</div>
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
				<p>{props.post.body}</p>
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
		title: PropTypes.string.isRequired,
		body: PropTypes.string.isRequired,
	}).isRequired,
};

export default DoctorDetailedItem;