import './CardsList.scss';

import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import PlasticServices from '../../services/PlasticServices';

import CardsItemHorizontal from '../cardsItemHorizontal/CardsItemHorizontal';
import OutlineButton from '../UI/button/outlineButton/OutlineButton';
import Spinner from '../spinner/Spinner';

import { useFetching } from '../../hooks/useFetching';

const CardsList = (props) => {

	const [posts, setPosts] = useState([]);
	const [page, setPage] = useState(1);
	const [totalCount, setTotalCount] = useState(0);

	const [fetchPosts, isPostsLoading, postError] = useFetching(async () => {
		const response = await PlasticServices.getAllClinics(page);
		setPosts([...posts, ...response.data]);
		setPage(page + 1);
		setTotalCount(response.headers['x-total-count']);
	});

	const onRequest = () => {
		fetchPosts();
	};

	useEffect(() => {
		onRequest();
	}, []);

	const loadMorePosts = () => {
		onRequest();
	};

	const content = !(!isPostsLoading && !postError && posts.length === 0)
		? posts.map((post) => (
			<CardsItemHorizontal post={post} key={post.id} />
		))
		: <h3 className='articles-item__title' style={{ margin: 'auto', textAlign: 'center' }}>Нет статей</h3>;

	const error = postError ? <h3 className='articles-item__title' style={{ textAlign: 'center' }}>Ошибка: {postError}</h3> : null;

	const spinner = isPostsLoading ? <Spinner /> : null;

	const button = totalCount > posts.length || error || spinner
		? <OutlineButton className='articles__button' style={{ margin: 'auto' }} onClick={loadMorePosts}>Показать ещё</OutlineButton>
		: null;

	return (
		<div className='list-cards'>
			<div className='list-cards__container container'>
				<h2 className='list-cards__title'>{props.title}</h2>
				<p>(Добавить фильтрацию)</p>
				<ul className='list-cards__box'>
					{content}
				</ul>
				{error}
				{spinner}
				{button}
			</div>
		</div>
	);
};

CardsList.propTypes = {
	title: PropTypes.string.isRequired,
};


export default CardsList;