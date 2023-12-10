import React from 'react';
import './EnterList.scss';
import EnterItem from '../enterItem/enterItem';
import EnterClient from '../enterClient/EnterClient';
import RegisterClient from '../registerClient/RegisterClient';
import EnterPartner from '../enterPartner/EnterPartner';
import RegisterDoctor from '../registerDoctor/RegisterDoctor';

import enter1 from '../../assets/icons/enterLogo.png';

const EnterList = () => {
    return (
        <div className='enter'>
            <div className='enter__container container'>
                <img className='enter__logo' src={enter1} alt="Лого" />
                <>
                {/* <EnterItem /> */}
                {/* <EnterClient /> */}
                {/* <RegisterClient /> */}
                {/* <EnterPartner /> */}
                <RegisterDoctor />
                </>
                <p className='enter__copyright'>© Copyright 2023 Plastic Beauty</p>
            </div>
        </div>
    );
};

export default EnterList;