import { request } from 'umi';
import { Resp, DurationListRes } from '@/utils/type';

// 在线时长列表
export async function getDurationListApi(params: any, options?: { [key: string]: any }) {
  const res = await request<Resp<DurationListRes>>('/api/records/durationStat', {
    method: 'GET',
    params,
    ...(options || {}),
  });
  const { data } = res;

  return data;
}
