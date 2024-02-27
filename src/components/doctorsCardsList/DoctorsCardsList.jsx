import './DoctorsCardsList.scss';

import { useState, useEffect } from 'react';

import PlasticServices from '../../services/PlasticServices';

import DoctorsCardsItem from '../doctorsCardsItem/DoctorsCardsItem';
import OutlineButton from '../UI/buttons/outlineButton/OutlineButton';
import Spinner from '../spinner/Spinner';

import { useFetching } from '../../hooks/useFetching';

const DoctorsCardsList = () => {

	const [posts, setPosts] = useState([]);
	const [offset, setOffset] = useState(0);
	const [totalCount, setTotalCount] = useState(0);

	const [fetchPosts, isPostsLoading, postError] = useFetching(async () => {
		const response = await PlasticServices.getAllDoctors(offset);
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
				<ul className='doctors-cards-list__box'>
					{content}
				</ul>
				{error}
				{spinner}
				{button}
			</div>
		</section>
	);
};

export default DoctorsCardsList;