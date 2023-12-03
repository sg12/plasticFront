import { useState, useEffect } from 'react';

import './ArticlesList.scss';

import ArticlesServices from '../../services/articlesServices';

import ArticlesItem from '../articlesItem/ArticlesItem';
import MyButton from '../UI/button/MyButton';
import Spinner from '../spinner/Spinner';

import { useFetching } from '../../hooks/useFetching';

const ArticlesList = () => {

	const [posts, setPosts] = useState([]);
	const [page, setPage] = useState(1);
	const [totalCount, setTotalCount] = useState(0);

	const [fetchPosts, isPostsLoading, postError] = useFetching(async () => {
		const response = await ArticlesServices.getAll(page);
		setPosts([...posts, ...response.data]);
		setTotalCount(response.headers['x-total-count']);
	});

	const onRequest = () => {
		setPage(page + 1);
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
			<ArticlesItem post={post} key={post.id} />
		))
		: <h3 className='articles-item__title' style={{ margin: 'auto' }}>Нет статей</h3>;

	const error = (postError) ? <h3 className='articles-item__title' style={{ margin: 'auto' }}>Ошибка: {postError}</h3> : null;

	const spinner = isPostsLoading ? <Spinner /> : null;

	return (
		<section className='articles'>
			<div className='articles__container container'>
				<h2 className='articles__title'>СТАТЬИ</h2>
				<ul className='articles__box'>
					{content}
					{error}
					{spinner}
				</ul>
				{totalCount > posts.length && (
					<MyButton className='articles__button' style={{ margin: 'auto' }} onClick={loadMorePosts}>
						Показать ещё
					</MyButton>
				)}
			</div>
		</section>
	);
};

export default ArticlesList;