import { message } from 'antd';
import { EducationType } from './type';
import { useRequest } from 'umi';
import { getCertificatePersonListApi, getCertificateTypeListApi } from '@/services';

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
interface BasicType {
  name: string;
  id: number;
}
export const listToEnum = function <T extends BasicType>(list: Array<T>) {
  const res = list.reduce((pre, cur: T) => {
    pre[cur.id] = {
      text: cur.name,
    };
    return pre;
  }, {});

  return res;
};

export const useCertificatetPersons = () => {
  const { data: certificatetPersons = [] } = useRequest(async () => {
    const { data = [] } = await getCertificatePersonListApi({
      current: 1,
      pageSize: 99999,
    });

    return { data };
  });

  return certificatetPersons;
};

export const useCertificatetTypes = () => {
  const { data: certificatetTypes = [] } = useRequest(async () => {
    const { data = [] } = await getCertificateTypeListApi({
      current: 1,
      pageSize: 99999,
    });

    return { data };
  });

  return certificatetTypes;
};

export const getNameById = function <T extends BasicType>(list: Array<T>, id: number) {
  const item = list.find(item => item.id === id) || ({} as BasicType);

  return item.name;
};
