import { request } from 'umi';
import { Resp, CertificateRes, CertificateReqData, CertificateItem } from '@/utils/type';

// 列表
export async function getCompanyCertificateListApi(params: any, options?: { [key: string]: any }) {
  const res = await request<Resp<CertificateRes>>('/api/certs/certFirmRel', {
    method: 'GET',
    params: { ...params, cert_type: 2 },
    ...(options || {}),
  });
  const { data } = res;

  return data;
}

// 新建
export async function addCompanyCertificateApi(data: CertificateReqData, options?: { [key: string]: any }) {
  return request<Resp<CertificateItem>>('/api/certs/certFirmRel', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: { ...data, cert_type: 2 },
    ...(options || {}),
  });
}

// 删除
export async function deleteCompanyCertificateApi(id: number, options?: { [key: string]: any }) {
  return request<Resp<CertificateItem>>(`/api/certs/certFirmRel/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

// 修改
export async function updateCompanyCertificateApi(data: CertificateReqData, options?: { [key: string]: any }) {
  const { id, ...rest } = data;

  return request<Resp<CertificateItem>>(`/api/certs/certFirmRel/${id}`, {
    method: 'PUT',
    data: { ...rest, cert_type: 2 },
    ...(options || {}),
  });
}

// 详情
export async function getCompanyCertificateDetailApi(id: number, options?: { [key: string]: any }) {
  const res = await request<Resp<CertificateItem>>(`/api/certs/certFirmRel/${id}`, {
    method: 'GET',
    ...(options || {}),
  });

  return res;
}
