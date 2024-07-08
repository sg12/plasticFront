import { Link, useNavigate } from 'react-router-dom';

import FieldButton from '../UI/buttons/fieldButton/FieldButton';

import { useForm } from 'react-hook-form';

import PlasticServices from '../../services/PlasticServices.js';

import Cookies from 'js-cookie';

import './RegisterDoctor.scss';

const RegisterDoctor = () => {
    const navigate = useNavigate();

    const {register, formState: { errors }, handleSubmit, watch} = useForm({
        defaultValues:{
            email:'',
            password:'',
            re_password:'',
        },
    });

    const onSubmit = async ({ email, password, re_password }) => {
        const data = { email, password, re_password };
        const pathname = window.location.pathname;
        let type = '';
        if (pathname === '/enterPage/registerDoctor') {
            type = 'doctor';
        } else if (pathname === '/enterPage/registerClinic'){
            type = 'clinic';
        } else if (pathname === '/enterPage/registerClient'){
            type = 'client';
        }
        const respData = await PlasticServices.registerUser(data, type);
        console.log(respData);
        Cookies.set('token', respData.token);
        navigate("/account",setTimeout ( () => window.location.reload(), 0));
    };

    return (
        <div className='enter__client client'>
            <Link to={'/enterPage/enterPartner'} className='client__link'>Регистрация врача</Link>
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

                <FieldButton type="submit" className="form__button">
                    Зарегистрироваться
                </FieldButton>
                <div className='form__registers'>
                    <Link to={'/enterPage/enterPartner'} className='form__register'>Вход врача</Link>
                    <Link to={'/enterPage/registerClinic'} className='form__register'>Регистрация клиники</Link>
                </div>
            </form>
        </div>
    );
};

export default RegisterDoctor;
