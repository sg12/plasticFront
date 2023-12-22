import axios from "axios";

// export default class ProfileServices {
//   static async fetchUserData() {
//     const apiUrlUsers = "https://jsonplaceholder.typicode.com/users?_limit=3";
//     const apiUrlPhoto = "https://jsonplaceholder.typicode.com/photos?_limit=3";

//     try {
//       const [usersResponse, photoResponse] = await axios.all([
//         axios.get(apiUrlUsers),
//         axios.get(apiUrlPhoto),
//       ]);

//       return {
//         users: usersResponse.data,
//         photo: photoResponse.data,
//       };
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//       throw error;
//     }
//   }
// }


export default class ProfileServices {
  static async get
}


// import axios from "axios";

// export default class ArticlesServices {
// 	static async getAll(page = 1) {
// 		const response = await axios.get(`https://jsonplaceholder.typicode.com/posts?_limit=3&_page=${page}`);
// 		return response;
// 	}
// }