import { Link, useNavigate } from 'react-router-dom';

import { useState } from 'react';

import FieldButton from '../UI/buttons/fieldButton/FieldButton';

import { useForm } from 'react-hook-form';

import PlasticServices from '../../services/PlasticServices.js';

import Cookies from 'js-cookie';

import './RegisterClient.scss';

const RegisterClient = () => {
    const navigate = useNavigate();
    const [referralCode, setReferralCode] = useState('');

    const {register, formState: { errors }, handleSubmit, watch} = useForm({
        defaultValues:{
            email:'',
            password:'',
            re_password:'',
            // ref:'',
        },
    });

    const onSubmit = async ({ email, password, re_password }) => {
        const data = { email, password, re_password };
        const pathname = window.location.pathname;
        let type = '';
        if (pathname === '/enterPage/registerClient') {
            type = 'client';
        } else if (pathname === '/enterPage/registerDoctor'){
            type = 'surgeon';
        } else if (pathname === '/enterPage/registerClinic'){
            type = 'clinic';
        }
        const respData = await PlasticServices.registerUser(data, type);
        console.log(respData);
        Cookies.set('token', respData.token);
        navigate("/account",setTimeout ( () => window.location.reload(), 0));
    };
    
    

    return (
        <div className='enter__client client'>
            <Link to={'/enterPage/enterClient'} className='client__link'>Регистрация клиента</Link>
            <form className='client__form form' onSubmit={handleSubmit(onSubmit)}>
                <div className='form__box'>
                    <input className={`form__input${errors?.email ? ' error__input' : ''}`} placeholder='Электронная почта'
                        {...register('email', {
                            required: 'Поле обязательно к заполнению',
                            pattern: {
                                value: /[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$/,
                                message: 'Некорректная почта'
                            }
                        })} 
                    />
                    {errors?.email && <span className='form__span'>{errors?.email?.message}</span>}
                </div>

                <div className='form__box'>
                    <input className={`form__input${errors?.password ? ' error__input' : ''}`} type='password' placeholder='Пароль'
                        {...register('password', {
                            required: 'Поле обязательно к заполнению',
                            pattern: {
                                value: /^[a-zA-Z0-9!.]{6,15}$/,
                                message: 'Некорректный пароль'
                            }
                        })} 
                    />
                    {errors?.password && <span className='form__span'>{errors?.password?.message}</span>}
                </div>

                <div className='form__box'>
                    <input
                        className={`form__input${errors?.re_password ? ' error__input' : ''}`}
                        type='password'
                        placeholder='Повторите пароль'
                        {...register('re_password', {
                            required: 'Поле обязательно к заполнению',
                            validate: (value) => value === watch('password') || 'Пароли не совпадают',
                        })}
                    />
                    {errors?.re_password && <span className='form__span'>{errors?.re_password?.message}</span>}
                </div>
                <div className='form__box'>
                    <input
                        className={`form__input${errors?.ref ? ' error__input' : ''}`}
                        type='text'
                        placeholder='Реферальный код'
                        {...register('ref', {
                            // Добавьте необходимые правила валидации, если требуется
                        })}
                        value={referralCode}
                        onChange={(e) => setReferralCode(e.target.value)}
                    />
                    {errors?.ref && <span className='form__span'>{errors?.ref?.message}</span>}
                </div>
                <p className='form__ref'>Укажите персональный ID пользователя, который вас пригласил - вы получите 5% скидку</p>
                <FieldButton type="submit" className="form__button">
                    Зарегистрироваться
                </FieldButton>
                <p className='form__confirmation'>Подтвердите адрес электронной почты. Письмо со ссылкой для подтверждения отправлено на указанную вами почту.</p>
                <Link to={'/enterPage/enterClient'} className='form__enter'>Вход клиента</Link>
            </form>
        </div>
    );
};

export default RegisterClient;
