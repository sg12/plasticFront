import { Link } from 'react-router-dom';

import { useState } from 'react';

import EnterButton from '../UI/buttons/enterButton/EnterButton';

import { useForm } from 'react-hook-form';

import './RegisterClient.scss';

const RegisterClient = () => {
    const [referralCode, setReferralCode] = useState('');

    const {register, formState: { errors }, handleSubmit, watch} = useForm({
        defaultValues:{
            email:'',
            password:'',
            confirm_password:'',
            ref:'',
        },
    });

    const onSubmit = (data) => {
        console.log(data);
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
                        className={`form__input${errors?.confirm_password ? ' error__input' : ''}`}
                        type='password'
                        placeholder='Повторите пароль'
                        {...register('confirm_password', {
                            required: 'Поле обязательно к заполнению',
                            validate: (value) => value === watch('password') || 'Пароли не совпадают',
                        })}
                    />
                    {errors?.confirm_password && <span className='form__span'>{errors?.confirm_password?.message}</span>}
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
                <EnterButton type="submit">
                    Зарегистрироваться
                </EnterButton>
                <p className='form__confirmation'>Подтвердите адрес электронной почты. Письмо со ссылкой для подтверждения отправлено на указанную вами почту.</p>
                <Link to={'/enterPage/enterClient'} className='form__enter'>Вход клиента</Link>
            </form>
        </div>
    );
};

export default RegisterClient;
