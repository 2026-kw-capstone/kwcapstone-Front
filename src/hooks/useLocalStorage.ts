export const useLocalStorage = <T = string>(key: string) => {
  const setItem = (value: T) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`${key} 저장 실패`, error);
    }
  };

  const getItem = (): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
      console.error(`${key} 조회 실패`, error);
      return null;
    }
  };

  const removeItem = () => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`${key} 삭제 실패`, error);
    }
  };

  return { setItem, getItem, removeItem };
};