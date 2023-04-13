export * from './type';
export const setItem = (key: string, value: string) => {
  localStorage.setItem(key, value);
};

export const getItem = (key: string) => {
  localStorage.getItem(key);
};

export const removeItem = (key: string) => {
  localStorage.removeItem(key);
};

export const isSuccess = (res: any) => {
  if (res.code === 0) return true;
  return false;
};
