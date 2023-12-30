import axios from "axios";

// const _apiBase = 'http://localhost:8000/api/v1'
const _apiBase = 'https://jsonplaceholder.typicode.com'

export default class ProfileServices {

  static async getUsers(userID = 1, userType = "users") {
    try {
      const response = await fetch(`${_apiBase}/${userType}/${userID}/`);
      
      if (!response.ok) {
        throw new Error(`Error fetching user data: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  }
  

  // static async getPhotos(photoID = 3) {
  //   try {
  //     const response = await axios.get(`${_apiBase}/photos/${photoID}`);
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error fetching photo data:", error);
  //     throw error;
  //   }
  // }
}