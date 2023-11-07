import axios from 'axios';

import { useState, useEffect } from 'react';

import './Articles.scss';

import articles1 from '../../assets/imgs/articles-1.png'
import logoArticle from '../../assets/icons/logo-article.png'
import views from '../../assets/icons/views.png'

const Articles = () => {

	const [posts, setPosts] = useState([]);
	const [pageNumber, setPageNumber] = useState(1);
	const [totalPosts, setTotalPosts] = useState(0);

	useEffect(() => {
		fetchPosts();
		setPageNumber(pageNumber + 1);
	}, []);

	const fetchPosts = () => {
		axios
			.get(`https://jsonplaceholder.typicode.com/posts?_page=${pageNumber}&_limit=3`)
			.then((response) => {
				setTotalPosts(response.headers['x-total-count']);
				setPosts((prevPosts) => [...prevPosts, ...response.data]);
			});
	};

	const loadMorePosts = () => {
		setPageNumber(pageNumber + 1);
		fetchPosts();
	};

	return (
		<section className='articles'>
			<div className='articles__container container'>
				<h2 className='articles__title title-h2'>Статьи</h2>
				<div className='articles__box'>
					{posts.map((post) => (
						<div key={post.id} className='articles__item articles-item'>
							<img className='articles-item__img' src={articles1} alt="статья" />
							<div className='articles-item__box'>
								<div className='articles-item__company'>
									<img className='articles-item__logo' src={logoArticle} alt="логотип" />
									<p className='articles-item__name text-h3'>{post.id}</p>
								</div>
								<h3 className='articles-item__title title-h3'>{post.title.slice(0, 40)} ...</h3>
								<p className='articles-item__text text-h3'>
									{post.body.slice(0, 200)} ...
								</p>
								<button className='articles-item__button'>Читать</button>
								<div className='articles-item__info'>
									<p className='articles-item__data text-h3'>01.01.2023</p>
									<div className='articles-item__views'>
										<img className='articles-item__views-img' src={views} alt="просмотры" />
										<p className='articles-item__views-text text-h3'>723</p>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
				{totalPosts > posts.length && (
					<button className='articles__button' onClick={loadMorePosts}>
						Показать ещё
					</button>
				)}
			</div>
		</section>
	)
}

export default Articles