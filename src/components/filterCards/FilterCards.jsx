import './FilterCards.scss';

import PropTypes from 'prop-types';

import { useState } from 'react';

import CardsSelect from '../UI/selects/cardsSelect/CardsSelect';
import CenterModal from '../UI/modals/centerModal/CenterModal';
// import SortDropdowns from '../UI/dropdowns/sortDropdowns/SortDropdowns';
import OutlineButton from '../UI/buttons/outlineButton/OutlineButton';

const FilterCards = ({ filter, setFilter }) => {

	const [modal, setModal] = useState(false);

	const [tempFilter, setTempFilter] = useState(filter);

	const handleLimitChange = (selectedLimit) => {
		setTempFilter({ ...tempFilter, limit: selectedLimit });
	};

	const applyFilter = () => {
		setFilter(tempFilter);
	};

	const resetFilter = () => {
		setTempFilter(filter);
	};

	return (
		<div className='filter-cards'>
			<OutlineButton onClick={() => setModal(true)}>Фильтр</OutlineButton>
			<CenterModal visible={modal} setVisible={setModal}>
				<div className='filter-cards__box'>
					{/* <div className='filter-cards__item'>
						<p>Специальность</p>
						<CardsSelect
							value={filter.specialty}
							onChange={selectedSort => setFilter({ ...filter, specialty: selectedSort })}
							defaultValue='Выберите специальность'
							options={[
								{ value: 'any', name: 'Любая' },
								{ value: '1', name: 'Первая' },
								{ value: '2', name: 'Вторая' },
								{ value: '3', name: 'Третья' },
								{ value: '4', name: 'Четвёртая' },
								{ value: '5', name: 'Пятая' },
								{ value: '6', name: 'Шестая' },
								{ value: '7', name: 'Седьмая' },
								{ value: '8', name: 'Восьмая' },
								{ value: '9', name: 'Девятая' },
								{ value: '10', name: 'Десятая' },
							]}
						/>
					</div> */}
					{/* <div className='filter-cards__item'>
						<p>Лимит</p>
						<CardsSelect
							value={filter.limit}
							onChange={selectedSort => setFilter({ ...filter, limit: selectedSort })}
							defaultValue='Выберите лимит'
							options={[
								{ value: '1', name: 'Один' },
								{ value: '2', name: 'Два' },
								{ value: '3', name: 'Три' },
								{ value: '6', name: 'Шесть' },
							]}
						/>
					</div> */}
					<div className='filter-cards__item'>
						<p>Лимит</p>
						<CardsSelect
							value={tempFilter.limit}
							onChange={handleLimitChange}
							defaultValue='Выберите лимит'
							options={[
								{ value: '1', name: 'Один' },
								{ value: '2', name: 'Два' },
								{ value: '3', name: 'Три' },
								{ value: '6', name: 'Шесть' },
							]}
						/>
					</div>
					{/* <div className='filter-cards__item'>
						<p>Пол</p>
						<CardsSelect
							value={filter.gender}
							onChange={selectedSort => setFilter({ ...filter, gender: selectedSort })}
							defaultValue='Выберите пол'
							options={[
								{ value: 'any', name: 'Любая' },
								{ value: 'female', name: 'Женский' },
								{ value: 'male', name: 'Мужской' },
							]}
						/>
					</div> */}
					{/* <div className='filter-cards__item'>
						<p>Категория</p>
						<CardsSelect
							value={filter.category}
							onChange={selectedSort => setFilter({ ...filter, category: selectedSort })}
							defaultValue='Выберите категорию'
							options={[
								{ value: 'any', name: 'Любая' },
								{ value: 'first', name: 'Первая' },
								{ value: 'second', name: 'Вторая' },
								{ value: 'higher', name: 'Высшая' },
							]}
						/>
					</div> */}
					{/* <div className='filter-cards__item'>
						<p>Оценка</p>
						<CardsSelect
							value={filter.rating}
							onChange={selectedSort => setFilter({ ...filter, rating: selectedSort })}
							defaultValue='Выберите оценку'
							options={[
								{ value: 'any', name: 'Любая' },
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
								{ value: 'any', name: 'Любая' },
								{ value: 'clinic', name: 'В клинике' },
								{ value: 'home', name: 'Частная практика' },
							]}
						/>
					</div> */}
					{/* <div className='filter-cards__item'>
						<p>Тип приёма</p>
						<select name="reception" value={reception} onChange={receptionChange}>
							<option value="" disabled hidden>Выберите тип приёма</option>
							<option value="any">Любая</option>
							<option value="clinic">В клинике</option>
							<option value="home">Частная практика</option>
						</select>
					</div> */}
					<div className='filter-cards__item'>
						<button onClick={applyFilter}>Применить</button>
						<button onClick={resetFilter}>Сбросить</button>
					</div>
				</div>
			</CenterModal>
			<div className='filter-cards__hr' />
			{/* <CardsSelect
				value={filter.sort}
				onChange={selectedSort => setFilter({ ...filter, sort: selectedSort })}
				defaultValue='Выберите сортировку'
				options={[
					{ value: 'any', name: 'Любая' },
					{ value: 'rating', name: 'По рейтингу' },
					{ value: 'reviews', name: 'По количеству отзывов' },
				]}
			/> */}
			{/* <select name="sort" value={sort} onChange={sortChange}>
				<option value="" disabled hidden>Выберите сортировку</option>
				<option value="rating">По рейтингу</option>
				<option value="reviews">По количеству отзывов</option>
			</select> */}
		</div >
	);
};

FilterCards.propTypes = {
	filter: PropTypes.object.isRequired,
	setFilter: PropTypes.func.isRequired,
};

export default FilterCards;