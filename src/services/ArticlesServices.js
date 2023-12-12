import axios from "axios";

export default class ArticlesServices {
	static async getAll(page = 1) {
		const response = await axios.get(`https://jsonplaceholder.typicode.com/posts?_limit=6&_page=${page}`);
		return response;
	}
}