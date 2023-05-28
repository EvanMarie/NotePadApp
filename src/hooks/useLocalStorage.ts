import { useEffect, useState } from "react";

/* 
This essentially checking if the value exists yet and if not, it will 
set it to the initial value.
If it does exist, it will parse the value and set it to the value state.
*/

export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
  const [value, setValue] = useState<T>(() => {
    const jsonValue = localStorage.getItem(key)
    if (jsonValue === null) {
if (typeof initialValue === 'function') {
  return (initialValue as () => T)()
    } else {
      return initialValue
    } 
  }
    else {
      return JSON.parse(jsonValue)
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [value, key])
  return [value, setValue] as [T, typeof setValue]
}