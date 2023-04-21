import { request } from 'umi';
import { Resp, CertificateTypeListRes, CertificateTypeData, CertificateTypeItem } from '@/utils/type';

// 列表
export async function getCertificateTypeListApi(params: any, options?: { [key: string]: any }) {
  const res = await request<Resp<CertificateTypeListRes>>('/api/certs/certTypeDict', {
    method: 'GET',
    params,
    ...(options || {}),
  });
  const { data } = res;

  return data;
}

// 新建
export async function addCertificateTypeApi(data: CertificateTypeData, options?: { [key: string]: any }) {
  return request<Resp<CertificateTypeItem>>('/api/certs/certTypeDict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data,
    ...(options || {}),
  });
}

// 删除
export async function deleteCertificateTypeApi(id: number, options?: { [key: string]: any }) {
  return request<Resp<CertificateTypeItem>>(`/api/certs/certTypeDict/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

// 修改
export async function updateCertificateTypeApi(data: { id: number; name: string }, options?: { [key: string]: any }) {
  const { id, name } = data;

  return request<Resp<CertificateTypeItem>>(`/api/certs/certTypeDict/${id}`, {
    method: 'PUT',
    data: { name },
    ...(options || {}),
  });
}
