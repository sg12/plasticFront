import axios from "axios";

const _apiBase = 'https://jsonplaceholder.typicode.com/';

class PlasticServices {

	static async getAllArticles(page = 1) {
		const response = await axios.get(`${_apiBase}posts?_limit=6&_page=${page}`);
		return response;
	}

	static async getAllClinics(page = 1) {
		const response = await axios.get(`${_apiBase}posts?_limit=6&_page=${page}`);
		return response;
	}

	static async getClinic(id) {
		const response = await axios.get(`${_apiBase}posts/${id}`);
		return response;
	}

	static async getAllDoctors(page = 1) {
		const response = await axios.get(`${_apiBase}posts?_limit=6&_page=${page}`);
		return response;
	}

	static async getDoctor(id) {
		const response = await axios.get(`${_apiBase}posts/${id}`);
		return response;
	}

	static async getUsers(userID = 6, userType = "users") {
		const response = await axios.get(`${_apiBase}/${userType}/${userID}/`);
		return response;
	}

	static async getArticle(id) {
		const response = await axios.get(`${_apiBase}posts/${id}`);
		return response;
	}
	
	static async registerUser(data, type) {
		try {
			const response = await axios.post(`http://localhost:8000/api/v1/auth/register/${type}/`, data);
			return response.data; // Ответ от сервера (можно обработать по вашему усмотрению)
		} catch (error) {
			console.error('Ошибка при регистрации:', error);
		}
	}

	static async loginUser(data) {
		try {
			const response = await axios.post(`http://localhost:8000/api/v1/auth/login/`, data);
			return response.data; // Ответ от сервера (можно обработать по вашему усмотрению)
		} catch (error) {
			console.error('Ошибка при авторизации:', error);
		}
	}
}

export default PlasticServices;