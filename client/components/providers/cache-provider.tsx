"use client"

import { createContext, useContext, useState, useEffect } from "react"

interface CacheContextType {
  get: (key: string) => {data: any, date: Date};
  set: (key: string, value: any) => void;
  remove: (key: string) => void;
}

const CacheContext = createContext<CacheContextType | undefined>(undefined);

export const CacheProvider = ({ children }: { children: React.ReactNode }) => {

  const [cache, setCache] = useState<{ [key: string]: {data: any, date: Date} }>({});
  const [loading,setLoading] = useState(true);

  useEffect(() => {
    const loadFromCache = () => {
      const foundCache = localStorage.getItem("cache")
      if(!foundCache){
        setCache({})
        return;
      }
      const parsedCache = JSON.parse(foundCache);
      setCache(parsedCache);
    }
    if(loading){
      loadFromCache();
      setLoading(false);
    }
  }, [loading])

  useEffect(() => {
    const stringifiedCahe = JSON.stringify(cache);
    localStorage.setItem("cache",stringifiedCahe);
  },[cache])

  const get = (key: string) => {
    if(!cache[key] || (new Date().getTime() - (new Date(cache[key].date)).getTime()) > 1 * 60 * 1000){
      return {data: null, date: new Date(0)};
    }
    return cache[key];
  }

  const set = (key: string, value: any) => {
    const newCache = {...cache};
    newCache[key] = { data: value, date: new Date()}
    setCache(newCache);
  }

  const remove = (key: string) => {
    const newCache = {...cache};
    delete newCache[key];
    setCache(newCache);
  }

  if(loading){
    return <div>Loading</div>
  }

  return (
    <CacheContext.Provider value={{get,set,remove}}>
      {children}
    </CacheContext.Provider>
  );
}

export const useCache = () => {
  return useContext(CacheContext)
}
