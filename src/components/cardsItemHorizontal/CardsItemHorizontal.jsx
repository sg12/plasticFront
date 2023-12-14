import './CardsItemHorizontal.scss';

import PropTypes from 'prop-types';

import CallButton from '../UI/button/callButton/CallButton';
import LikeButton from '../UI/button/likeButton/LikeButton';
import Reviews from '../UI/other/reviews/Reviews';

import clinicImg from '../../assets/imgs/clinic-1.png';

const CardsItemHorizontal = (props) => {
	return (
		<li className='cards-item'>
			<div className='cards-item__wrapper'>
				<div className='cards-item__wrapper-left'>
					<div className='cards-item__wrapper-left-box'>
						<img className='cards-item__wrapper-left-img' src={clinicImg} alt="логотип клиники" />
					</div>
					<Reviews />
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

CardsItemHorizontal.propTypes = {
	post: PropTypes.shape({
		id: PropTypes.number.isRequired,
		title: PropTypes.string.isRequired,
		body: PropTypes.string.isRequired,
	}).isRequired,
};

export default CardsItemHorizontal;