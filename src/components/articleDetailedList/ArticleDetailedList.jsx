import './ArticleDetailedList.scss';

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";

import PlasticServices from '../../services/PlasticServices';

import ArticleDetailedItem from '../articleDetailedItem/ArticleDetailedItem';
import Spinner from '../spinner/Spinner';
import OutlineButton from '../UI/buttons/outlineButton/OutlineButton';

import { useFetching } from '../../hooks/useFetching';

const ArticleDetailedList = () => {

	const [article, setArticle] = useState([]);

	const params = useParams();

	const navigate = useNavigate();

	const [fetchPosts, isPostsLoading, postError] = useFetching(async () => {
		const response = await PlasticServices.getArticle(params.id);
		setArticle([response.data]);
	});

	useEffect(() => {
		fetchPosts();
	}, []);

	const content = !(!isPostsLoading && !postError && article.length === 0)
		? article.map((post) => (
			<ArticleDetailedItem post={post} key={post.id} />
		))
		: <h3 className='component-content-text'>Нет врача</h3>;

	const error = postError
		? <h3 className='component-error-text'>Ошибка: {postError}</h3>
		: null;

	const spinner = isPostsLoading
		? <Spinner />
		: null;

	const button = error || spinner || article.length === 0
		? <OutlineButton className='component-button-text' onClick={() => navigate(-1)}>Вернутся назад</OutlineButton>
		: null;

	return (
		<>
			<section className='article-detailed-list section'>
				<div className='article-detailed-list__container container'>
					{content}
					{error}
					{spinner}
					{button}
				</div>
			</section>
		</>
	);
};

export default ArticleDetailedList;