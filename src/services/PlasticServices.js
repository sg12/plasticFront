import axios from "axios";
import Cookies from "js-cookie";

const _apiBase = import.meta.env.VITE_API_URL;

// Функция для создания экземпляра axios с токеном из куки
let axiosInstance = axios.create({
  baseURL: _apiBase,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const key = Cookies.get("key");
    if (key) {
      config.headers.Authorization = `Token ${key}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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

  //////////////////////////////
  ////// PROFILE REQUESTS //////
  //////////////////////////////

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
    return await axiosInstance.get("/faq");
  }

  static async getTickets() {
    return await axiosInstance.get("/tickets");
  }

  static async postTicket(formTicket) {
    return await axiosInstance.post("/tickets", { ...formTicket });
  }

  // static async getReviews(userType) {
  //   return await axiosInstance.post(`/reviews`);
  // }

  static async getFavorities() {
    const clinics = await axiosInstance.get(
      "/profile/client/favorities/clinics"
    );
    const doctors = await axiosInstance.get(
      "/profile/client/favorities/doctors"
    );

    return {
      data: [...clinics.data, ...doctors.data],
    };
  }

  static async deleteFavorities(id) {
    return await axiosInstance.post(`/profile/client/favorities/${id}`);
  }

  static async postAdditionally(type, data) {
    const additionally = await axiosInstance.post(
      `/profile/doctor/${type}`,
      data
    );
    return additionally.data;
  }

  static async getAdditionally(userType, type) {
    const additionally = await axiosInstance.get(`/profile/${userType}/${type}`);
    return additionally.data;
  }

  ///////////////////////////
  ////// AUTH REQUESTS //////
  ///////////////////////////

  static async registerUser(data, userType) {
    const response = await axiosInstance.post(
      `/auth/register/${userType}`,
      data
    );
    return Cookies.set("key", response.data.key);
  }

  static async loginUser(data) {
    const response = await axiosInstance.post("/auth/login", data);
    return Cookies.set("key", response.data.key);
  }

  static async logoutUser() {
    await axiosInstance.get("/auth/logout");
    return Cookies.remove("key");
  }

  static async deleteUser() {
    await axiosInstance.get("/auth/delete");
    return Cookies.remove("key");
  }
}

export default PlasticServices;
