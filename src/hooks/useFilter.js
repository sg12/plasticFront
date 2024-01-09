import { useEffect, useState } from "react";

export const useFilter = (initialItems) => {
  const [items, setItems] = useState(initialItems);
  const [filteredItems, setFilteredItems] = useState(initialItems); // Изменился этот момент

  const filterItems = (value) => {
    setFilteredItems(
      items.filter((item) => item.toLowerCase().includes(value.toLowerCase()))
    );
  };

  useEffect(() => {
    setFilteredItems(items);
  }, [items]);

  return {
    items,
    filteredItems,
    setItems,
    filterItems,
  };
};
