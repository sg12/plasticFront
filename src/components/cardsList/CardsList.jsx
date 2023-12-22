import './CardsList.scss';

import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import PlasticServices from '../../services/PlasticServices';

import CardsItemHorizontal from '../cardsItemHorizontal/CardsItemHorizontal';
import CardsFilter from '../cardsFilter/CardsFilter';
import OutlineButton from '../UI/buttons/outlineButton/OutlineButton';
import Spinner from '../spinner/Spinner';

import { useFetching } from '../../hooks/useFetching';
// ? Переименовать хук для фильтрации ?
import { usePosts } from '../../hooks/usePosts';

//! https://www.youtube.com/watch?v=GNrdg3PzpJQ&list=WL&index=24&t=7483s
// 1.24.00 - модальное окно
// 1.36.24 - остановился

const CardsList = (props) => {

	const [posts, setPosts] = useState([]);
	const [page, setPage] = useState(1);
	const [totalCount, setTotalCount] = useState(0);

	const [filter, setFilter] = useState({ sort: '', query: '' });
	const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query);

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

	const content = !(!isPostsLoading && !postError && sortedAndSearchedPosts.length === 0)
		? sortedAndSearchedPosts.map((post) => (
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
				<CardsFilter filter={filter} setFilter={setFilter} />
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