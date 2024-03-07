import './ClinicsCardsList.scss';

import { useState, useEffect } from 'react';

import PlasticServices from '../../services/PlasticServices';

import ClinicsCardsItem from '../clinicsCardsItem/ClinicsCardsItem';
import OutlineButton from '../UI/buttons/outlineButton/OutlineButton';
import Spinner from '../spinner/Spinner';

import { useFetching } from '../../hooks/useFetching';
import { getPageArray, getPageCount } from '../../utils/pagesPosts/PagesPosts';

const ClinicsCardsList = () => {

	//1.55.00 https://www.youtube.com/watch?v=GNrdg3PzpJQ&list=WL&index=26&t=7328s

	const [posts, setPosts] = useState([]);
	const [limit, setLimit] = useState(6);
	const [offset, setOffset] = useState(0);
	const [totalCount, setTotalCount] = useState(0);
	console.log('тотал каунт', totalCount);
	console.log('лимит', limit);

	const [totalPages, setTotalPages] = useState(0);

	const [fetchPosts, isPostsLoading, postError] = useFetching(async () => {
		const response = await PlasticServices.getAllClinics(limit, offset);
		setPosts([...posts, ...response.data]);
		setOffset(offset + 6);
		setTotalCount(response.headers['x-total-count']);
		setTotalPages(getPageCount(totalCount, limit));
	});
	console.log('страницы клиник', totalPages);

	let pagesArray = getPageArray(totalPages);
	console.log('массив страниц', pagesArray);

	const onRequest = () => {
		fetchPosts();
	};

	useEffect(() => {
		onRequest();
	}, []);

	// useEffect(() => {
	// 	onRequest(limit, offset);
	// }, []);

	const loadMorePosts = () => {
		onRequest();
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

	// const button = totalCount > posts.length || error || spinner
	// 	? <OutlineButton className='component-button-text' onClick={loadMorePosts}>Показать ещё</OutlineButton>
	// 	: null;

	return (
		<section className='clinics-cards-list'>
			<div className='clinics-cards-list__container container'>
				<h2 className='clinics-cards-list__title'>КЛИНИКИ</h2>
				<ul className='clinics-cards-list__box'>
					{content}
				</ul>
				{error}
				{spinner}
				{/* {button} */}
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

export default ClinicsCardsList;