import { request } from 'umi';
import {
  Resp,
  DocumentDetail,
  DocumentListItem,
  DocumentData,
  TempDocumentData,
  TempDocumentResData,
} from '@/utils/type';

// 文件列表
export async function getDocumentListApi(params: any, options?: { [key: string]: any }) {
  const res = await request<Resp<Array<DocumentListItem>>>('/api/docs/document', {
    method: 'GET',
    params,
    ...(options || {}),
  });
  const { data = [] } = res;

  return data;
}

// 文件详情
export async function getDocumentApi(id: string, options?: { [key: string]: any }) {
  return request<Resp<DocumentDetail>>(`/api/docs/document/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

// 新建文件
export async function addDocumentApi(data: DocumentData, options?: { [key: string]: any }) {
  return request<Resp<DocumentListItem>>('/api/docs/document', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data,
    ...(options || {}),
  });
}

// 删除文件
export async function deleteDocumentApi(ids: Array<number>, options?: { [key: string]: any }) {
  const id = ids[0];

  return request<Resp<DocumentListItem>>(`/api/docs/document/${id}`, {
    method: 'DELETE',
    data: {
      ids,
    },
    ...(options || {}),
  });
}

// 修改
export async function updateDocumentApi(data: { id: number; name: string }, options?: { [key: string]: any }) {
  const { id, name } = data;

  return request<Resp<DocumentListItem>>(`/api/users/department/${id}`, {
    method: 'PUT',
    data: { name },
    ...(options || {}),
  });
}

// 获取临时上传链接
export async function getTempDocumentUrlApi(data: Array<TempDocumentData>, options?: { [key: string]: any }) {
  const res = await request<Resp<TempDocumentResData>>('/api/docs/presigned_url', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      list: data,
    },
    ...(options || {}),
  });
  const listData = res.data;

  return listData.list || [];
}

// 上传至minio
export async function uploadFileApi(data: { file: File; url: string }, options?: { [key: string]: any }) {
  const { file, url } = data;

  return request<Resp<any>>(url, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    data: file,
    ...(options || {}),
  });
}
