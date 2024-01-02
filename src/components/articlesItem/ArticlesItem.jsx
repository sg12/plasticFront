import PropTypes from 'prop-types';

import './ArticlesItem.scss';

import articles1 from '../../assets/imgs/articles-1.png';
import { Link } from 'react-router-dom';

const ArticlesItem = (props) => {

	return (
		<li className='articles__item articles-item'>
			<div className='articles-item__box'>
				<img className='articles-item__img' src={articles1} alt="статья" />
				<div className='articles-item__info'>
					<p className='articles-item__theme'>Болезни и лечение</p>
					<p className='articles-item__date'>{props.post.id}</p>
				</div>
				<h3 className='articles-item__title'>{props.post.title.slice(0, 300)} ...</h3>
				<p className='articles-item__text'>
					{props.post.body.slice(0, 300)} ...
				</p>
				<Link to={'/articlesMore'} className='articles-item__button'>Читать дальше</Link>
			</div>
		</li>
	);
};

ArticlesItem.propTypes = {
	post: PropTypes.shape({
		id: PropTypes.number.isRequired,
		title: PropTypes.string.isRequired,
		body: PropTypes.string.isRequired,
	}).isRequired,
};

export default ArticlesItem;