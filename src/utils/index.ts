export * from './type';
export const setItem = (key: string, value: string) => {
  localStorage.setItem(key, value);
};

export const getItem = (key: string) => {
  return localStorage.getItem(key);
};

export const removeItem = (key: string) => {
  localStorage.removeItem(key);
};

export const isSuccess = (res: any) => {
  if (res.code === 200) return true;
  return false;
};
