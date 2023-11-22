import axios from 'axios';

import { useState, useEffect } from 'react';

import './Articles.scss';

import articles1 from '../../assets/imgs/articles-1.png'

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
				<h2 className='articles__title'>СТАТЬИ</h2>
				<div className='articles__box'>
					{posts.map((post) => (
						<div key={post.id} className='articles__item articles-item'>
							<div className='articles-item__box'>
								<img className='articles-item__img' src={articles1} alt="статья" />
								<div className='articles-item__info'>
									<p className='articles-item__theme'>Болезни и лечение</p>
									<p className='articles-item__date'>{post.id}</p>
								</div>
								<h3 className='articles-item__title'>{post.title.slice(0, 60)} ...</h3>
								<p className='articles-item__text'>
									{post.body.slice(0, 300)} ...
								</p>
								<button className='articles-item__button'>Читать дальше</button>
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