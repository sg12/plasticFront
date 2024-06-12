import './ClinicDetailedList.scss';

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";

import PlasticServices from '../../services/PlasticServices';

import ClinicDetailedItem from '../clinicDetailedItem/ClinicDetailedItem';
import Spinner from '../spinner/Spinner';
import OutlineButton from '../UI/buttons/outlineButton/OutlineButton';

import { useFetching } from '../../hooks/useFetching';

const ClinicDetailedList = () => {

	const [clinic, setClinic] = useState([]);

	const params = useParams();

	const navigate = useNavigate();

	const [fetchPosts, isPostsLoading, postError] = useFetching(async () => {
		const response = await PlasticServices.getClinic(params.id);
		setClinic([response.data]);
	});

	useEffect(() => {
		fetchPosts();
	}, []);

	const content = !(!isPostsLoading && !postError && clinic.length === 0)
		? clinic.map((post) => (
			<ClinicDetailedItem post={post} key={post.id} />
		))
		: <h3 className='component-content-text'>Нет клиники</h3>;

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
			<section className='clinic-detailed-list section'>
				<div className='clinic-detailed-list__container container'>
					{content}
					{error}
					{spinner}
					{button}
				</div>
			</section>
		</>
	);
};

export default ClinicDetailedList;