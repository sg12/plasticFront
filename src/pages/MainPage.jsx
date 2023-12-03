import MyCarousel from '../components/myCarousel/MyCarousel';
import SearchBar from '../components/searchBar/SearchBar';
import FilterDoctor from '../components/filterDoctor/FilterDoctor';
import ArticlesList from '../components/articlesList/ArticlesList';

const MainPage = () => {

	return (
		<>
			<MyCarousel />
			<SearchBar />
			<FilterDoctor />
			<ArticlesList />
		</>
	);
};

export default MainPage;