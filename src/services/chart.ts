import { request } from 'umi';
import { Resp, DurationListRes, RecordListRes } from '@/utils/type';

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

// 日志列表
export async function getRecordListApi(params: any, options?: { [key: string]: any }) {
  const res = await request<Resp<RecordListRes>>('/api/records/record', {
    method: 'GET',
    params,
    ...(options || {}),
  });
  const { data } = res;

  return data;
}

// 日志列表
export async function downRecordListApi(params: any, options?: { [key: string]: any }) {
  const res = await request<Resp<{ url: string }>>('/api/records/recordExport', {
    method: 'GET',
    params,
    ...(options || {}),
  });
  const { data } = res;

  return data;
}
