import React from 'react';
import './EnterItem.scss'

const EnterItem = () => {
    return (
        <div className='enter'>
            <div className='enter__content content'>
                <p className='enter__title'>Выберите тип входа</p>
                <button className='enter__button'>Клиент</button>
                <p className='enter__text'>или</p>
                <button className='enter__button'>Партнер</button>
                <a href="#" className='enter__link'>Вернуться на главную</a>
            </div>
        </div>
    );
};

export default EnterItem;