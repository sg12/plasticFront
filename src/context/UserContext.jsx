import { createContext, useContext, useState, useEffect } from "react";
import PlasticServices from "../services/PlasticServices";
import Cookies from "js-cookie";

// Создаем контекст
const UserContext = createContext();

// Пользовательский хук для доступа к контексту
export const useUser = () => {
  return useContext(UserContext);
};

// Провайдер контекста UserContext
export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Функция для получения данных пользователя
  const fetchUserData = async () => {
    try {
      const response = await PlasticServices.getUser();
      setUserData(response.data);
    } catch (error) {
      console.error("Ошибка при получении данных пользователя:", error);
    }
    setLoading(false);
  };

  // Получение данных пользователя при монтировании компонента
  useEffect(() => {
    fetchUserData();
  }, []);

  // Обновление данных пользователя при изменении токена
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      fetchUserData();
    } else {
      setUserData(null);
    }
  }, [Cookies.get("token")]);

  // Значение контекста
  const contextValue = {
    userData,
    loading,
    fetchUserData, // Экспортируем функцию для обновления данных пользователя
  };
  console.log("%c@ CONTEXT @", "background: #222; color: #bada55;", userData);

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
