import { Link } from 'react-router-dom';

import FieldButton from '../UI/buttons/fieldButton/FieldButton';

import { useForm } from 'react-hook-form';

import './RegisterClinic.scss';

const RegisterClinic = () => {
    const {register, formState: { errors }, handleSubmit, watch} = useForm({
        defaultValues:{
            email:'',
            password:'',
            confirm_password:'',
        },
    });

    const onSubmit = (data) => {
        console.log(data);
    };

    return (
        <div className='enter__client client'>
            <Link to={'/enterPage/enterPartner'} href='#' className='client__link'>Регистрация клиники</Link>
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

                <FieldButton type="submit">
                    Зарегистрироваться
                </FieldButton>
                <div className='form__registers'>
                    <Link to={'/enterPage/enterPartner'} className='form__register'>Вход клиники</Link>
                    <Link to={'/enterPage/registerDoctor'} className='form__register'>Регистрация врача</Link>
                </div>
            </form>
        </div>
    );
};

export default RegisterClinic;
