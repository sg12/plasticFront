import React from 'react';

import EnterButton from '../UI/button/enterButton/EnterButton';

import { useForm } from 'react-hook-form';

import './EnterPartner.scss';

const EnterPartner = () => {

    const {register, formState: { errors }, handleSubmit } = useForm({
        defaultValues:{
            email:'',
            password:'',
        },
    });

    const onSubmit = (data) => {
        console.log(data);
    }

    return (
        <div className='enter__partner partner'>
            <a href='#' className='partner__link'>Вход партнёра</a>
            <form className='partner__form form' onSubmit={handleSubmit(onSubmit)}>
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

                <a href="#" className='form__link'>Забыли пароль?</a>
                <EnterButton type="submit">
                    Войти
                </EnterButton>
                <p className='form__approval approval'>Нажимая кнопку “Войти”, вы соглашаешься с <a className='approval__link' href="#">Политикой Конфиденциальности</a> и даёте <a className='approval__link' href="#">Согласие на обработку персональных данных</a></p>
                <div className='form__registers'>
                    <a className='form__register' href="#">Регистрация врача</a>
                    <a className='form__register' href="#">Регистрация клиники</a>
                </div>
            </form>
        </div>
    );
};

export default EnterPartner;
