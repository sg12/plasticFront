import './ClinicsCardsItem.scss';

import PropTypes from 'prop-types';

import { useNavigate } from 'react-router-dom';

import LikeButton from '../UI/buttons/likeButton/LikeButton';
import Review from '../review/Review';
import Contacts from '../contacts/Contacts';

import clinicImg from '../../assets/imgs/clinic-1.png';

const ClinicsCardsItem = (props) => {

	const navigate = useNavigate();

	const toDetailedPage = () => {
		navigate(`/clinics/${props.post.id}`);
	};

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
						<button onClick={toDetailedPage}>{props.post.user.username}</button>
						<p>{props.post.id}</p>
						<h4>Услуги</h4>
						<p>{props.post.description}</p>
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
		user: PropTypes.shape({
			username: PropTypes.string.isRequired,
		}).isRequired,
		id: PropTypes.number.isRequired,
		description: PropTypes.string.isRequired,
	}).isRequired,
};

export default ClinicsCardsItem;