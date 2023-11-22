import MyCarousel from '../components/myCarousel/MyCarousel'
import SearchBar from '../components/searchBar/SearchBar'
import FilterDoctor from '../components/filterDoctor/FilterDoctor'
import Articles from '../components/articles/Articles'

const MainPage = () => {
	return (
		<>
			<MyCarousel />
			<SearchBar />
			<FilterDoctor />
			<Articles />
		</>
	)
}

export default MainPage