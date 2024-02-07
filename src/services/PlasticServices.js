import axios from "axios";

// const _apiBase = "https://jsonplaceholder.typicode.com/";
const _apiBase = "http://localhost:8000/api/v1";

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

  static async getUsers(userID, userType) {
    const response = await axios.get(`${_apiBase}/${userType}/${userID}/`);
    return response;
  }

  static async getFaq() {
    const response = await axios.get(`${_apiBase}`);
    return response;
  }

  static async getArticle(id) {
    const response = await axios.get(`${_apiBase}posts/${id}`);
    return response;
  }
}

export default PlasticServices;
