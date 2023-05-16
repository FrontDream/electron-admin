import { request } from 'umi';
import { Resp, CustomsListItem, CustomsData, CustomsListRes } from '@/utils/type';

// 客户列表
export async function getCustomsListApi(params: any, options?: { [key: string]: any }) {
  const res = await request<Resp<CustomsListRes>>('/api/secret/company', {
    method: 'GET',
    params,
    ...(options || {}),
  });
  const { data } = res;

  return data;
}

// 新建客户
export async function addCustomsApi(data: CustomsData, options?: { [key: string]: any }) {
  return request<Resp<CustomsListItem>>('/api/secret/company', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data,
    ...(options || {}),
  });
}

// 修改客户
export async function updateCustomApi(data: { id: number; name: string }, options?: { [key: string]: any }) {
  const { id, name } = data;

  return request<Resp<CustomsListItem>>(`/api/secret/company/${id}`, {
    method: 'PUT',
    data: { name },
    ...(options || {}),
  });
}
