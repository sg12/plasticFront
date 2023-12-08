import React from 'react';

import { useForm } from 'react-hook-form';

import './EnterClient.scss';

const EnterClient = () => {

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
        <div className='enter__client client'>
            <a href='#' className='client__link'>Вход клиента</a>
            <form className='client__form form' onSubmit={handleSubmit(onSubmit)}>
                <div className='form__box'>
                    <input className={`form__input${errors?.email ? ' error-input' : ''}`} placeholder='Электронная почта'
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
                    <input className={`form__input${errors?.email ? ' error-input' : ''}`} type='password' placeholder='Пароль'
                        {...register('password', {
                            required: 'Поле обязательно к заполнению',
                            pattern: {
                                value: /^[a-zA-Z0-9!.]{6,15}$/,
                                message: 'Некорректный пароль'
                            }
                        })} />
                    {errors?.password && <span className='form__span'>{errors?.password?.message}</span>}
                </div>

                <a href="#" className='form__link'>Забыли пароль?</a>
                <button className='form__button'>Войти</button>
            </form>
        </div>
    );
};

export default EnterClient;
