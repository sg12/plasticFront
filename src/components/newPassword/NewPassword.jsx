import EnterButton from "../UI/button/enterButton/EnterButton";

import { useForm } from 'react-hook-form';

import './newPassword.scss';

const NewPassword = () => {
    const {register, formState: { errors }, handleSubmit, watch } = useForm({
        defaultValues:{
            password:'',
            confirm_password:'',
        },
    });

    const onSubmit = (data) => {
        console.log(data);
    }

    return (
        <div className='enter__client client'>
            <a href='#' className='client__link'>Введите новый пароль</a>
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
                <EnterButton type="submit">
                    Отправить
                </EnterButton>
                <p className='form__message'>Не забудьте новый пароль.</p>
                <div className='form__registers'>
                    <a className='form__register' href="#">Вход клиента</a>
                    <a className='form__register' href="#">Вход партнёра</a>
                </div>
            </form>
        </div>
    );
};

export default NewPassword;