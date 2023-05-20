import { request } from 'umi';
import { Resp, RoleManagementListItem, RoleManagementListRes, RoleData, RoleDetail } from '@/utils/type';

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
// 角色列表 无权限
export async function getRoleListNoPermissionApi(params: any, options?: { [key: string]: any }) {
  const res = await request<Resp<RoleManagementListRes>>('/api/users/roleType', {
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
  data: { id: number; name: string; role_type: number; permission_ids: Array<number>; menu_ids: Array<number> },
  options?: { [key: string]: any },
) {
  const { id, name, role_type, menu_ids, permission_ids } = data;

  return request<Resp<RoleManagementListItem>>(`/api/users/role/${id}`, {
    method: 'PUT',
    data: { name, role_type, menu_ids, permission_ids },
    ...(options || {}),
  });
}

// 角色详情
export async function getRoleDetailApi(params: { id: number }, options?: { [key: string]: any }) {
  const { id } = params;
  const res = await request<Resp<RoleDetail>>(`/api/users/role/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
  const { data } = res;

  return data;
}
