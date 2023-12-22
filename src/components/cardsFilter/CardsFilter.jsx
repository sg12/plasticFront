import './CardsFilter.scss';

import PropTypes from 'prop-types';

import CardsInput from '../UI/inputs/CardsInput';
import CardsSelect from '../UI/selects/cardsSelect/CardsSelect';

const CardsFilter = ({ filter, setFilter }) => {
	return (
		<>
			<CardsInput
				placeholder='Поиск'
				value={filter.query}
				onChange={e => setFilter({ ...filter, query: e.target.value })}
			/>
			<CardsSelect
				value={filter.sort}
				onChange={selectedSort => setFilter({ ...filter, sort: selectedSort })}
				defaultValue='Сортировка'
				options={[
					{ value: 'id', name: 'По индексу' },
					{ value: 'idReverse', name: 'По обратному индексу' },
					{ value: 'title', name: 'По названию' },
					{ value: 'body', name: 'По описанию' },
				]}
			/>
		</>
	);
};

CardsFilter.propTypes = {
	filter: PropTypes.object.isRequired,
	setFilter: PropTypes.any.isRequired,
};

export default CardsFilter;