import axios from "axios";

const _apiBase = 'https://jsonplaceholder.typicode.com/posts';

class PlasticServices {

	static async getAllArticles(page = 1) {
		const response = await axios.get(`${_apiBase}?_limit=6&_page=${page}`);
		return response;
	}

	static async getAllClinics(page = 1) {
		const response = await axios.get(`${_apiBase}?_limit=6&_page=${page}`);
		return response;
	}
}

export default PlasticServices;