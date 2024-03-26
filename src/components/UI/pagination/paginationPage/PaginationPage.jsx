import classes from './PaginationPage.module.scss';

import PropTypes from 'prop-types';

import OutlineButton from '../../buttons/outlineButton/OutlineButton';

import { getPageArray } from '../../../../utils/pagesPosts/PagesPosts';

const PaginationPage = ({ totalPages, page, changePage, ...props }) => {

	let pagesArray = getPageArray(totalPages);

	return (
		<div {...props} className={`${classes.paginationPage} ${props.className}`}>
			{pagesArray.map((i) => (
				<OutlineButton
					key={i}
					onClick={() => changePage(i)}
					className={page === i
						? `${classes.paginationPage__button} ${classes.paginationPage__button_active}`
						: `${classes.paginationPage__button}`}
				>
					{i}
				</OutlineButton>
			))}
		</div>
	);
};

PaginationPage.propTypes = {
	className: PropTypes.string,
	totalPages: PropTypes.number,
	page: PropTypes.number,
	changePage: PropTypes.func,
};

export default PaginationPage;