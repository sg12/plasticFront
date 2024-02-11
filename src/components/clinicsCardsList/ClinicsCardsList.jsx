import './ClinicsCardsList.scss';

import { useState, useEffect } from 'react';

import PlasticServices from '../../services/PlasticServices';

import ClinicsCardsItem from '../clinicsCardsItem/ClinicsCardsItem';
import OutlineButton from '../UI/buttons/outlineButton/OutlineButton';
import Spinner from '../spinner/Spinner';

import { useFetching } from '../../hooks/useFetching';

const ClinicsCardsList = () => {

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
			<ClinicsCardsItem post={post} key={post.id} />
		))
		: <h3 className='articles-item__title' style={{ margin: 'auto', textAlign: 'center' }}>Нет клиник</h3>;

	const error = postError ? <h3 className='articles-item__title' style={{ textAlign: 'center' }}>Ошибка: {postError}</h3> : null;

	const spinner = isPostsLoading ? <Spinner /> : null;

	const button = totalCount > posts.length || error || spinner
		? <OutlineButton className='articles__button' style={{ margin: 'auto' }} onClick={loadMorePosts}>Показать ещё</OutlineButton>
		: null;

	return (
		<section className='clinics-cards-list'>
			<div className='clinics-cards-list__container container'>
				<h2 className='clinics-cards-list__title'>КЛИНИКИ</h2>
				<ul className='clinics-cards-list__box'>
					{content}
				</ul>
				{error}
				{spinner}
				{button}
			</div>
		</section>
	);
};

export default ClinicsCardsList;