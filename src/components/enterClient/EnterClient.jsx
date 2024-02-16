import { Link } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';

import FieldButton from '../UI/buttons/fieldButton/FieldButton';

import { useForm } from 'react-hook-form';

import PlasticServices from '../../services/PlasticServices.js';

import Cookies from 'js-cookie';

import './EnterClient.scss';

const EnterClient = () => {
    const navigate = useNavigate();

    const {register, formState: { errors }, handleSubmit } = useForm({
        defaultValues:{
            email:'',
            password:'',
        },
    });

    const onSubmit = async ({ email, password }) => {
        const data = { email, password };
        const respData = await PlasticServices.loginUser(data);
        console.log(respData);
        Cookies.set('token', respData.token);
        navigate("/account")
    };

    return (
        <div className='enter__client client'>
            <Link to={'/enterPage/'} href='#' className='client__link'>Вход клиента</Link>
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

                <Link to={'/enterPage/forgotPassword'} className='form__link'>Забыли пароль?</Link>
                <FieldButton type="submit">
                    Войти
                </FieldButton>
                <p className='form__approval approval'>Нажимая кнопку “Войти”, вы соглашаешься с <a className='approval__link' href="#">Политикой Конфиденциальности</a> и даёте <a className='approval__link' href="#">Согласие на обработку персональных данных</a></p>
                <Link to={'/enterPage/registerClient'} className='form__register' href="#">Регистрация клиента</Link>
            </form>
        </div>
    );
};

export default EnterClient;
