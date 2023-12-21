import './CardsList.scss';

import PropTypes from 'prop-types';
import { useState, useEffect, useMemo } from 'react';

import PlasticServices from '../../services/PlasticServices';

import CardsItemHorizontal from '../cardsItemHorizontal/CardsItemHorizontal';
import CardsFilter from '../UI/selects/cardsFilter/CardsFilter';
import CardsInput from '../UI/inputs/CardsInput';
import OutlineButton from '../UI/buttons/outlineButton/OutlineButton';
import Spinner from '../spinner/Spinner';

import { useFetching } from '../../hooks/useFetching';

const CardsList = (props) => {

	const [posts, setPosts] = useState([]);
	const [page, setPage] = useState(1);
	const [totalCount, setTotalCount] = useState(0);
	const [selectedSort, setSelectedSort] = useState('');
	const [searchQuery, setSearchQuery] = useState('');

	const sortedPosts = useMemo(() => {
		if (selectedSort) {
			return [...posts].sort((a, b) => {
				if (typeof a[selectedSort] === 'number' && typeof b[selectedSort] === 'number') {
					return a[selectedSort] - b[selectedSort];
				} else {
					return a[selectedSort].localeCompare(b[selectedSort]);
				}
			});
		}
		return posts;
	}, [selectedSort, posts]);

	const sortedAndSearchedPosts = useMemo(() => {
		return sortedPosts.filter(post => post.title.includes(searchQuery));
	}, [searchQuery, sortedPosts]);

	const sortPosts = (sort) => {
		setSelectedSort(sort);
	};

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
				<CardsInput
					placeholder='Поиск'
					value={searchQuery}
					onChange={e => setSearchQuery(e.target.value)}
				/>
				<CardsFilter
					value={selectedSort}
					onChange={sortPosts}
					defaultValue='Сортировка'
					options={[
						{ value: 'id', name: 'По индексу' },
						{ value: 'title', name: 'По названию' },
						{ value: 'body', name: 'По описанию' },
					]} />
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