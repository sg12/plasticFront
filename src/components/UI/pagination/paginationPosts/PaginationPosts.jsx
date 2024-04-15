import classes from './PaginationPosts.module.scss';

import PropTypes from 'prop-types';

import OutlineButton from '../../buttons/outlineButton/OutlineButton';

import { getPageArray } from '../../../../utils/pagesPosts/PagesPosts';

const PaginationPosts = ({ totalPages, page, changePage, ...props }) => {

	let pagesArray = getPageArray(totalPages);

	return (
		<div {...props} className={`${classes.paginationPosts} ${props.className}`}>
			{pagesArray.map((i) => (
				<OutlineButton
					key={i}
					onClick={() => changePage(i)}
					className={page === i
						? `${classes.paginationPosts__button} ${classes.paginationPosts__button_active}`
						: `${classes.paginationPosts__button}`}
				>
					{i}
				</OutlineButton>
			))}
		</div>
	);
};

PaginationPosts.propTypes = {
	className: PropTypes.string,
	totalPages: PropTypes.number,
	page: PropTypes.number,
	changePage: PropTypes.func,
};

export default PaginationPosts;