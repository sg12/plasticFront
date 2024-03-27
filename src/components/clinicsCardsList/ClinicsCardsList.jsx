import './ClinicsCardsList.scss';

import { useState, useEffect } from 'react';

import PlasticServices from '../../services/PlasticServices';

import PaginationPosts from '../UI/pagination/paginationPosts/PaginationPosts';

import ClinicsCardsItem from '../clinicsCardsItem/ClinicsCardsItem';
import Spinner from '../spinner/Spinner';
import FilterCards from '../filterCards/FilterCards';

import { useFetching } from '../../hooks/useFetching';
import { getPageCount } from '../../utils/pagesPosts/PagesPosts';

const ClinicsCardsList = () => {

	const [posts, setPosts] = useState([]);
	// const [limit, setLimit] = useState(6);
	// console.log('лимит', limit);
	const [page, setPage] = useState(1);
	console.log('страница', page);

	const [totalPages, setTotalPages] = useState(0);
	console.log('страницы клиник', totalPages);

	// const [filter, setFilter] = useState({ limit: '1', specialtie: '', gender: '', category: '', rating: '', reception: '', sort: '' });
	const [filter, setFilter] = useState({ limit: '1' });
	console.log('глобальный фильтр', filter);

	const [fetchPosts, isPostsLoading, postError] = useFetching(async () => {
		const response = await PlasticServices.getAllClinics(filter.limit, page);
		setPosts(response.data);
		const totalCount = response.headers['x-total-count'];
		setTotalPages(getPageCount(totalCount, filter.limit));
	});

	//!!! использовать useMemo, чтобы не пересчитывать
	// let pagesArray = getPageArray(totalPages);
	// console.log('массив страниц', [pagesArray]);

	// const onRequest = () => {
	// 	fetchPosts();
	// };

	// useEffect(() => {
	// 	onRequest();
	// }, []);

	useEffect(() => {
		fetchPosts();
	}, [page, filter]);

	// const loadMorePosts = () => {
	// 	onRequest();
	// };

	const changePage = (page) => {
		setPage(page);
	};

	console.log('---------------------------------');

	const content = !(!isPostsLoading && !postError && posts.length === 0)
		? posts.map((post) => (
			<ClinicsCardsItem post={post} key={post.id} />
		))
		: <h3 className='component-content-text'>Нет клиник</h3>;

	const error = postError
		? <h3 className='component-error-text'>Ошибка: {postError}</h3>
		: null;

	const spinner = isPostsLoading
		? <Spinner />
		: null;

	return (
		<section className='clinics-cards-list'>
			<div className='clinics-cards-list__container container'>
				<h2 className='clinics-cards-list__title'>КЛИНИКИ</h2>
				<FilterCards filter={filter} setFilter={setFilter} />
				<ul className='clinics-cards-list__box'>
					{content}
				</ul>
				{error}
				{spinner}
				<PaginationPosts
					totalPages={totalPages}
					page={page}
					changePage={changePage}
				/>
			</div>
		</section>
	);
};

export default ClinicsCardsList;