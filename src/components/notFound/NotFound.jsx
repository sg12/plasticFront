import './NotFound.scss';

import notFoundImg from '../../assets/imgs/not-found.png';

const NotFound = () => {
	return (
		<>
			<section className='not-found'>
				<div className='not-found__container container'>
					<div className='not-found__wrapper'>
						<div className='not-found__left-wrapper'>
							<h2 className='not-found__title-h2'>ОШИБКА</h2>
							<h3 className='not-found__title-h3'>404</h3>
							<p className='not-found__text'>Похоже, страницу, которую вы ищите, не найдена</p>
						</div>
						<div className='not-found__right-wrapper'>
							<img src={notFoundImg} alt="not-found" />
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

export default NotFound;