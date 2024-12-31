import { useEffect, useState, useCallback, useMemo } from "react";

const API_HOST = "https://service.pace-unv.cloud";

export const useQueries = ({ prefixUrl = null, headers = {}, enabled = true } = {}) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const memoizedHeaders = useMemo(() => headers, [JSON.stringify(headers)]);

  const fetchData = useCallback(async () => {
    if (!prefixUrl) return; // Jangan fetch jika prefixUrl null
    setIsLoading(true);
    setIsError(false);

    try {
      // console.log("Fetching data from:", `${API_HOST}${prefixUrl}`);
      const response = await fetch(`${API_HOST}${prefixUrl}`, {
        method: "GET",
        headers: memoizedHeaders,
      });
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [prefixUrl, memoizedHeaders]);

  useEffect(() => {
    if (enabled && prefixUrl) {
      fetchData();
    }
  }, [enabled, prefixUrl, fetchData]);

  return { data, isLoading, isError, refetch: fetchData };
};
