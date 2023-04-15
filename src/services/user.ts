import { request } from 'umi';
import { Resp, LoginResData } from '@/utils/type';

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

// 获取用户信息
export async function getUserInfoApi(params?: any, options?: { [key: string]: any }) {
  return request<Resp<LoginResData>>('/api/users/userInfo', {
    method: 'GET',
    ...(options || {}),
  });
}
