import classes from './SortDropdowns.module.scss';

import PropTypes from 'prop-types';

const SortDropdowns = ({ children, ...props }) => {
	return (
		<div {...props} className={`${classes.SortDropdowns} ${props.className}`}>
			{/* {children} */}
			<p>hello world</p>
			<div className={classes.SortDropdowns__content}>
				{/* {children} */}
				<button>По рейтингу</button>
				<button>По количеству отзывов</button>
			</div>
		</div>
	);
};

SortDropdowns.propTypes = {
	children: PropTypes.string.isRequired,
	className: PropTypes.string,
};

export default SortDropdowns;