import { request } from 'umi';
import { Resp, DocumentDetail, DocumentListItem, DocumentData } from '@/utils/type';

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
export async function deleteDocumentApi(id: number, options?: { [key: string]: any }) {
  return request<Resp<DocumentListItem>>(`/api/users/department/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

// 修改部门
export async function updateDocumentApi(data: { id: number; name: string }, options?: { [key: string]: any }) {
  const { id, name } = data;

  return request<Resp<DocumentListItem>>(`/api/users/department/${id}`, {
    method: 'PUT',
    data: { name },
    ...(options || {}),
  });
}
