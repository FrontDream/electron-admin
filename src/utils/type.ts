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
export interface Result {
  id: number;
  role: number;
  token: string;
  user: string;
}
export interface LoginResData {
  results: Result;
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
export interface RoleTypeListItem {
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
