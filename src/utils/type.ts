export interface Resp<T> {
  code: number;
  data: T;
  msg: string;
}
export type TableListPagination = {
  total: number;
  pageSize: number;
  current: number;
};
export interface LoginResData {
  token: string;
}
export interface DepartmentListItem {
  id?: number;
  ctime?: string;
  mtime?: string;
  create_by?: string;
  update_by?: string;
  name?: string;
  sort_order?: number;
}
export interface DepartmentData {
  name: string;
}
