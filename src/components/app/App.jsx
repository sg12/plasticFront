import 'normalize.css'
import './App.scss'

import FilterDoctor from '../filterDoctor/FilterDoctor'
import Articles from '../articles/Articles'
import NotFound from '../notFound/NotFound'

function App() {

	return (
		<>
			<FilterDoctor />
			<Articles />
			<NotFound />
		</>
	)
}

export default App
