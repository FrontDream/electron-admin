import { request } from 'umi';
import { Resp, CompanyCertificateListRes, CompanyCertificateData, CompanyCertificateListItem } from '@/utils/type';

// 列表
export async function getCertificateCompanyListApi(params: any, options?: { [key: string]: any }) {
  const res = await request<Resp<CompanyCertificateListRes>>('/api/certs/certFirm', {
    method: 'GET',
    params,
    ...(options || {}),
  });
  const { data } = res;

  return data;
}
// 详情
export async function getCertificateCompanyDetailApi(id: number, options?: { [key: string]: any }) {
  const res = await request<Resp<CompanyCertificateListItem>>(`/api/certs/certFirm/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
  const { data } = res;

  return data;
}

// 新建
export async function addCertificateCompanyApi(data: CompanyCertificateData, options?: { [key: string]: any }) {
  return request<Resp<CompanyCertificateListItem>>('/api/certs/certFirm', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data,
    ...(options || {}),
  });
}

// 删除
export async function deleteCertificateCompanyApi(id: number, options?: { [key: string]: any }) {
  return request<Resp<CompanyCertificateListItem>>(`/api/certs/certFirm/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

// 修改
export async function updateCertificateCompanynApi(data: CompanyCertificateData, options?: { [key: string]: any }) {
  const { id, ...rest } = data;

  return request<Resp<CompanyCertificateListItem>>(`/api/certs/certFirm/${id}`, {
    method: 'PUT',
    data: { ...rest },
    ...(options || {}),
  });
}
// 导入校验
export async function importCompanyValidateExcelApi(data: { file: FormData }) {
  const { file } = data;
  const res = await request<Resp<{ is_exist: boolean }>>('/api/certs/firmImportValidate', {
    method: 'POST',
    body: file,
    requestType: 'form',
  });

  return res;
}
// 导入
export async function importCompanyFromExcelApi(data: { file: FormData }) {
  const { file } = data;
  const res = await request<null>('/api/certs/firmImport', {
    method: 'POST',
    body: file,
    requestType: 'form',
  });

  return res;
}

// 下载
export async function downCompanyListApi(options?: { [key: string]: any }) {
  return request<Resp<any>>('/api/certs/firmExport', {
    method: 'POST',
    ...(options || {}),
  });
}
