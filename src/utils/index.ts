import { message } from 'antd';
import { EducationType } from './type';
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

export const isSuccess = (res: any, msg?: string) => {
  if (res.code === 200) {
    return true;
  } else if (res.code === 468) {
    message.warning(res.msg);
    return false;
  }
  if (msg) {
    message.warning(msg);
  }
  return false;
};

export const educationOptions = [
  {
    label: '初中',
    value: EducationType.MiddleSchool,
  },
  {
    label: '高中',
    value: EducationType.HightSchool,
  },
  {
    label: '中专',
    value: EducationType.SecondarySchool,
  },
  {
    label: '大专',
    value: EducationType.JuniorCollege,
  },
  {
    label: '本科',
    value: EducationType.Undergraduate,
  },
  {
    label: '硕士',
    value: EducationType.Master,
  },
];
