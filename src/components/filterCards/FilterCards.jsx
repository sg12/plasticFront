import './FilterCards.scss';

import PropTypes from 'prop-types';

import { useState } from 'react';

// import CardsInput from '../UI/inputs/cardsInput/CardsInput';
import CardsSelect from '../UI/selects/cardsSelect/CardsSelect';
import CenterModal from '../UI/modals/centerModal/CenterModal';
// import SortDropdowns from '../UI/dropdowns/sortDropdowns/SortDropdowns';
import OutlineButton from '../UI/buttons/outlineButton/OutlineButton';

//!!! добавить стили для текста

const FilterCards = ({ filter, setFilter, ...props }) => {

	const [modal, setModal] = useState(false);
	const [tempFilter, setTempFilter] = useState(filter);

	const handleFilterChange = (field, value) => {
		setTempFilter({ ...tempFilter, [field]: value });
	};

	const applyFilter = () => {
		setFilter(tempFilter);
	};

	const resetFilter = () => {
		setTempFilter(filter);
	};

	const filters = (props.doctors === 'doctors')
		? <DoctorFilter />
		: (props.clinics === 'clinics')
			? <ClinicFilter />
			: null;

	return (

		<div className='filter-cards'>
			<OutlineButton onClick={() => setModal(true)}>Фильтр</OutlineButton>
			<CenterModal visible={modal} setVisible={setModal}>
				<div className='filter-cards__box'>
					{/* <div className='filter-cards__item'>
						<p>Название клиники</p>
						<CardsInput
							value={tempFilter.search}
							onChange={(e) => setTempFilter({ ...tempFilter, search: e.target.value })}
						// onChange={(e) => handleFilterChange('search', e.target.value)}
						// onChange={(selectedSort) => handleFilterChange('search', selectedSort)}
						/>
					</div> */}
					{/* <div className='filter-cards__item'>
						<p>Оценка</p>
						<CardsSelect
							value={filter.rating}
							onChange={selectedSort => setFilter({ ...filter, rating: selectedSort })}
							defaultValue='Выберите оценку'
							options={[
								{ value: '', name: 'Любая' },
								{ value: '0', name: 'От 0' },
								{ value: '1', name: 'От 1' },
								{ value: '2', name: 'От 2' },
								{ value: '3', name: 'От 3' },
								{ value: '4', name: 'От 4' },
								{ value: '5', name: 'От 5' },
							]}
						/>
					</div> */}
					{/* <div className='filter-cards__item'>
						<p>Тип приёма</p>
						<CardsSelect
							value={filter.reception}
							onChange={selectedSort => setFilter({ ...filter, reception: selectedSort })}
							defaultValue='Выберите тип приёма'
							options={[
								{ value: '', name: 'Любая' },
								{ value: 'clinic', name: 'В клинике' },
								{ value: 'home', name: 'На дому' },
							]}
						/>
					</div> */}
					<div className='filter-cards__item'>
						<p>Лимит</p>
						<CardsSelect
							value={tempFilter.limit}
							onChange={(selectedLimit) => handleFilterChange('limit', selectedLimit)}
							defaultValue='Выберите лимит'
							options={[
								{ value: '1', name: 'Один' },
								{ value: '2', name: 'Два' },
								{ value: '3', name: 'Три' },
								{ value: '6', name: 'Шесть' },
							]}
						/>
					</div>
					<div className='filter-cards__item'>
						<p>Тип клиники</p>
						<CardsSelect
							value={tempFilter.reception}
							onChange={(selectedReception) => handleFilterChange('reception', selectedReception)}
							defaultValue='Выберите тип клиники'
							options={[
								{ value: '', name: 'Любая' },
								{ value: 'clinic', name: 'Государственная' },
								{ value: 'private', name: 'Частная' },
							]}
						/>
					</div>
					{filters}
					<div className='filter-cards__buttons'>
						<OutlineButton onClick={applyFilter}>Применить</OutlineButton>
						<OutlineButton onClick={resetFilter}>Сбросить</OutlineButton>
					</div>
				</div>
			</CenterModal>
			<div className='filter-cards__hr' />
			<CardsSelect
				style={{ width: '300px' }}
				value={tempFilter.sort}
				onChange={(selectedSort) => {
					handleFilterChange('sort', selectedSort);
					setFilter({ ...filter, sort: selectedSort });
				}}
				defaultValue='Выберите сортировку'
				options={[
					{ value: '', name: 'По умолчанию' },
					{ value: 'rating', name: 'По рейтингу' },
					{ value: 'reviews', name: 'По количеству отзывов' },
				]}
			/>
		</div >
	);
	function ClinicFilter() {
		return (
			<>
				<div className='filter-cards__item'>
					<p>Услуги</p>
					<CardsSelect
						value={tempFilter.service}
						onChange={(selectedService) => handleFilterChange('service', selectedService)}
						defaultValue='Выберите услугу'
						options={[
							{ value: '', name: 'Любая' },
							{ value: 'rinoplastic', name: 'Ринопластика' },
							{ value: 'blephaplastic', name: 'Блефаропластика' },
							{ value: 'liposakcia', name: 'Липосакция' },
							{ value: 'lifting', name: 'Подтяжка' },
							{ value: 'mammoplastic', name: 'Маммопластика' },
							{ value: 'lipophiling', name: 'Липофилинг' },
							{ value: 'genioplastic', name: 'Гениопластичный' },
							{ value: 'genitoplastic', name: 'Генитопластика' },
							{ value: 'feiclifting', name: 'поднятие тяжестей ???' },
							{ value: 'ginekomastia', name: 'Гинекомастия' },
							{ value: 'ymenshenie_jelez', name: 'изменение климата ???' },
							{ value: 'plastic_yagodic', name: 'пластиковая ягодка ???' },
							{ value: 'plastic_sheya', name: 'пластиковая шейя ???' },
						]}
					/>
				</div>
			</>
		);
	}

	function DoctorFilter() {
		return (
			<>
				<div className='filter-cards__item'>
					<p>Специальность</p>
					<CardsSelect
						value={tempFilter.specialtie}
						onChange={(selectedSpecialtie) => handleFilterChange('specialtie', selectedSpecialtie)}
						defaultValue='Выберите специальность'
						options={[
							{ value: '', name: 'Любая' },
							{ value: 'plasticheskiy-khirurg', name: 'пластический хирург' },
							{ value: 'esteticheskiy-khirurg', name: 'эстетический-хирург' },
							{ value: 'khirurg-po-rekonstruktsii-grudi', name: 'хирург-по-реконструкции-груди' },
							{ value: 'liposaktsionnyy-khirurg', name: 'липосакционный хирург' },
							{ value: 'rinoplasticheskiy-khirurg', name: 'ринопластический хирург' },
							{ value: 'blefaroplasticheskiy-khirurg', name: 'блефаропластический хирург' },
							{ value: 'mammoplasticheskiy-khirurg', name: 'маммопластический хирург' },
							{ value: 'abdominoplasticheskiy-khirurg', name: 'абдоминопластический хирург' },
							{ value: 'liftingovyy-khirurg', name: 'лифтинговый-хирург' },
							{ value: 'lipofilingovyy-khirurg', name: 'липофилинговый хирург' },
							{ value: 'brachioplasticheskiy-khirurg', name: 'брахиопластический хирург' },
						]}
					/>
				</div>
				<div className='filter-cards__item'>
					<p>Пол</p>
					<CardsSelect
						value={tempFilter.gender}
						onChange={(selectedGender) => handleFilterChange('gender', selectedGender)}
						defaultValue='Выберите пол'
						options={[
							{ value: '', name: 'Любой' },
							{ value: 'female', name: 'Женский' },
							{ value: 'male', name: 'Мужской' },
						]}
					/>
				</div>
				{/* <div className='filter-cards__item'>
					<p>Категория</p>
					<CardsSelect
						value={tempFilter.category}
						onChange={(selectedCategory) => handleFilterChange('category', selectedCategory)}
						defaultValue='Выберите категорию'
						options={[
							{ value: '', name: 'Любая' },
							{ value: 'first', name: 'Первая' },
							{ value: 'second', name: 'Вторая' },
							{ value: 'higher', name: 'Высшая' },
						]}
					/>
				</div> */}
			</>
		);
	}
};

FilterCards.propTypes = {
	doctors: PropTypes.string,
	clinics: PropTypes.string,
	filter: PropTypes.object.isRequired,
	setFilter: PropTypes.func.isRequired,
};

export default FilterCards;