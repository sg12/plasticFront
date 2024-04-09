import './DoctorDetailedItem.scss';

import { useState } from 'react';

import PropTypes from 'prop-types';

import CenterModal from '../UI/modals/centerModal/CenterModal';
import Review from '../review/Review';
import Contacts from '../contacts/Contacts';
import Admission from '../admission/Admission';
import WhiteButton from '../UI/buttons/whiteButton/WhiteButton';

import doctorImg from '../../assets/imgs/doctor-1.png';
import licenseImg from '../../assets/imgs/license.png';
import licenseBigImg from '../../assets/imgs/license-big.png';

const DoctorDetailedItem = (props) => {
	const [modal, setModal] = useState(false);
	const [modal2, setModal2] = useState(false);

	return (
		<div className='doctor-detailed-item'>
			<div className='doctor-detailed-item__box-title'>
				<img src={doctorImg} alt="доктор" />
				<Review />
				<h2>{props.post.clinic_name}</h2>
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