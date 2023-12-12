import React from 'react';
import { Link } from 'react-router-dom';

import './EnterItem.scss';

const EnterItem = () => {
    return (
        <div className='enter'>
            <div className='enter__content content'>
                <p className='enter__title'>Выберите тип входа</p>
                <Link to={'enterClient'} className='enter__button'>Клиент</Link>
                <p className='enter__text'>или</p>
                <Link to={'enterPartner'} className='enter__button'>Партнер</Link>
                <Link to={'/'} href="#" className='enter__link'>Вернуться на главную</Link>
            </div>
        </div>
    );
};

export default EnterItem;
