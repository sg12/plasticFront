import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import PlasticServices from "../services/PlasticServices";

const useFavorites = (type) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const { data } = await PlasticServices.getFavorities();
        setFavorites(data.map((favorite) => favorite.id));
      } catch (error) {
        toast.error(`Не удалось получить избранное ${type}.`);
      }
    };

    fetchFavorites();
  }, [type]);

  const toggleFavorite = async (itemId) => {
    try {
      if (favorites.includes(itemId)) {
        await PlasticServices.deleteFavorities(itemId);
        setFavorites(favorites.filter((id) => id !== itemId));
        toast.success(`ID:${itemId} - Успешно удалено`);
      } else {
        await PlasticServices.postFavorities({ user: itemId });
        setFavorites([...favorites, itemId]);
        toast.success(`ID:${itemId} - Успешно добавлен`);
      }
    } catch (error) {
      toast.error(`Не удалось обновить избранное ${type}.`);
    }
  };

  return {
    favorites,
    toggleFavorite,
  };
};

export default useFavorites;
