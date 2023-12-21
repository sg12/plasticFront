import classes from './CardsFilter.module.scss';

import PropTypes from 'prop-types';

const CardsFilter = ({ options, defaultValue, value, onChange }) => {
	return (
		<select className={classes.select} value={value} onChange={event => onChange(event.target.value)}>
			<option disabled value="">{defaultValue}</option>
			{options.map(option =>
				<option value={option.value} key={option.value}>
					{option.name}
				</option>
			)}
		</select>
	);
};

CardsFilter.propTypes = {
	options: PropTypes.array.isRequired,
	defaultValue: PropTypes.string.isRequired,
};

export default CardsFilter;