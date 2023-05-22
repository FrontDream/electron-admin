import { request } from 'umi';
import { Resp, CertificateTypeListRes, CertificateTypeData, CertificateTypeItem } from '@/utils/type';

// 列表
export async function getCompanyCertificateTypeListApi(params: any, options?: { [key: string]: any }) {
  const res = await request<Resp<CertificateTypeListRes>>('/api/certs/firmCertTypeDict', {
    method: 'GET',
    params: {
      ...params,
      type: 2,
    },
    ...(options || {}),
  });
  const { data } = res;

  return data;
}

// 新建
export async function addCompanyCertificateTypeApi(data: CertificateTypeData, options?: { [key: string]: any }) {
  return request<Resp<CertificateTypeItem>>('/api/certs/firmCertTypeDict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { ...data, type: 2 },
    ...(options || {}),
  });
}

// 删除
export async function deleteCompanyCertificateTypeApi(id: number, options?: { [key: string]: any }) {
  return request<Resp<CertificateTypeItem>>(`/api/certs/firmCertTypeDict/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

// 修改
export async function updateCompanyCertificateTypeApi(
  data: { id: number; name: string },
  options?: { [key: string]: any },
) {
  const { id, name } = data;

  return request<Resp<CertificateTypeItem>>(`/api/certs/firmCertTypeDict/${id}`, {
    method: 'PUT',
    data: { name, type: 2 },
    ...(options || {}),
  });
}
