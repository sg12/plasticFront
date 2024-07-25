import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import FieldButton from '../UI/buttons/fieldButton/FieldButton';
import { useForm } from 'react-hook-form';
import PlasticServices from '../../services/PlasticServices.js';
import Cookies from 'js-cookie';
import './Register.scss';

const Register = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const pathname = location.pathname;
    const isClient = pathname.includes('registerClient');
    const isDoctor = pathname.includes('registerDoctor');
    const isClinic = pathname.includes('registerClinic');
    
    const [referralCode, setReferralCode] = useState('');

    const { register, formState: { errors }, handleSubmit, watch } = useForm({
        defaultValues: {
            email: '',
            password: '',
            re_password: '',
        },
    });

    const onSubmit = async ({ email, password, re_password }) => {
        const data = { email, password, re_password };
        let type = '';
        if (isClient) {
            type = 'client';
        } else if (isDoctor) {
            type = 'doctor';
        } else if (isClinic) {
            type = 'clinic';
        }
        const respData = await PlasticServices.registerUser(data, type);
        console.log(respData);
        Cookies.set('token', respData.token);
        navigate("/account", setTimeout(() => window.location.reload(), 0));
    };

    return (
        <div className={`enter__${isClient ? 'client' : isDoctor ? 'doctor' : 'clinic'} ${isClient ? 'client' : isDoctor ? 'doctor' : 'clinic'}`}>
            <Link to={`/enterPage/${isClient ? 'client' : 'partner'}`} className={`${isClient ? 'client' : isDoctor ? 'doctor' : 'clinic'}__link`}>
                {isClient ? 'Регистрация клиента' : isDoctor ? 'Регистрация врача' : 'Регистрация клиники'}
            </Link>
            <form className={`${isClient ? 'client' : isDoctor ? 'doctor' : 'clinic'}__form form`} onSubmit={handleSubmit(onSubmit)}>
                <div className='form__box'>
                    <input
                        className={`form__input${errors?.email ? ' error__input' : ''}`}
                        placeholder='Электронная почта'
                        {...register('email', {
                            required: 'Поле обязательно к заполнению',
                            pattern: {
                                value: /[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$/,
                                message: 'Некорректная почта',
                            },
                        })}
                    />
                    {errors?.email && <span className='form__span'>{errors?.email?.message}</span>}
                </div>

                <div className='form__box'>
                    <input
                        className={`form__input${errors?.password ? ' error__input' : ''}`}
                        type='password'
                        placeholder='Пароль'
                        {...register('password', {
                            required: 'Поле обязательно к заполнению',
                            pattern: {
                                value: /^[a-zA-Z0-9!.]{6,15}$/,
                                message: 'Некорректный пароль',
                            },
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

                {isClient && (
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
                )}
                {isClient && <p className='form__ref'>Укажите персональный ID пользователя, который вас пригласил - вы получите 5% скидку</p>}
                <FieldButton type="submit" className="form__button">
                    Зарегистрироваться
                </FieldButton>
                {isClient && <p className='form__confirmation'>Подтвердите адрес электронной почты. Письмо со ссылкой для подтверждения отправлено на указанную вами почту.</p>}
                <div className='form__registers'>
                    {isClient && <Link to={'/enterPage/client'} className='form__enter'>Вход клиента</Link>}
                    {isDoctor && (
                        <>
                            <Link to={'/enterPage/partner'} className='form__register'>Вход врача</Link>
                            <Link to={'/enterPage/registerClinic'} className='form__register'>Регистрация клиники</Link>
                        </>
                    )}
                    {isClinic && (
                        <>
                            <Link to={'/enterPage/partner'} className='form__register'>Вход клиники</Link>
                            <Link to={'/enterPage/registerDoctor'} className='form__register'>Регистрация врача</Link>
                        </>
                    )}
                </div>
            </form>
        </div>
    );
};

export default Register;
