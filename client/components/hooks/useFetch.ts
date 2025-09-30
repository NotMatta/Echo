"use client"
import { useCache } from "../providers/cache-provider";
import { useEffect, useState } from "react";
import { ActionResponse } from "@/types/action-response";

export const useFetch = <T>(key: string, action: () => Promise<ActionResponse>) => {
  const [data, setData] = useState<T | any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  const { get, set, remove } = useCache()!;

  const refresh = () => {
    remove(key);
    setLoading(true);
  }

  const mutate = (next : (old: T) => T) => {
    const newData = next(data);
    setData(newData);
    set(key,newData);
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const cached = get(key);
      if (cached.data) {
        setData(cached.data);
        setLoading(false);
        return;
      }
      try {
        const result = await action();
        if (result.ok) {
          setData(result.data);
          set(key,result.data);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    loading && fetchData();
  },[loading]);

  return { data, loading, error, refresh, mutate };
}
