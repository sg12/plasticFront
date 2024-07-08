// import { createContext, useContext, useReducer } from "react";

// const AuthContext = createContext();

// const initialState = {
//   isAuthenticated: true,
// };

// const authReducer = (state, action) => {
//   switch (action.type) {
//     case "LOGIN":
//       return {
//         ...state,
//         isAuthenticated: true,
//       };
//     case "LOGOUT":
//       return {
//         ...state,
//         isAuthenticated: false,
//       };
//     default:
//       return state;
//   }
// };

// export const AuthProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(authReducer, initialState);

//   return (
//     <AuthContext.Provider value={{ state, dispatch }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   return useContext(AuthContext);
// };
