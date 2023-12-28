import './ClinicsCardsItem.scss';

import PropTypes from 'prop-types';

import LikeButton from '../UI/buttons/likeButton/LikeButton';
import Review from '../review/Review';
import Contacts from '../contacts/Contacts';

import clinicImg from '../../assets/imgs/clinic-1.png';

const ClinicsCardsItem = (props) => {
	return (
		<li className='clinics-cards-item'>
			<div className='clinics-cards-item__wrapper'>
				<div className='clinics-cards-item__wrapper-left'>
					<div className='clinics-cards-item__wrapper-left-box'>
						<img className='clinics-cards-item__wrapper-left-img' src={clinicImg} alt="логотип клиники" />
					</div>
					<Review />
				</div>
				<div className='clinics-cards-item__wrapper-center'>
					<div className='clinics-cards-item__wrapper-center-box'>
						<h3>{props.post.title}</h3>
						<p>{props.post.id}</p>
						<h4>Услуги</h4>
						<p>{props.post.body}</p>
					</div>
				</div>
				<div className='clinics-cards-item__wrapper-right'>
					<Contacts />
				</div>
				<div className='clinics-cards-item__wrapper-like'>
					<LikeButton />
				</div>
			</div>
		</li>
	);
};

ClinicsCardsItem.propTypes = {
	post: PropTypes.shape({
		id: PropTypes.number.isRequired,
		title: PropTypes.string.isRequired,
		body: PropTypes.string.isRequired,
	}).isRequired,
};

export default ClinicsCardsItem;