import classes from './CardsSelect.module.scss';

import PropTypes from 'prop-types';

const CardsSelect = ({ options, defaultValue, value, onChange }) => {
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

CardsSelect.propTypes = {
	options: PropTypes.array.isRequired,
	defaultValue: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	onChange: PropTypes.any.isRequired,
};

export default CardsSelect;