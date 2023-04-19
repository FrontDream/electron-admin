import { request } from 'umi';
import { Resp, RoleManagementListItem, RoleManagementListRes, RoleData } from '@/utils/type';

// 角色列表
export async function getRoleManagementListApi(params: any, options?: { [key: string]: any }) {
  const res = await request<Resp<RoleManagementListRes>>('/api/users/role', {
    method: 'GET',
    params,
    ...(options || {}),
  });
  const { data } = res;

  return data;
}

// 新建角色
export async function addRoleApi(data: RoleData, options?: { [key: string]: any }) {
  return request<Resp<RoleManagementListItem>>('/api/users/role', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data,
    ...(options || {}),
  });
}

// 删除角色
export async function deleteRoleApi(id: number, options?: { [key: string]: any }) {
  return request<Resp<RoleManagementListItem>>(`/api/users/role/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

// 修改角色
export async function updateRoleApi(
  data: { id: number; name: string; role_type: number },
  options?: { [key: string]: any },
) {
  const { id, name, role_type } = data;

  return request<Resp<RoleManagementListItem>>(`/api/users/role/${id}`, {
    method: 'PUT',
    data: { name, role_type },
    ...(options || {}),
  });
}