import { request } from 'umi';
import { Resp, DepartmentUserRes, DepartmentListItem, DepartmentData, DepartmentListRes } from '@/utils/type';

// 部门列表
export async function getDepartmentListApi(params: any, options?: { [key: string]: any }) {
  const res = await request<Resp<DepartmentListRes>>('/api/users/department', {
    method: 'GET',
    params,
    ...(options || {}),
  });
  const { data } = res;

  return data;
}

// 新建部门
export async function addDepartmentApi(data: DepartmentData, options?: { [key: string]: any }) {
  return request<Resp<DepartmentListItem>>('/api/users/department', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data,
    ...(options || {}),
  });
}

// 删除部门
export async function deleteDepartmentApi(id: number, options?: { [key: string]: any }) {
  return request<Resp<DepartmentListItem>>(`/api/users/department/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

// 修改部门
export async function updateDepartmentApi(data: { id: number; name: string }, options?: { [key: string]: any }) {
  const { id, name } = data;

  return request<Resp<DepartmentListItem>>(`/api/users/department/${id}`, {
    method: 'PUT',
    data: { name },
    ...(options || {}),
  });
}

// 部门用户列表
export async function getDepartmentUserApi() {
  const res = await request<Resp<DepartmentUserRes>>('/api/users/departUser', {
    method: 'GET',
  });
  const { data } = res;

  return data;
}
