import axios from "axios";
import Cookies from "js-cookie";

const _apiBase = import.meta.env.VITE_API_URL;

// const _apiBase = "https://jsonplaceholder.typicode.com/";
// const _apiBase = "http://localhost:8000/api/v1";

// Функция для создания экземпляра axios с токеном из куки
const createAxiosInstance = () => {
	return axios.create({
		baseURL: _apiBase,
		headers: {
			"Authorization": `Token ${Cookies.get("token")}`,
			"Content-Type": "application/json",
		},
	});
};

const axiosInstance = createAxiosInstance();

class PlasticServices {
	static async getAllArticles(page) {
		const response = await axios.get(`${_apiBase}/articles?limit=6&page=${page}`);
		return response;
	}

	//! изменить формат времени
	static async getArticle(id) {
		const response = await axios.get(`${_apiBase}/articles/${id}`);
		return response;
	}

	//! прокидывать значение через функцию или цикл
	static async getAllClinics(limit, page, search, service, reception, sort) {
		const response = await axios.get(`${_apiBase}/clinics?limit=${limit}&page=${page}&search=${search}&service=${service}&reception=${reception}&sort=${sort}`);
		return response;
	}

	static async getClinic(id) {
		const response = await axios.get(`${_apiBase}/clinics/${id}`);
		return response;
	}

	//! прокидывать значение через функцию или цикл
	static async getAllDoctors(limit, page, search, specialtie, gender, category, rating, reception, sort) {
		const response = await axios.get(`${_apiBase}/surgeons?limit=${limit}&page=${page}&search=${search}&specialtie=${specialtie}&gender=${gender}&category=${category}&rating=${rating}&reception=${reception}&sort=${sort}`);
		return response;
	}

	static async getDoctor(id) {
		const response = await axios.get(`${_apiBase}/surgeons/${id}`);
		return response;
	}

	static async getUser() {
		const response = await axiosInstance.get("/account/");
		return response;
	}

	static async patchUser(editedData) {
		const response = await axiosInstance.patch("/account/", { user: editedData }, { date_born: editedData?.date_born });
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

	static async logoutUser() {
		const response = await axiosInstance.get("/auth/logout/");
		Cookies.remove("token");
		return response;
	}
}

export default PlasticServices;
