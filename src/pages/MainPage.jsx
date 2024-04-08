import MyCarousel from '../components/myCarousel/MyCarousel';
import SearchBar from '../components/searchBar/SearchBar';
import ConstructorComp from '../components/constructor/ConstructorComp';
import DoctorsCardsListMainPage from '../components/doctorsCardsListMainPage/DoctorsCardsListMainPage';

const MainPage = () => {

	return (
		<>
			<MyCarousel />
			<SearchBar />
			<DoctorsCardsListMainPage/>
			<ConstructorComp />		
		</>
	);
};

export default MainPage;