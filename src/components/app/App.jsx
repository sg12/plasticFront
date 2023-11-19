import 'normalize.css'
import './App.scss'

import FilterDoctor from '../filterDoctor/FilterDoctor'
import Articles from '../articles/Articles'
import NotFound from '../notFound/NotFound'
import Header from '../header/Header'
import Courusel from '../carousel/Carousel'
import SearchBar from '../search bar/Searchbar'

function App() {

	return (
		<>
			<Header />
			<Courusel />
			<SearchBar />
			<FilterDoctor />
			<Articles />
			<NotFound />
		</>
	)
}

export default App
