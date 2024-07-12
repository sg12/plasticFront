import { useState, useEffect, useCallback } from "react";

const useFilter = (initialItems, filterKey) => {
  const [items, setItems] = useState(initialItems);
  const [filteredItems, setFilteredItems] = useState(initialItems);

  const filterItems = useCallback(
    (value) => {
      setFilteredItems(
        value === "all"
          ? items
          : items.filter(
              (item) =>
                item[filterKey] &&
                item[filterKey].toLowerCase().includes(value.toLowerCase())
            )
      );
    },
    [items, filterKey]
  );

  useEffect(() => {
    setFilteredItems(initialItems);
  }, [initialItems]);

  return {
    items,
    filteredItems,
    setItems,
    filterItems,
  };
};

export default useFilter;
