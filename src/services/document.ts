import { request } from 'umi';
import {
  Resp,
  DocumentDetail,
  DocumentListItem,
  DocumentData,
  TempDocumentData,
  TempDocumentResData,
  MultiRes,
  UpdateDocReq,
  DocumentRes,
  DocPermissItem,
} from '@/utils/type';

// 文件列表
export async function getDocumentListApi(params: any, options?: { [key: string]: any }) {
  const res = await request<Resp<DocumentRes>>('/api/docs/document', {
    method: 'GET',
    params,
    ...(options || {}),
  });

  return res.data || ({} as DocumentRes);
}

// 文件详情
export async function getDocumentApi(id: string, options?: { [key: string]: any }) {
  return request<Resp<DocumentDetail>>(`/api/docs/document/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

// 新建文件
export async function addDocumentApi(data: Array<DocumentData>, options?: { [key: string]: any }) {
  return request<Resp<DocumentListItem>>('/api/docs/document', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { list: data },
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

// 批量下载文件
export async function multiDownFilesApi(ids: Array<number>, options?: { [key: string]: any }) {
  return request<Resp<MultiRes>>('/api/docs/multiDownloads', {
    method: 'POST',
    data: {
      ids,
    },
    ...(options || {}),
  });
}

// 修改
export async function updateDocumentApi(data: { id: number; name: string }, options?: { [key: string]: any }) {
  const { id, name } = data;

  return request<Resp<DocumentListItem>>(`/api/docs/document/${id}`, {
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

// 文件用户权限列表
export async function getUserDocPermissionApi(params: { doc_id: number }, options?: { [key: string]: any }) {
  const res = await request<Resp<Array<DocPermissItem>>>('/api/users/userDocPermission', {
    method: 'GET',
    params,
    ...(options || {}),
  });
  const { data = [] } = res;

  return data;
}

// 更新权限
export async function uploadPermissionApi(data: UpdateDocReq, options?: { [key: string]: any }) {
  return request<Resp<any>>('/api/users/userDocPermission', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data,
    ...(options || {}),
  });
}
