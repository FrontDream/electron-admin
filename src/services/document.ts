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

// 修改
export async function updateDocumentApi(data: { id: number; name: string }, options?: { [key: string]: any }) {
  const { id, name } = data;

  return request<Resp<DocumentListItem>>(`/api/users/department/${id}`, {
    method: 'PUT',
    data: { name },
    ...(options || {}),
  });
}

export async function uploadFileApi(data: { file?: File; url: string }, options?: { [key: string]: any }) {
  const { file, url } = data;

  console.log('file:', file);

  return request<Resp<any>>(
    'http://43.142.36.238:9000/test//docs/20230411/2.docx?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=Y8qMmEg0SLGSWUmb%2F20230422%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20230422T042504Z&X-Amz-Expires=259200&X-Amz-SignedHeaders=host&X-Amz-Signature=db1368f33674580d0cf8bd55128e9c231769776891536d78fc7b7cdee9b35ddd',
    {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      data: file,
      ...(options || {}),
    },
  );
}
