import { request } from 'umi';
import { Resp, DepartmentListItem, DepartmentData } from '@/utils/type';

// 角色类型列表
export async function getRoleTypeListApi(params: any, options?: { [key: string]: any }) {
  const res = await request<Resp<Array<DepartmentListItem>>>('/api/users/roleDict', {
    method: 'GET',
    params,
    ...(options || {}),
  });
  const { data = [] } = res;

  return { data, total: data.length, success: true };
}

// 新建角色类型
export async function addRoleTypeApi(data: DepartmentData, options?: { [key: string]: any }) {
  return request<Resp<DepartmentListItem>>('/api/users/roleDict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data,
    ...(options || {}),
  });
}

// 删除角色类型
export async function deleteRoleTypeApi(id: number, options?: { [key: string]: any }) {
  return request<Resp<DepartmentListItem>>(`/api/users/roleDict/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

// 修改角色类型
export async function updateRoleTypeApi(data: { id: number; name: string }, options?: { [key: string]: any }) {
  const { id, name } = data;

  return request<Resp<DepartmentListItem>>(`/api/users/roleDict/${id}`, {
    method: 'PUT',
    data: { name },
    ...(options || {}),
  });
}
