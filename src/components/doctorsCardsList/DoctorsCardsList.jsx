import './DoctorsCardsList.scss';

import { useState, useEffect } from 'react';

import PlasticServices from '../../services/PlasticServices';

import PaginationPosts from '../UI/pagination/paginationPosts/PaginationPosts';

import FilterCards from '../filterCards/FilterCards';
import DoctorsCardsItem from '../doctorsCardsItem/DoctorsCardsItem';
import Spinner from '../spinner/Spinner';
import OutlineButton from '../UI/buttons/outlineButton/OutlineButton';

import { useFetching } from '../../hooks/useFetching';
import { getPageCount } from '../../utils/pagesPosts/PagesPosts';

const DoctorsCardsList = () => {

	const [posts, setPosts] = useState([]);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const [filter, setFilter] = useState({ limit: '6', search: '', specialtie: '', gender: '', category: '', rating: '', reception: '', sort: '' });

	const [fetchPosts, isPostsLoading, postError] = useFetching(async () => {
		const response = await PlasticServices.getAllDoctors(filter.limit, page, filter.search, filter.specialtie, filter.gender, filter.category, filter.rating, filter.reception, filter.sort);
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
			<DoctorsCardsItem post={post} key={post.id} />
		))
		: <h3 className='component-content-text'>Нет врачей</h3>;

	const error = postError
		? <h3 className='component-error-text'>Ошибка: {postError}</h3>
		: null;

	const spinner = isPostsLoading
		? <Spinner />
		: null;

	const reload = (postError && posts.length === 0)
		? <OutlineButton className='component-button-text' onClick={() => fetchPosts()}>Обновить</OutlineButton>
		: null;

	return (
		<section className='doctors-cards-list section'>
			<div className='doctors-cards-list__container container'>
				<h2 className='title-h2'>ВРАЧИ</h2>
				<FilterCards filter={filter} setFilter={setFilter} setPage={setPage} doctors={'doctors'} />
				<ul className='doctors-cards-list__box'>
					{content}
				</ul>
				{error}
				{spinner}
				{reload}
				<PaginationPosts
					totalPages={totalPages}
					page={page}
					changePage={changePage}
				/>
			</div>
		</section>
	);
};

export default DoctorsCardsList;