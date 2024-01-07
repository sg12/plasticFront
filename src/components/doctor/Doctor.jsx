import './Doctor.scss';

import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";

import PlasticServices from '../../services/PlasticServices';

import Spinner from '../spinner/Spinner';

import { useFetching } from '../../hooks/useFetching';

const Doctor = () => {

	//!!! отделить контент в отдельный компонент doctorId, чтобы удобнее работать с состоянием и обертку переименовать по лучше?

	const [doctor, setDoctor] = useState([]);

	const params = useParams();

	const [fetchPosts, isPostsLoading, postError] = useFetching(async () => {
		const response = await PlasticServices.getDoctor(params.id);
		setDoctor(response.data);
		// console.log([response.data]);
		// setPage(page + 1);
		// setTotalCount(response.headers['x-total-count']);
	});

	useEffect(() => {
		fetchPosts();
	}, []);

	// const content = !(!isPostsLoading && !postError)
	// 	? doctor
	// 	: <h3 className='articles-item__title' style={{ margin: 'auto', textAlign: 'center' }}>Нет врача</h3>;

	// const content = doctor.map((post) => (
	// 	<Doctor post={post} key={post.id} />
	// ));
	// console.log(content);

	const error = postError ? <h3 className='articles-item__title' style={{ textAlign: 'center' }}>Ошибка: {postError}</h3> : null;

	const spinner = isPostsLoading ? <Spinner /> : null;

	// const button = totalCount > posts.length || error || spinner
	// 	? <OutlineButton className='articles__button' style={{ margin: 'auto' }} onClick={loadMorePosts}>Показать ещё</OutlineButton>
	// 	: null;

	return (
		<>
			<p>Тут должна быть врач {params.id}, но ее здесь нет, печалька</p>
			<p>{doctor.id}</p>
			<p>{doctor.title}</p>
			<p>{doctor.body}</p>
			{/* {content} */}
			{error}
			{spinner}
		</>
	);
};

export default Doctor;