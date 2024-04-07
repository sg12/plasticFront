import axios from "axios";

// const _apiBase = "https://jsonplaceholder.typicode.com/";
const _apiBase = "http://localhost:8000/api/v1";

class PlasticServices {
	static async getAllArticles(offset = 0) {
		const response = await axios.get(`${_apiBase}/articles?limit=6&offset=${offset}`);
		return response;
	}

	//! изменить формат времени
	static async getArticle(id) {
		const response = await axios.get(`${_apiBase}/articles/${id}`);
		return response;
	}

	static async getAllClinics(limit, page, search, service, reception, sort) {
		const response = await axios.get(`${_apiBase}/clinics?limit=${limit}&page=${page}&search=${search}&service=${service}&reception=${reception}&sort=${sort}`);
		return response;
	}

	static async getClinic(id) {
		const response = await axios.get(`${_apiBase}/clinics/${id}`);
		return response;
	}

	// static async getAllDoctors(offset = 0) {
	// 	const response = await axios.get(`${_apiBase}/surgeons?limit=6&offset=${offset}`);
	// 	return response;
	// }

	static async getAllDoctors(offset, { ...filter }) {
		console.log('гет доктор', filter);
		const response = await axios.get(`${_apiBase}/clinics?limit=${filter.limit}&offset=${offset}&specialtie=${filter.specialtie}&gender=${filter.gender}&category=${filter.category}&rating=${filter.rating}&reception=${filter.reception}&sort=${filter.sort}`);
		return response;
	}

	static async getDoctor(id) {
		const response = await axios.get(`${_apiBase}/surgeons/${id}`);
		return response;
	}

	static async getUsers(userID, userType) {
		const response = await axios.get(`${_apiBase}/${userType}/${userID}/`);
		return response;
	}

	static async patchUser() {
		const response = await axios.patch(`${_apiBase}/account/`);
		return response;
	}

	static async getFaq() {
		const response = await axios.get(`${_apiBase}/faq/`);
		return response;
	}

	static async registerUser(data, type) {
		try {
			const response = await axios.post(`${_apiBase}/auth/register/${type}/`, data);
			return response.data; // Ответ от сервера (можно обработать по вашему усмотрению)
		} catch (error) {
			window.alert('Ошибка при регистрации: ' + error.message);
			console.error('Ошибка при регистрации:', error);
		}
	}

	static async loginUser(data) {
		try {
			const response = await axios.post(`${_apiBase}/auth/login/`, data);
			return response.data; // Ответ от сервера (можно обработать по вашему усмотрению)
		} catch (error) {
			window.alert('Ошибка при авторизации: ' + error.message);
			console.error('Ошибка при авторизации:', error);
		}
	}
}

export default PlasticServices;
