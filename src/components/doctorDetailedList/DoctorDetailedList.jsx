import './DoctorDetailedList.scss';

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";

import PlasticServices from '../../services/PlasticServices';

import DoctorDetailedItem from '../doctorDetailedItem/DoctorDetailedItem';
import Spinner from '../spinner/Spinner';
import OutlineButton from '../UI/buttons/outlineButton/OutlineButton';

import { useFetching } from '../../hooks/useFetching';

//! https://www.youtube.com/watch?v=GNrdg3PzpJQ&list=WL&index=24&t=7483s
// 1.24.00 - модальное окно
// 1.54.00 - страницы для постов
// 2.22.06 - открытие конкретный пост
// 2.33.00 - ограниченная навигация + глобальные данные
//* 2.27.50 - остановился

const DoctorDetailedList = () => {

	const [doctor, setDoctor] = useState([]);

	const params = useParams();

	const navigate = useNavigate();

	const [fetchPosts, isPostsLoading, postError] = useFetching(async () => {
		const response = await PlasticServices.getDoctor(params.id);
		setDoctor([response.data]);
	});

	useEffect(() => {
		fetchPosts();
	}, []);

	const content = !(!isPostsLoading && !postError && doctor.length === 0)
		? doctor.map((post) => (
			<DoctorDetailedItem post={post} key={post.id} />
		))
		: <h3 className='articles-item__title' style={{ margin: 'auto', textAlign: 'center' }}>Нет врача</h3>;

	const error = postError ? <h3 className='articles-item__title' style={{ textAlign: 'center' }}>Ошибка: {postError}</h3> : null;

	const spinner = isPostsLoading ? <Spinner /> : null;

	const button = error || spinner
		? <OutlineButton className='articles__button' style={{ margin: 'auto' }} onClick={() => navigate(-1)}>Вернутся назад</OutlineButton>
		: null;

	return (
		<>
			<section className='doctor-detailed-list'>
				<div className='doctor-detailed-list__container container'>
					{content}
					{error}
					{spinner}
					{button}
				</div>
			</section>
		</>
	);
};

export default DoctorDetailedList;