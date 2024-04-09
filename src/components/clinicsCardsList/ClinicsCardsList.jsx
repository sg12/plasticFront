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
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const [filter, setFilter] = useState({ limit: '6', search: '', service: '', reception: '', sort: '' });

	const [fetchPosts, isPostsLoading, postError] = useFetching(async () => {
		const response = await PlasticServices.getAllClinics(filter.limit, page, filter.search, filter.service, filter.reception, filter.sort);
		setPosts(response.data);
		const totalCount = response.headers['x-total-count'];
		setTotalPages(getPageCount(totalCount, filter.limit));
	});

	useEffect(() => {
		fetchPosts();
	}, [page, filter]);

	const changePage = (page) => {
		setPage(page);
	};

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
				<FilterCards filter={filter} setFilter={setFilter} setPage={setPage} clinics={'clinics'} />
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