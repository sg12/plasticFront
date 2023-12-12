import { Link } from 'react-router-dom';

import EnterButton from '../UI/button/enterButton/EnterButton';

import { useForm } from 'react-hook-form';

import './ForgotPassword.scss';

const ForgotPassword = () => {
    const {register, formState: { errors }, handleSubmit } = useForm({
        defaultValues:{
            email:'',
        },
    });

    const onSubmit = (data) => {
        console.log(data);
    };

    return (
        <div className='enter__client client'>
            <Link to={'/enterPage'} href='#' className='client__link'>Забыли пароль?</Link>
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
                <EnterButton type="submit">
                    Отправить
                </EnterButton>
                <p className='form__message'>На данную почту придёт сообщение с инструкцией по восстановлению пароля</p>
                <div className='form__registers'>
                    <Link to={'/enterPage/enterClient'} className='form__register' href="#">Вход клиента</Link>
                    <Link to={'/enterPage/enterPartner'} className='form__register' href="#">Вход партнёра</Link>
                </div>
            </form>
        </div>
    );
};

export default ForgotPassword;