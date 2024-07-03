import { Link, useNavigate } from 'react-router-dom';

import { useForm } from 'react-hook-form';

import FieldButton from '../UI/buttons/fieldButton/FieldButton';

import PlasticServices from '../../services/PlasticServices.js';

import Cookies from 'js-cookie';

import './EnterPartner.scss';

const EnterPartner = () => {
    const navigate = useNavigate();

    const {register, formState: { errors }, handleSubmit } = useForm({
        defaultValues:{
            email:'',
            password:'',
        },
    });

    const onSubmit = async ({ email, password }) => {
        const data = { email, password };
        await PlasticServices.loginUser(data);        
        navigate("/account",setTimeout ( () => window.location.reload(), 0));
    };

    return (
        <div className='enter__partner partner'>
            <Link to={'/enterPage'} className='partner__link'>Вход партнёра</Link>
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

                <Link to={'/enterPage/forgotPassword'} className='form__link'>Забыли пароль?</Link>
                <FieldButton type="submit" className="form__button">
                    Войти
                </ FieldButton>
                <p className='form__approval approval'>Нажимая кнопку “Войти”, вы соглашаешься с <a className='approval__link' href="#">Политикой Конфиденциальности</a> и даёте <a className='approval__link' href="#">Согласие на обработку персональных данных</a></p>
                <div className='form__registers'>
                    <Link to={'/enterPage/registerDoctor'} className='form__register'>Регистрация врача</Link>
                    <Link to={'/enterPage/registerClinic'} className='form__register'>Регистрация клиники</Link>
                </div>
            </form>
        </div>
    );
};

export default EnterPartner;
