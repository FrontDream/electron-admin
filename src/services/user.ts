import { request } from 'umi';
import { Resp, LoginResData, UserListRes, UserListItem, UserData, PasswordData, UserInfoDetail } from '@/utils/type';

// 登录
export async function loginApi(data: any, options?: { [key: string]: any }) {
  return request<Resp<LoginResData>>('/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data,
    ...(options || {}),
  });
}
// 退出登录
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/users/signOut', {
    method: 'POST',
    ...(options || {}),
  });
}

// 获取用户信息
export async function getUserInfoApi(params?: any, options?: { [key: string]: any }) {
  return request<Resp<UserInfoDetail>>('/api/users/userInfo', {
    method: 'GET',
    ...(options || {}),
  });
}

// 用户列表
export async function getUserListApi(params: any, options?: { [key: string]: any }) {
  const res = await request<Resp<UserListRes>>('/api/users/user', {
    method: 'GET',
    params,
    ...(options || {}),
  });
  const { data = [] } = res;

  return data;
}

// 新建用户
export async function addUserApi(data: UserData, options?: { [key: string]: any }) {
  return request<Resp<UserListItem>>('/api/users/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data,
    ...(options || {}),
  });
}

// 删除用户
export async function deleteUserApi(id: number, options?: { [key: string]: any }) {
  return request<Resp<UserListItem>>(`/api/users/user/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

// 修改用户状态
export async function updateUserStatusApi(data: { id: number; status: boolean }, options?: { [key: string]: any }) {
  const { id, status } = data;

  return request<Resp<UserListItem>>(`/api/users/user/${id}`, {
    method: 'PATCH',
    data: { status },
    ...(options || {}),
  });
}

// 修改用户
export async function updateUserApi(data: UserData, options?: { [key: string]: any }) {
  const { id, ...rest } = data;

  return request<Resp<UserListItem>>(`/api/users/user/${id}`, {
    method: 'PUT',
    data: rest,
    ...(options || {}),
  });
}

// 修改密码
export async function updatePassword(data: PasswordData, options?: { [key: string]: any }) {
  return request<Resp<UserListItem>>('/api/users/changePassword', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}
