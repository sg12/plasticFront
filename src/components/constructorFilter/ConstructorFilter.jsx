import './ConstructorFilter.scss';

import { useState } from 'react';

import CenterModal from '../UI/modals/centerModal/CenterModal';
import OutlineButton from '../UI/buttons/outlineButton/OutlineButton';

import instruction1 from '../../assets/imgs/instruction-1.png';
import instruction2 from '../../assets/imgs/instruction-2.png';
import instruction3 from '../../assets/imgs/instruction-3.png';
import instruction4 from '../../assets/imgs/instruction-4.png';
import instruction5 from '../../assets/imgs/instruction-5.png';
import instruction6 from '../../assets/imgs/instruction-6.png';


const ConstructorFilter = ({ setActiveFace, setActiveFaceStyle }) => {
    const [modal, setModal] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');

    const handleGenderButtonClick = (gender) => {
        if (gender=='Мужской'){
            setActiveFace('man');
        }
        if (gender=='Женский'){
            setActiveFace('woman');
        }
        console.log(gender);
    };

    const handleSelectChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedOption(selectedValue);
        if (selectedValue=='Азиатский'){
            setActiveFaceStyle('asian'); 
        }
        if (selectedValue=='Европейский'){
            setActiveFaceStyle('european'); 
        }
        console.log(selectedValue);
    };

    return (
        <div className='constructor-filter__container'>
            <div className='constructor-filter__container-flex'>
                <div className='constructor-filter__buttons'>  
                    <OutlineButton 
                        className='constructor-filter__button-woman'
                        onClick={() => handleGenderButtonClick('Женский')}
                    >
                        Женщина
                    </OutlineButton>
                    
                    <OutlineButton 
                        className='constructor-filter__button-man'
                        onClick={() => handleGenderButtonClick('Мужской')}
                    >
                        Мужчина
                    </OutlineButton>
                </div>
                <div className='constructor-filter__select-bg'>
                    <select
                        className='constructor-filter__select'
                        onChange={handleSelectChange}
                        value={selectedOption}
                    >        
                        <option value="" disabled selected>Тип внешности</option>
                        <option value="Азиатский">Азиатский </option>
                        <option value="Европейский">Европейский </option>
                    </select>
                </div>
                <button className='constructor-filter__instruction' onClick={() => setModal(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 54 54" fill="none">
                        <rect x="1" y="1" width="52" height="52" rx="15" fill="white" stroke="#D9D9D9" strokeWidth="2"/>
                        <path d="M19.7919 20.8896L19.8204 19.513C19.8329 18.9085 19.9365 18.3094 20.1276 17.7359L20.2034 17.5085C20.2936 17.2376 20.4137 16.9775 20.5613 16.733V16.733C20.8528 16.2502 21.2466 15.8371 21.7148 15.5227L22.3412 15.1022L23.3412 14.6024L23.8361 14.3544C24.1716 14.1864 24.5187 14.0426 24.8748 13.9243V13.9243C25.5166 13.7111 26.1832 13.5819 26.8582 13.5401L27.5039 13.5L27.8429 13.5264C28.5061 13.5779 29.1606 13.7105 29.7916 13.921L29.874 13.9485C30.1852 14.0524 30.4886 14.1781 30.782 14.3249V14.3249C31.154 14.5111 31.5086 14.7304 31.8414 14.9802L32.0039 15.1022L33.0039 16.1011L33.3086 16.4666C33.6593 16.8874 33.9501 17.3548 34.1726 17.8555V17.8555C34.3924 18.3502 34.5435 18.8728 34.6215 19.4085L34.6564 19.6481C34.776 20.4689 34.7161 21.3111 34.4837 22.1073V22.1073C34.3874 22.4373 34.2609 22.7601 34.1068 23.0673V23.0673C33.9276 23.4247 33.7113 23.7622 33.4615 24.0743L31.8365 26.1043L28.8778 29.0618C28.5175 29.422 28.1936 29.8168 27.9109 30.2406L27.7324 30.5082C27.469 30.903 27.2595 31.3312 27.1093 31.7814V31.7814C26.9278 32.3256 26.8351 32.8955 26.8349 33.4692L26.8343 35.6029" stroke="#D9D9D9" strokeWidth="5"/>
                        <rect x="24.002" y="39.6729" width="5.5" height="5.5" rx="2" fill="#D9D9D9"/>
                    </svg>
                    <div className='constructor-filter__instruction-tooltip'>Инструкция</div>
                </button>
                <CenterModal visible={modal} setVisible={setModal}>
					<div className='constructor-filter__instruction-modal'>
                        <h3 className='constructor-filter__instruction-modal-title'>ИНСТРУКЦИЯ</h3>

                        <div className='constructor-filter__instruction-modal-container'>
                            <img className='constructor-filter__instruction-modal-img' src={instruction1} alt="Инструкция №1" />
                            <p className='constructor-filter__instruction-modal-text'>При необходимости измените пол модели</p>
                            <p className='constructor-filter__instruction-modal-text'>Перед началом работы с моделью выберите нужный параметр “Типа внешности”, который отображен в области выше.</p>
                        </div>

                        <div className='constructor-filter__instruction-modal-container'>
                            <img className='constructor-filter__instruction-modal-img' src={instruction2} alt="Инструкция №2" />
                            <p className='constructor-filter__instruction-modal-text'>Нажмите на область, соответствующей части лица, на которую вы хотите получить информацию о доступных услугах пластической хирургии. </p>
                        </div>

                        <div className='constructor-filter__instruction-modal-container'>
                            <img className='constructor-filter__instruction-modal-img' src={instruction3} alt="Инструкция №3" />
                            <p className='constructor-filter__instruction-modal-text'>Выберите из предложенного списка понравившуюся услугу. После нажатия на конкретную услугу Вам  будут  доступны клиники, которые занимаются данным профилем.</p>
                        </div>

                        <div className='constructor-filter__instruction-modal-container'>
                            <img className='constructor-filter__instruction-modal-img' src={instruction4} alt="Инструкция №4" />
                            <p className='constructor-filter__instruction-modal-text'>Просмотрите предложенную информацию. При нажатии на клинику портал перенесёт вас на её информационную страницу</p>
                        </div>

                        <div className='constructor-filter__instruction-modal-container'>
                            <img className='constructor-filter__instruction-modal-img' src={instruction5} alt="Инструкция №5" />
                            <p className='constructor-filter__instruction-modal-text'>Упростите свой поиск, выбрав интервал отображающихся цен.</p>
                        </div>

                        <div className='constructor-filter__instruction-modal-container'>
                            <img className='constructor-filter__instruction-modal-img' src={instruction6} alt="Инструкция №6" />
                            <p className='constructor-filter__instruction-modal-text'>Просмотрите все услуги по ранее выбранной области, предлагаемые агрегатором, воспользовавшись выпадающим списком. </p>
                        </div>
                    </div>
				</CenterModal>
            </div>
        </div>
    );
};

export default ConstructorFilter;