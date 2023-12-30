import './Contacts.scss';

import CallButton from '../UI/buttons/callButton/CallButton';

const Contacts = () => {
	return (
		<div>
			<h4>(Название клиники на данном месте):</h4>
			<p>ул. Военная, д. 4</p>
			<h4>ЗАПИСАТЬСЯ НА ПРИЁМ:</h4>
			<CallButton >(Добавить номер телефона)</CallButton>
		</div>
	);
};

export default Contacts;