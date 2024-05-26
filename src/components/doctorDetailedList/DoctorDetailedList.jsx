import './DoctorDetailedList.scss';

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";

import PlasticServices from '../../services/PlasticServices';

import DoctorDetailedItem from '../doctorDetailedItem/DoctorDetailedItem';
import Spinner from '../spinner/Spinner';
import OutlineButton from '../UI/buttons/outlineButton/OutlineButton';

import { useFetching } from '../../hooks/useFetching';

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
		: <h3 className='component-content-text'>Нет врача</h3>;

	const error = postError
		? <h3 className='component-error-text'>Ошибка: {postError}</h3>
		: null;

	const spinner = isPostsLoading
		? <Spinner />
		: null;

	const button = error || spinner
		? <OutlineButton className='component-button-text' onClick={() => navigate(-1)}>Вернутся назад</OutlineButton>
		: null;

	return (
		<>
			<section className='doctor-detailed-list section'>
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