import './ArticlesItem.scss';

import PropTypes from 'prop-types';

import { useNavigate } from 'react-router-dom';

import articles1 from '../../assets/imgs/articles-1.png';

const ArticlesItem = (props) => {

	const navigate = useNavigate();

	const toArticlesMore = () => {
		navigate(`/articles/${props.post.id}`);
	};

	return (
		<li className='articles__item articles-item'>
			<div className='articles-item__box'>
				<img className='articles-item__img' src={articles1} alt="статья" />
				<div className='articles-item__info'>
					<p className='articles-item__theme'>Болезни и лечение</p>
					<p className='articles-item__date'>{props.post.id}</p>
				</div>
				<h3 className='articles-item__title'>{props.post.name.slice(0, 300)} ...</h3>
				<p className='articles-item__text'>
					{props.post.description.slice(0, 300)} ...
				</p>
				<button onClick={toArticlesMore} className='articles-item__button'>Читать дальше</button>
			</div>
		</li>
	);
};

ArticlesItem.propTypes = {
	post: PropTypes.shape({
		id: PropTypes.number.isRequired,
		name: PropTypes.string.isRequired,
		description: PropTypes.string.isRequired,
	}).isRequired,
};

export default ArticlesItem;