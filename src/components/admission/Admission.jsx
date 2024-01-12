import './Admission.scss';

import TransitionButton from '../UI/buttons/transitionButton/TransitionButton';

import clinic from '../../assets/icons/clinic.svg';
import home from '../../assets/icons/home.svg';

const Admission = () => {
	return (
		<div className='admission'>
			<h4>ТИП ПРИЁМА</h4>
			<div className='admission__box'>
				<div className='admission__item'>
					<img src={clinic} alt="клиника" />
					<p>В КЛИНИКЕ</p>
				</div>
				<div className='admission__item'>
					<img src={home} alt="частная практика" />
					<p>ЧАСТНАЯ <br /> ПРАКТИКА</p>
				</div>
			</div>
			<h4>ПЕРЕЙТИ НА СТРАНИЦУ КЛИНИКИ</h4>
			<TransitionButton>(Добавить название клиники)</TransitionButton>
		</div>
	);
};

export default Admission;