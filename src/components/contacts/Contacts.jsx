import './Contacts.scss';

import CallButton from '../UI/buttons/callButton/CallButton';

const Contacts = () => {
	return (
		<div className='contacts'>
			<h3 className='title-h3'>(Название клиники на данном месте)</h3>
			<p className='text'>ул. Военная, д. 4</p>
			<h3 className='title-h3'>ЗАПИСАТЬСЯ НА ПРИЁМ:</h3>
			<CallButton>(Добавить номер телефона)</CallButton>
		</div>
	);
};

export default Contacts;