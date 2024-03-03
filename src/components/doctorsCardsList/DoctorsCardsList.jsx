import './DoctorsCardsList.scss';

import { useState, useEffect } from 'react';

import PlasticServices from '../../services/PlasticServices';

import FilterCards from '../filterCards/FilterCards';
import DoctorsCardsItem from '../doctorsCardsItem/DoctorsCardsItem';
import OutlineButton from '../UI/buttons/outlineButton/OutlineButton';
import Spinner from '../spinner/Spinner';

import { useFetching } from '../../hooks/useFetching';
import { getPageArray, getPageCount } from '../../utils/pagesPosts/PagesPosts';

const DoctorsCardsList = () => {

	const [posts, setPosts] = useState([]);
	// const [limit, setLimit] = useState(2);
	const [offset, setOffset] = useState(0);
	const [totalCount, setTotalCount] = useState(0);

	const [filter, setFilter] = useState({ limit: '1', specialtie: '', gender: '', category: '', rating: '', reception: '', sort: '' });
	// const [filter, setFilter] = useState({ gender: '' });
	console.log('глобальный фильтр', filter);

	const [totalPages, setTotalPages] = useState(0);

	const [fetchPosts, isPostsLoading, postError] = useFetching(async () => {
		const response = await PlasticServices.getAllDoctors(offset, filter);
		console.log('фильтр в фетче', filter);
		// const newPosts = [...response.data];
		// const oldPosts = [...newPosts, ...response.data];
		setPosts([...posts, ...response.data]);
		console.log('посты', [...posts]);
		console.log('респонс', [...response.data]);
		console.log('посты и респонс', [posts]);
		// setLimit(6);
		console.log('лимиты', filter.limit);
		console.log('оффсет', offset);
		//? поставить условие или перенести так как увеличивается без ограничений
		setOffset(Number(filter.limit) + offset);
		setTotalCount(response.headers['x-total-count']);
		// const total = response.headers['x-total-count'];
		setTotalPages(getPageCount(totalCount, filter.limit));
		// setTotalPages(getPageCount(total, Number(filter.limit)));
	});
	// console.log('страницы', totalPages);

	// let pagesArray = getPageArray(totalPages);
	// console.log('массив страниц', pagesArray);

	const onRequest = () => {
		fetchPosts();
		console.log('запрос');
	};

	useEffect(() => {
		onRequest();
		console.log('монтирование');
	}, []);

	const loadMorePosts = () => {
		onRequest();
		console.log('еще посты');
	};

	// useEffect(() => {
	// 	onRequest();
	// }, [filter, offset]);

	const applyFilter = () => {
		console.log('применен фильтр');
		// setPosts([...posts, ...response.data]);
		setPosts([]);
		// setPosts([...posts]);
		console.log('обнуленные посты', posts);
		setOffset(0);
		// fetchPosts();
		onRequest();
	};
	// console.log('обнуленные посты2', posts);

	const content = !(!isPostsLoading && !postError && posts.length === 0)
		? posts.map((post) => (
			<DoctorsCardsItem post={post} key={post.id} />
		))
		: <h3 className='component-content-text'>Нет врачей</h3>;

	const error = postError
		? <h3 className='component-error-text'>Ошибка: {postError}</h3>
		: null;

	const spinner = isPostsLoading
		? <Spinner />
		: null;

	const button = totalCount > posts.length || error || spinner
		? <OutlineButton className='component-button-text' onClick={loadMorePosts}>Показать ещё</OutlineButton>
		: null;

	return (
		<section className='doctors-cards-list'>
			<div className='doctors-cards-list__container container'>
				<h2 className='doctors-cards-list__title'>ВРАЧИ</h2>
				<FilterCards filter={filter} setFilter={setFilter} onUpdate={applyFilter} />
				<ul className='doctors-cards-list__box'>
					{content}
				</ul>
				{error}
				{spinner}
				{button}
				{/* {pagesArray.map((page) => (
					<OutlineButton
						key={page}
						// className='component-button-text'
						onClick={() => setOffset(page)}
					>
						{page}
					</OutlineButton>
				))} */}
			</div>
		</section>
	);
};

export default DoctorsCardsList;