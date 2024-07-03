import axios from "axios";
import Cookies from "js-cookie";

const _apiBase = import.meta.env.VITE_API_URL;

// Функция для создания экземпляра axios с токеном из куки
const createAxiosInstance = () => {
  return axios.create({
    baseURL: _apiBase,
    headers: {
      Authorization: `Token ${Cookies.get("key")}`,
      "Content-Type": "application/json",
    },
  });
};

let axiosInstance = createAxiosInstance();

class PlasticServices {
  static async getAllArticles(page) {
    const response = await axios.get(
      `${_apiBase}/articles?limit=6&page=${page}`
    );
    return response;
  }

  //! изменить формат времени
  static async getArticle(id) {
    const response = await axios.get(`${_apiBase}/articles/${id}`);
    return response;
  }

  //! прокидывать значение через функцию или цикл
  static async getAllClinics(limit, page, search, service, reception, sort) {
    const response = await axios.get(
      `${_apiBase}/clinics?limit=${limit}&page=${page}&search=${search}&service=${service}&reception=${reception}&sort=${sort}`
    );
    return response;
  }

  static async getClinic(id) {
    const response = await axios.get(`${_apiBase}/clinics/${id}`);
    return response;
  }

  //! прокидывать значение через функцию или цикл
  static async getAllDoctors(
    limit,
    page,
    search,
    specialtie,
    gender,
    category,
    rating,
    reception,
    sort
  ) {
    const response = await axios.get(
      `${_apiBase}/surgeons?limit=${limit}&page=${page}&search=${search}&specialtie=${specialtie}&gender=${gender}&category=${category}&rating=${rating}&reception=${reception}&sort=${sort}`
    );
    return response;
  }

  static async getDoctor(id) {
    const response = await axios.get(`${_apiBase}/surgeons/${id}`);
    return response;
  }

  static async getUser() {
    const profile = await axiosInstance.get("/profile");
    const profileMore = await axiosInstance.get(
      `/profile/${profile.data.role}`
    );

    return {
      data: {
        ...profile.data,
        ...profileMore.data,
      },
    };
  }

  static async patchUser(editedData, role) {
    return await axiosInstance.patch(`/profile/${role}`, { data: editedData });
  }

  static async getFaq() {
    return await axiosInstance.get(`${_apiBase}/faq`);
  }

  static async registerUser(data, type) {
    const response = await axiosInstance.post(
      `${_apiBase}/auth/register/${type}`,
      data
    );
    return Cookies.set("key", response.data.key);
  }

  static async loginUser(data) {
    const response = await axiosInstance.post(`${_apiBase}/auth/login`, data);
    return Cookies.set("key", response.data.key);
  }

  static async logoutUser() {
    await axiosInstance.get("/auth/logout");
    return Cookies.remove("token");
  }
}

export default PlasticServices;
