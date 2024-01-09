import './DoctorDetailedItem.scss';

import PropTypes from 'prop-types';

import Review from '../review/Review';
import Contacts from '../contacts/Contacts';

import doctorImg from '../../assets/imgs/doctor-1.png';

const DoctorDetailedItem = (props) => {
	return (
		<div className='doctor-detailed-item'>
			<div className='doctor-detailed-item__box-title'>
				<img src={doctorImg} alt="доктор" />
				<Review />
				<h2>{props.post.title}</h2>
			</div>
			<div className='doctor-detailed-item__wrapper'>
				<div className='doctor-detailed-item__wrapper-left'>
					<div className='doctor-detailed-item__wrapper-item'>
						<div className='doctor-detailed-item__description'>
							<h3>Стаж</h3>
							<p>{props.post.id} лет</p>
						</div>
						<div className='doctor-detailed-item__description'>
							<h3>Категория</h3>
							<p>Высшая</p>
						</div>
						<div className='doctor-detailed-item__description'>
							<h3>Специализация</h3>
							<p>Пластический хирург</p>
						</div>
					</div>
					<div className='doctor-detailed-item__wrapper-item'>
						<div className='doctor-detailed-item__description'>
							<h3>Лицензия</h3>
							<p>(Добавить компонент лицензий)</p>
						</div>
					</div>
				</div>
				<div className='doctor-detailed-item__wrapper-center'>
					<div className='doctor-detailed-item__description'>
						<Contacts />
					</div>
				</div>
				<div className='doctor-detailed-item__wrapper-right'>
					<div className='doctor-detailed-item__description'>
						<h3>Тип приема</h3>
						<p>(Добавить компонент приема)</p>
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
	}).isRequired,
};

export default DoctorDetailedItem;