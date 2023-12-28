import './ClinicsCardsItem.scss';

import PropTypes from 'prop-types';

import CallButton from '../UI/buttons/callButton/CallButton';
import LikeButton from '../UI/buttons/likeButton/LikeButton';
import Review from '../review/Review';

import clinicImg from '../../assets/imgs/clinic-1.png';

const ClinicsCardsItem = (props) => {
	return (
		<li className='cards-item'>
			<div className='cards-item__wrapper'>
				<div className='cards-item__wrapper-left'>
					<div className='cards-item__wrapper-left-box'>
						<img className='cards-item__wrapper-left-img' src={clinicImg} alt="логотип клиники" />
					</div>
					<Review />
				</div>
				<div className='cards-item__wrapper-center'>
					<div className='cards-item__wrapper-center-box'>
						<h3>{props.post.title}</h3>
						<p>{props.post.id}</p>
						<h4>Услуги</h4>
						<p>{props.post.body}</p>
					</div>
				</div>
				<div className='cards-item__wrapper-right'>
					<div>
						<h4>(Название клиники на данном месте):</h4>
						<p>ул. Военная, д. 4</p>
						<h4>ЗАПИСАТЬСЯ НА ПРИЁМ:</h4>
						<CallButton >(Добавить номер телефона)</CallButton>
					</div>
				</div>
				<div className='cards-item__wrapper-like'>
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