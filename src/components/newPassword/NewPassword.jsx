import FieldButton from "../UI/buttons/fieldButton/FieldButton";

import { useForm } from 'react-hook-form';

import './NewPassword.scss';
import { Link } from "react-router-dom";

const NewPassword = () => {
    const {register, formState: { errors }, handleSubmit, watch } = useForm({
        defaultValues:{
            password:'',
            confirm_password:'',
        },
    });

    const onSubmit = (data) => {
        console.log(data);
    };

    return (
        <div className='enter__client client'>
            <Link to={'/enterPage'} className='client__link'>Введите новый пароль</Link>
            <form className='client__form form' onSubmit={handleSubmit(onSubmit)}>
                <div className='form__box'>
                    <input 
                        className={`form__input${errors?.password ? ' error__input' : ''}`} 
                        type='password' 
                        placeholder='Новый пароль'
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
                        placeholder='Подтвердите новый пароль'
                        {...register('confirm_password', {
                            required: 'Поле обязательно к заполнению',
                            validate: (value) => value === watch('password') || 'Пароли не совпадают',
                        })}
                    />
                    {errors?.confirm_password && <span className='form__span'>{errors?.confirm_password?.message}</span>}
                </div>
                <FieldButton type="submit" className="form__button">
                    Отправить
                </FieldButton>
                <p className='form__message'>Не забудьте новый пароль.</p>
                <div className='form__registers'>
                    <Link to={'/enterPage/client'} className='form__register'>Вход клиента</Link>
                    <Link to={'/enterPage/partner'} className='form__register'>Вход партнёра</Link>
                </div>
            </form>
        </div>
    );
};

export default NewPassword;