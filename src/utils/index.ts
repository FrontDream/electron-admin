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
  getCertificateCompanyListApi,
  getCompanyCertificateTypeListApi,
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
  } else if (res?.code === 403) {
    message.warning('暂无权限，请先向管理员申请后重试!');
    return;
  }
  if (msg) {
    message.warning(msg);
  }
  return false;
};

// 毕业证 证书等级
export const educationOptions = ['小学', '初中', '高中', '中专', '大专', '本科', '硕士', '博士'];

// 职称证 证书等级
export const jobTitleOptions = [
  '初级会计师',
  '中级会计师',
  '高级会计师',
  '技术员',
  '助理工程师',
  '工程师',
  '高级工程师',
];

// 技工证 证书等级
export const techOptions = ['初级', '中级', '高级'];
interface BasicType {
  name: string;
  id: number;
}
// 技工证 岗位类别
export const techCategoryOptions = ['特殊工种', '一般工种'];
// 三类证 岗位类别
export const thirdCategoryOptions = ['建安类', '水安类', '交安类'];
// 三类证 证书等级
export const thirdGradeOptions = ['A证', 'B证', 'C证'];
// 岗位证 岗位类别
export const jobCategoryOptions = ['建筑类', '公路类', '水利类'];
// 注册证 证书等级
export const registryGradeOptions = ['一级', '二级', '不分等级'];
// 注册证 岗位类别
export const registryJobCategory = ['注册建造师', '注册造价师', '注册监理工程师', '监理员'];

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
      type: 1,
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

export const useCertificatetCompany = () => {
  const { data: certificatetCompany = [] } = useRequest(async () => {
    const { data = [] } = await getCertificateCompanyListApi({
      current: 1,
      pageSize: 99999,
    });

    return { data };
  });

  return certificatetCompany;
};

export const useCompanyCertificatetTypes = () => {
  const { data: companyCertificatetTypes = [] } = useRequest(async () => {
    const { data = [] } = await getCompanyCertificateTypeListApi({
      current: 1,
      pageSize: 99999,
    });

    return { data };
  });

  return companyCertificatetTypes;
};

export const getNameById = function <T extends BasicType>(list: Array<T>, id: number) {
  const item = list.find(item => item.id === id) || ({} as BasicType);

  return item.name;
};

export const pictures = ['jpg', 'jpeg', 'png', 'bmp', 'gif'];
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
  bmp: '/images/bmp.png',
  psd: '/images/ps.png',
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

export const jobStatusMap = {
  1: '在职',
  2: '离职',
  3: '兼职',
  undefined: '-',
};
