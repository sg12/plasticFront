import './ClinicDetailedItem.scss';

import PropTypes from 'prop-types';
import { useState } from 'react';

import Review from '../review/Review';
import Contacts from '../contacts/Contacts';
import CenterModal from '../UI/modals/centerModal/CenterModal';
import WhiteButton from '../UI/buttons/whiteButton/WhiteButton';

import clinicImg from '../../assets/imgs/clinic-1.png';
import parkingImg from '../../assets/icons/parking.svg';
import licenseImg from '../../assets/imgs/license.png';
import licenseBigImg from '../../assets/imgs/license-big.png';

const ClinicDetailedItem = (props) => {
	const [modal, setModal] = useState(false);
	const [modal2, setModal2] = useState(false);

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
								<p className='doctor-detailed-item__modal-descr'>*нажмите на изображение для его увеличения</p>
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