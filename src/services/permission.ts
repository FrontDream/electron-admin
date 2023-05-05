import { request } from 'umi';
import { Resp, PermissionReq, PermissionListItem, PermissionRes } from '@/utils/type';

// 权限列表
export async function getPermissionListApi() {
  const res = await request<Resp<PermissionRes>>('/api/users/permission', {
    method: 'GET',
  });

  return res.data;
}

// 新建权限
export async function addPermissionApi(data: PermissionReq, options?: { [key: string]: any }) {
  return request<Resp<PermissionListItem>>('/api/users/permission', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data,
    ...(options || {}),
  });
}

// 删除权限
export async function deletePermissionApi(id: number, options?: { [key: string]: any }) {
  return request<Resp<PermissionListItem>>(`/api/users/permission/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

// 修改
export async function updatePermissionApi(data: PermissionReq, options?: { [key: string]: any }) {
  const { id, ...rest } = data;

  return request<Resp<PermissionListItem>>(`/api/users/permission/${id}`, {
    method: 'PUT',
    data: rest,
    ...(options || {}),
  });
}
