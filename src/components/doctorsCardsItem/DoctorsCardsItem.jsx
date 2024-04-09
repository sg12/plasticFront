import './DoctorsCardsItem.scss';

import PropTypes from 'prop-types';

import { useNavigate } from 'react-router-dom';

import Review from '../review/Review';
import Admission from '../admission/Admission';
import Contacts from '../contacts/Contacts';
import LikeButton from '../UI/buttons/likeButton/LikeButton';

import doctorImg from '../../assets/imgs/doctor-1.png';

const DoctorsCardsItem = (props) => {

	const navigate = useNavigate();

	const toDetailedPage = () => {
		navigate(`/doctors/${props.post.id}`);
	};

	return (
		<li className='doctors-cards-item'>
			<div className='doctors-cards-item__wrapper'>
				<div className='doctors-cards-item__wrapper-left'>
					<div className='doctors-cards-item__wrapper-left-box'>
						<img className='doctors-cards-item__wrapper-left-img' src={doctorImg} alt="логотип врача" />
					</div>
					<Review />
				</div>
				<div className='doctors-cards-item__wrapper-center'>
					<div className='doctors-cards-item__wrapper-center-box'>
						<button onClick={toDetailedPage}>{props.post.clinic_name}</button>
						<p>{props.post.id}</p>
						<h4>Услуги</h4>
						<p>{props.post.description}</p>
						<Admission />
					</div>
				</div>
				<div className='doctors-cards-item__wrapper-right'>
					<Contacts />
				</div>
				<div className='doctors-cards-item__wrapper-like'>
					<LikeButton />
				</div>
			</div>
		</li>
	);
};

DoctorsCardsItem.propTypes = {
	post: PropTypes.shape({
		id: PropTypes.number.isRequired,
		clinic_name: PropTypes.string.isRequired,
		description: PropTypes.string.isRequired,
	}).isRequired,
};

export default DoctorsCardsItem;