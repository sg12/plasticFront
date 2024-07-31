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
  static async getDoctors(
    search,
    specialtie,
    experience,
    category,
    degree,
    reception,
    ordering,
    gender,
    page,
    limit
  ) {
    const response = await axiosInstance.get(
      `/doctors?search=${search}&specialtie=${specialtie}&experience=${experience}&category=${category}&degree=${degree}&reception=${reception}&ordering=${ordering}&gender=${gender}&page=${page}&limit=${limit}&`
    );
    return response;
  }

  static async getDoctor(id) {
    const response = await axiosInstance.get(`/doctors/${id}`);
    return response.data;
  }

  static async postClinicReview(data, id) {
    return await axiosInstance.post(`/clinics/${id}/reviews`, data);
  }

  //////////////////////////////
  ////// PROFILE REQUESTS //////
  //////////////////////////////

  static async getUser() {
    const profile = await axiosInstance.get("/profile");
    const profileMore = await axiosInstance.get(
      `/profile/${profile?.data?.role}`
    );

    return {
      data: {
        ...profile.data,
        ...profileMore.data,
      },
    };
  }

  static async patchUser(editedData, role) {
    const response = await axiosInstance.patch(`/profile/${role}`, {
      data: editedData,
    });
    return console.log(response, editedData);
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

  static async deleteTicket(id) {
    return await axiosInstance.delete(`/tickets/${id}`);
  }

  static async getReviewsClinics(id) {
    return await axiosInstance.get(`/clinics/${id}/reviews`);
  }

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

  static async postFavorities(data) {
    const response = await axiosInstance.post(
      "/profile/client/favorities",
      data
    );
    return response.data;
  }

  static async deleteFavorities(id) {
    return await axiosInstance.delete(`/profile/client/favorities/${id}`);
  }

  static async getAdditionally(userType, type) {
    const additionally = await axiosInstance.get(
      `/profile/${userType}/${type}`
    );
    return additionally.data;
  }

  static async postAdditionally(userType, type, data) {
    const additionally = await axiosInstance.post(
      `/profile/${userType}/${type}`,
      data
    );
    return additionally.data;
  }

  static async deleteAdditionally(userType, type, index) {
    return await axiosInstance.delete(`/profile/${userType}/${type}/${index}`);
  }

  static async getLocation() {
    const cities = await axiosInstance.get("/cities");
    const districts = await axiosInstance.get("/districts");
    const metro = await axiosInstance.get("/metro");
    const location = {
      cities: cities.data,
      districts: districts.data,
      metro: metro.data,
    };
    return location;
  }

  static async getEmployes() {
    const employes = await axiosInstance.get("/profile/employes");
    return employes.data;
  }

  static async postEmployee() {
    return await axiosInstance.post("/profile/employes");
  }

  static async getServices(userType) {
    const services = await axiosInstance.get(`/profile/${userType}/services`);
    return services.data;
  }

  static async getDoctorsForAppointment(search) {
    const response = await axiosInstance.get(`/doctors?search=${search}`);
    return response.data.result;
  }

  static async getDoctorServices(id) {
    const response = await axiosInstance.get(`/doctors/${id}/services`);
    return response.data;
  }

  static async getReceptions() {
    const response = await axiosInstance.get("/profile/client/receptions");
    return response.data;
  }

  static async addReceptions(data) {
    const response = await axiosInstance.post(
      "/profile/client/receptions",
      data
    );
    return response.data;
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
