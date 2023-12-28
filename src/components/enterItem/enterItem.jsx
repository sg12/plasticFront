import { Link } from 'react-router-dom';
import FieldButton from '../UI/button/fieldButton/FieldButton';

import './EnterItem.scss';

const EnterItem = () => {
    return (
        <div className='enter'>
            <div className='enter__content content'>
                <p className='enter__title'>Выберите тип входа</p>
                <Link to={'enterClient'}>
                    <FieldButton>
                        Клиент
                    </FieldButton>
                </Link>
                <p className='enter__text'>или</p>
                <Link to={'enterPartner'}>
                    <FieldButton>
                        Партнер
                    </FieldButton>
                </Link>
                <Link to={'/'} href="#" className='enter__link'>Вернуться на главную</Link>
            </div>
        </div>
    );
};

export default EnterItem;
