import { message } from 'antd';
import { EducationType, FileTypeEnum } from './type';
import { useRequest } from 'umi';
import { UploadFile, RcFile } from 'antd/lib/upload';
import {
  getCertificatePersonListApi,
  getCertificateTypeListApi,
  uploadFileApi,
  getTempDocumentUrlApi,
} from '@/services';

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

export const getFileExtension = (fileName: string) => fileName.split('.').pop().toLowerCase();

export const typeMap = {
  doc: FileTypeEnum.Document,
  docx: FileTypeEnum.Document,
  xls: FileTypeEnum.Document,
  xlsx: FileTypeEnum.Document,
  pdf: FileTypeEnum.Document,
  jpg: FileTypeEnum.Image,
  mp4: FileTypeEnum.Others,
  zip: FileTypeEnum.Zip,
  rar: FileTypeEnum.Zip,
};

const upload = async (data: { file: RcFile; url: string; name: string; file_path: string }) => {
  const { file, url, name, file_path } = data;

  return new Promise(resolve => {
    uploadFileApi({ file, url }).then(() => {
      resolve({ name, file_path });
    });
  });
};

export const uploadFiles = async (appendix_list: Array<UploadFile>) => {
  const tasks = [];
  const tempReq = appendix_list.map(item => {
    const { name } = item;
    const extension = getFileExtension(name);

    return {
      type: typeMap[extension],
      format: extension,
      filename: name,
    };
  });
  const tempUrls = await getTempDocumentUrlApi(tempReq);

  for (let i = 0; i < appendix_list.length; i++) {
    const { originFileObj, name } = appendix_list[i];
    const { file_path, url } = tempUrls[i];

    tasks.push(upload({ file: originFileObj!, url, name, file_path }));
  }
  const list = Promise.all(tasks);

  return list;
};
