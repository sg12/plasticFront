import './ClinicsCardsList.scss';

import { useState, useEffect } from 'react';

import PlasticServices from '../../services/PlasticServices';

import ClinicsCardsItem from '../clinicsCardsItem/ClinicsCardsItem';
import OutlineButton from '../UI/buttons/outlineButton/OutlineButton';
import Spinner from '../spinner/Spinner';

import { useFetching } from '../../hooks/useFetching';

const ClinicsCardsList = () => {

	const [posts, setPosts] = useState([]);
	const [offset, setOffset] = useState(0);
	const [totalCount, setTotalCount] = useState(0);

	const [fetchPosts, isPostsLoading, postError] = useFetching(async () => {
		const response = await PlasticServices.getAllClinics(offset);
		setPosts([...posts, ...response.data]);
		setOffset(offset + 6);
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
		: <h3 className='component-content-text'>Нет клиник</h3>;

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