import { request } from 'umi';
import { Resp, CertificatePersonListRes, CertificatetPersonData, CertificatePersonItem } from '@/utils/type';

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
// 详情
export async function getCertificatePersonDetailApi(id: number, options?: { [key: string]: any }) {
  const res = await request<Resp<CertificatePersonItem>>(`/api/certs/certPerson/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
  const { data } = res;

  return data;
}

// 新建
export async function addCertificatePersonApi(data: CertificatetPersonData, options?: { [key: string]: any }) {
  return request<Resp<CertificatePersonItem>>('/api/certs/certPerson', {
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
  return request<Resp<CertificatePersonItem>>(`/api/certs/certPerson/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

// 修改
export async function updateCertificatePersonApi(data: CertificatetPersonData, options?: { [key: string]: any }) {
  const { id, ...rest } = data;

  return request<Resp<CertificatePersonItem>>(`/api/certs/certPerson/${id}`, {
    method: 'PUT',
    data: { ...rest },
    ...(options || {}),
  });
}

// 导入校验
export async function importPersonValidateExcelApi(data: { file: FormData }) {
  const { file } = data;
  const res = await request<Resp<{ is_exist: boolean }>>('/api/certs/personImportValidate', {
    method: 'POST',
    body: file,
    requestType: 'form',
  });

  return res;
}
// 导入
export async function importPersonFromExcelApi(data: { file: FormData }) {
  const { file } = data;
  const res = await request<null>('/api/certs/personImport', {
    method: 'POST',
    body: file,
    requestType: 'form',
  });

  return res;
}
