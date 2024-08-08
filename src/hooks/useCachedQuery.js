import { useQuery } from "@siberiacancode/reactuse";
import { useEffect, useState } from "react";

// FIXME: Добавить проверку на наличие кэша и исправить isLoading, если есть данные в кэше
const useCachedQuery = (
  key,
  queryFn,
  options = {},
  cacheTime = 1000 * 60 * 5
) => {
  const CACHE_KEY = `cachedQuery_${key}`;
  const [cachedData, setCachedData] = useState(null);
  const [isFetching, setIsFetching] = useState(true);

  // useEffect(() => {
  //   const cacheData = localStorage.getItem(CACHE_KEY);
  //   if (cacheData) {
  //     const { data, timestamp } = JSON.parse(cacheData);
  //     if (Date.now() - timestamp < cacheTime) {
  //       setCachedData(data);
  //       setIsFetching(false);
  //     } else {
  //       localStorage.removeItem(CACHE_KEY);
  //     }
  //   } else {
  //     setIsFetching(false);
  //   }
  // }, [CACHE_KEY, cacheTime]);

  const { isLoading, isError, isSuccess, data, error, refetch } = useQuery(
    queryFn,
    {
      ...options,
      enabled: !cachedData && !isFetching,
      onSuccess: (data) => {
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ data, timestamp: Date.now() })
        );
        if (options.onSuccess) {
          options.onSuccess(data);
        }
      },
    }
  );

  return {
    isLoading: isFetching || isLoading,
    isError,
    isSuccess,
    data: cachedData || data,
    error,
    refetch,
  };
};

export default useCachedQuery;
