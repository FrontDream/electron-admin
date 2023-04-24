import { request } from 'umi';
import { Resp, CertificateRes, CertificateReqData, CertificateItem } from '@/utils/type';

// 列表
export async function getCertificateListApi(params: any, options?: { [key: string]: any }) {
  const res = await request<Resp<CertificateRes>>('/api/certs/certPersonRel', {
    method: 'GET',
    params,
    ...(options || {}),
  });
  const { data } = res;

  return data;
}

// 新建
export async function addCertificateApi(data: CertificateReqData, options?: { [key: string]: any }) {
  return request<Resp<CertificateItem>>('/api/certs/certPersonRel', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data,
    ...(options || {}),
  });
}

// 删除
export async function deleteCertificateApi(id: number, options?: { [key: string]: any }) {
  return request<Resp<CertificateItem>>(`/api/certs/certPersonRel/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

// 修改
export async function updateCertificateApi(data: CertificateReqData, options?: { [key: string]: any }) {
  const { id, ...rest } = data;

  return request<Resp<CertificateItem>>(`/api/certs/certPersonRel/${id}`, {
    method: 'PUT',
    data: { ...rest },
    ...(options || {}),
  });
}

// 详情
export async function getCertificateDetailApi(id: number, options?: { [key: string]: any }) {
  const res = await request<Resp<CertificateItem>>(`/api/certs/certPersonRel/${id}`, {
    method: 'GET',
    ...(options || {}),
  });

  return res;
}
