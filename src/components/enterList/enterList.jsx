import React from 'react';
import './EnterList.scss'
import EnterItem from '../enterItem/enterItem';

import enter1 from '../../assets/icons/enterLogo.png'

const EnterList = () => {
    return (
        <div className='enter'>
            <div className='enter__container container'>
                <img className='enter__logo' src={enter1} alt="Лого" />
                <EnterItem/>
                <p className='enter__copyright'>© Copyright 2023 Plastic Beauty</p>
            </div>
        </div>
    );
};

export default EnterList;