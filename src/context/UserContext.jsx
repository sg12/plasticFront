import { createContext, useContext } from "react";

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children, userData, userType }) => {
  return (
    <UserContext.Provider value={{userData, userType}}>
      {children}
    </UserContext.Provider>
  );
};
