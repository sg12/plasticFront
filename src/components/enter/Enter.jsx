import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import FieldButton from '../UI/buttons/fieldButton/FieldButton.jsx';
import PlasticServices from '../../services/PlasticServices.js';
import './Enter.scss';

const Enter = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isClient = location.pathname.includes('client');

    const { register, formState: { errors }, handleSubmit } = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async ({ email, password }) => {
        await PlasticServices.loginUser({ email, password });
        navigate("/account");
    };

    return (
        <div className={`enter__${isClient ? 'client' : 'partner'} ${isClient ? 'client' : 'partner'}`}>
            <Link to={'/enterPage'} className={`${isClient ? 'client' : 'partner'}__link`}>
                {isClient ? 'Вход клиента' : 'Вход партнёра'}
            </Link>
            <form className={`${isClient ? 'client' : 'partner'}__form form`} onSubmit={handleSubmit(onSubmit)}>
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

                <Link to={'/enterPage/forgotPassword'} className='form__link'>Забыли пароль?</Link>
                <FieldButton type="submit" className="form__button">Войти</FieldButton>
                <p className='form__approval approval'>
                    Нажимая кнопку “Войти”, вы соглашаешься с <a className='approval__link' href="#">Политикой Конфиденциальности</a> и даёте <a className='approval__link' href="#">Согласие на обработку персональных данных</a>
                </p>
                {isClient ? (
                    <Link to={'/enterPage/registerClient'} className='form__register'>Регистрация клиента</Link>
                ) : (
                    <div className='form__registers'>
                        <Link to={'/enterPage/registerDoctor'} className='form__register'>Регистрация врача</Link>
                        <Link to={'/enterPage/registerClinic'} className='form__register'>Регистрация клиники</Link>
                    </div>
                )}
            </form>
        </div>
    );
};

export default Enter;
