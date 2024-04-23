import MyCarousel from '../components/myCarousel/MyCarousel';
import SearchBar from '../components/searchBar/SearchBar';
import ConstructorComp from '../components/constructor/ConstructorComp';
import DoctorsCardsListMainPage from '../components/doctorsCardsListMainPage/DoctorsCardsListMainPage';
import ClinicsCardsListMainPage from '../components/ClinicsCardsListMainPage/ClinicsCardsListMainPage';
const MainPage = () => {

	return (
		<>
			<MyCarousel />
			<SearchBar />
			<DoctorsCardsListMainPage/>
			<ClinicsCardsListMainPage/>
			<ConstructorComp />		
		</>
	);
};

export default MainPage;