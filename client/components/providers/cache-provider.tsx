"use client"

import { FileClock } from "lucide-react";
import { createContext, useContext, useState, useEffect, useRef, useReducer } from "react"

interface CacheContextType {
  get: (key: string) => {data: any, date: Date};
  set: (key: string, value: any) => void;
  remove: (key: string) => void;
}

const CacheContext = createContext<CacheContextType | undefined>(undefined);

export const CacheProvider = ({ children }: { children: React.ReactNode }) => {

  const cache : { [key: string]: {data: any, date: Date} } = {};
  const cacheRef = useRef(cache);
  const [, forceUpdate] = useReducer(x => x + 1, 0);

//  useEffect(() => {
//    const loadFromCache = () => {
//      const foundCache = localStorage.getItem("cache")
//      if(!foundCache){
//        setCache({})
//        return;
//      }
//      const parsedCache = JSON.parse(foundCache);
//      setCache(parsedCache);
//    }
//    if(loading){
//      loadFromCache();
//      setLoading(false);
//    }
//  }, [loading])
//
//  useEffect(() => {
//    const stringifiedCahe = JSON.stringify(cache);
//    localStorage.setItem("cache",stringifiedCahe);
//  },[cache])
//
  
  const get = (key: string) => {
    if(!cacheRef.current[key] || (new Date().getTime() - (new Date(cacheRef.current[key].date)).getTime()) > 60 * 60 * 1000){
      return {data: null, date: new Date(0)};
    }
    return cacheRef.current[key];
  }

  const set = (key: string, value: any) => {
    cacheRef.current[key] = { data: value, date: (new Date())}
    forceUpdate();
  }

  const remove = (key: string) => {
    delete cacheRef.current[key];
    forceUpdate();
  }

  return (
    <CacheContext.Provider value={{get,set,remove}}>
      <button onClick={() => console.log(cacheRef.current)} className="absolute bottom-2 right-2 p-2 bg-primary rounded-lg"><FileClock /></button>
      {children}
    </CacheContext.Provider>
  );
}

export const useCache = () => {
  return useContext(CacheContext)
}
