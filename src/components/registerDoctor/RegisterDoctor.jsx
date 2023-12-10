import React, { useState } from 'react';

import EnterButton from '../UI/button/enterButton/EnterButton';

import { useForm } from 'react-hook-form';

import './RegisterDoctor.scss';

const RegisterDoctor = () => {
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
    }

    return (
        <div className='enter__client client'>
            <a href='#' className='client__link'>Регистрация врача</a>
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

                <a href="#" className='form__link'>Забыли пароль?</a>
                <EnterButton type="submit">
                    Зарегистрироваться
                </EnterButton>
                <div className='form__registers'>
                    <a className='form__register' href="#">Вход врача</a>
                    <a className='form__register' href="#">Регистрация клиники</a>
                </div>
            </form>
        </div>
    );
};

export default RegisterDoctor;
