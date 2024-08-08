import { createContext, useContext } from "react";
import { useQuery } from "@siberiacancode/reactuse";
import PlasticServices from "../services/PlasticServices";

const UserContext = createContext();

// Пользовательский хук для доступа к контексту
export const useUser = () => {
  return useContext(UserContext);
};

// Провайдер контекста UserContext
export const UserProvider = ({ children }) => {
  const { data, isLoading, isError, isSuccess, error, refetch } = useQuery(
    () => PlasticServices.getUser(),
    {
      onError: () => {
        console.error("Ошибка при получение данных пользователя", error);
      },
    }
  );

  let userData;

  if (isLoading) {
    return console.log("LoadingUserData...");
  } else {
    userData = data?.data;
  }

  console.log(
    "%c@ CONTEXT @",
    "background: #222; color: #bada55;",
    userData
    // `\n`,
    // "isLoading?",
    // isLoading,
    // `\n`,
    // "isError?",
    // isError,
    // `\n`,
    // "isSuccess?",
    // isSuccess,
    // `\n`,
    // "error?",
    // error,
    // `\n`
  );

  return (
    <UserContext.Provider
      value={{ userData, isLoading, isError, isSuccess, refetch }}
    >
      {children}
    </UserContext.Provider>
  );
};
