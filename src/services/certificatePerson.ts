import { request } from 'umi';
import { Resp, CertificatePersonListRes, CertificatetPersonData, CertificatetPersonItem } from '@/utils/type';

// 列表
export async function getCertificatePersonListApi(params: any, options?: { [key: string]: any }) {
  const res = await request<Resp<CertificatePersonListRes>>('/api/certs/certPerson', {
    method: 'GET',
    params,
    ...(options || {}),
  });
  const { data } = res;

  return data;
}

// 新建
export async function addCertificatePersonApi(data: CertificatetPersonData, options?: { [key: string]: any }) {
  return request<Resp<CertificatetPersonItem>>('/api/certs/certPerson', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data,
    ...(options || {}),
  });
}

// 删除
export async function deleteCertificatePersonApi(id: number, options?: { [key: string]: any }) {
  return request<Resp<CertificatetPersonItem>>(`/api/certs/certPerson/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

// 修改
export async function updateCertificatePersonApi(data: CertificatetPersonData, options?: { [key: string]: any }) {
  const { id, ...rest } = data;

  return request<Resp<CertificatetPersonItem>>(`/api/certs/certPerson/${id}`, {
    method: 'PUT',
    data: { ...rest },
    ...(options || {}),
  });
}
