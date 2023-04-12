import { request } from 'umi';

// 登录
export async function login(data: any, options?: { [key: string]: any }) {
  return request<any>('/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data,
    ...(options || {}),
  });
}
