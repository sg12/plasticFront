import { Link } from 'react-router-dom';
import FieldButton from '../UI/buttons/fieldButton/FieldButton';

import './EnterItem.scss';

const EnterItem = () => {
	return (
		<div className='enter'>
			<div className='enter__content content'>
				<p className='enter__title'>Выберите тип входа</p>
				<Link to={'enterClient'} className="enter__link">
					<FieldButton className="enter__button">
						Клиент
					</FieldButton>
				</Link>
				<p className='enter__text'>или</p>
				<Link to={'enterPartner'} className="enter__link">
					<FieldButton className="enter__button">
						Партнер
					</FieldButton>
				</Link>
				<Link to={'/'} className='enter__back'>Вернуться на главную</Link>
			</div>
		</div>
	);
};

export default EnterItem;
