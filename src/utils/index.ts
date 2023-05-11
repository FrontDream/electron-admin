import { message } from 'antd';
import { EducationType, FileTypeEnum, UserListItem } from './type';
import { useRequest } from 'umi';
import {
  getCertificatePersonListApi,
  getCertificateTypeListApi,
  uploadFileApi,
  getTempDocumentUrlApi,
  multiDownFilesApi,
  getUserListApi,
} from '@/services';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import moment from 'moment';

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

export const useUserList = () => {
  const { data = [] } = useRequest(async () => {
    const res = await getUserListApi({
      current: 1,
      pageSize: 999999,
    });

    return { data: res?.data || [] };
  });

  return data;
};

export const useUserEnum = () => {
  const userList = useUserList();

  const userEnum = userList.reduce((pre, cur: UserListItem) => {
    pre[cur.id] = {
      text: cur.username,
    };
    return pre;
  }, {});

  return userEnum;
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
  png: FileTypeEnum.Image,
  mp4: FileTypeEnum.Others,
  zip: FileTypeEnum.Zip,
  rar: FileTypeEnum.Zip,
};

const upload = async (data: { file: File; url: string; name: string; file_path: string; uid: string }) => {
  const { file, url, name, file_path, uid } = data;

  return new Promise(resolve => {
    uploadFileApi({ file, url }).then(() => {
      resolve({ name, file_path, uid });
    });
  });
};

export const uploadFiles = async (appendix_list: Array<{ name: string; file: File; uid: string }>) => {
  const tasks = [];
  const tempReq = appendix_list.map(item => {
    const { name } = item;
    const extension = getFileExtension(name);
    const type = typeMap[extension] || FileTypeEnum.Others;

    return {
      type,
      format: extension,
      filename: name,
    };
  });
  const tempUrls = await getTempDocumentUrlApi(tempReq);

  for (let i = 0; i < appendix_list.length; i++) {
    const { file, name, uid } = appendix_list[i];
    const { file_path, url } = tempUrls[i];

    tasks.push(upload({ file, url, name, file_path, uid }));
  }
  const list = Promise.all(tasks);

  return list;
};

export const downLoad = async (url: string, name: string) => {
  const whiteLists = ['zip', 'rar'];
  const extension = getFileExtension(name);
  let objectURL;

  if (whiteLists.includes(extension)) {
    objectURL = url;
  } else {
    const responsePromise = await fetch(url);
    const blob = await responsePromise.blob();

    objectURL = window.URL.createObjectURL(blob);
  }

  const a = document.createElement('a');

  a.href = objectURL;
  a.download = name;
  a.target = 'blank';
  a.click();
  a.remove();
};

export const fileImagesMap = {
  doc: '/images/word.png',
  docx: '/images/word.png',
  ppt: '/images/ppt.png',
  pptx: '/images/ppt.png',
  xls: '/images/excel.png',
  xlsx: '/images/excel.png',
  pdf: '/images/pdf.png',
  jpg: '/images/jpg.png',
  png: '/images/png.png',
  mp4: '/images/video.png',
  zip: '/images/zip.png',
  '7z': '/images/zip.png',
  rar: '/images/rar.png',
  dwg: '/images/dwg.png',
  iso: '/images/iso.png',
  txt: '/images/txt.png',
  AAA: '/images/文件夹.png',
};

const getEachFile = (url: string) => {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((res: any) => {
        resolve(res.blob());
      })
      .catch((error: any) => {
        reject(error);
      });
  });
};

export async function multiDownZip(ids: Array<number>) {
  const res = await multiDownFilesApi(ids);

  if (isSuccess(res, '批量下载失败，请重试')) {
    const { data } = res;
    const { list } = data;
    const zip = new JSZip();
    const daytime = moment().format('YYYY-MM-DD HH:mm:ss');

    await downloadFiles2ZipWithFolder(list, zip);

    zip.generateAsync({ type: 'blob' }).then(blob => {
      FileSaver.saveAs(blob, `${daytime}.zip`);
    });
  }
}

export async function downloadFiles2ZipWithFolder(listData: any, zip: any) {
  const outPromises = listData?.map(async item => {
    const { type, url, list, name } = item;
    // 文件

    if (type === 2) {
      const blob = await getEachFile(url);

      zip?.file(name, blob);
    } else {
      // 文件夹
      const zipFolder = zip.folder(name);

      await downloadFiles2ZipWithFolder(list, zipFolder);
    }
  });

  await Promise.all(outPromises);
}
