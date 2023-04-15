export interface Resp<T> {
  code: number;
  data: T;
  msg: string;
}
export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}
export interface Result {
  id: number;
  role: number;
  token: string;
  user: string;
}
export interface LoginResData {
  id: number;
  role: number;
  token: string;
  user: string;
}
export interface DepartmentListRes extends TableListPagination {
  data: Array<DepartmentListItem>;
}
export interface DepartmentListItem {
  id?: number;
  ctime?: string;
  mtime?: string;
  create_by?: string;
  update_by?: string;
  name?: string;
  sort_order?: number;
  create_user: string;
  update_user: string;
}
export interface RoleTypeListRes extends TableListPagination {
  data: Array<RoleTypeListItem>;
}
export interface RoleTypeListItem {
  id: number;
  ctime?: string;
  mtime?: string;
  create_by?: string;
  update_by?: string;
  name?: string;
  sort_order?: number;
  create_user: string;
  update_user: string;
}
export interface DepartmentData {
  name: string;
}
export interface RoleManagementListRes extends TableListPagination {
  data: Array<RoleManagementListItem>;
}
export interface RoleManagementListItem {
  id: number;
  ctime: number;
  mtime: number;
  create_by: string;
  update_by: string;
  name: string;
  role_type: number;
  sort_order: number;
  create_user: string;
  update_user: string;
}
export interface RoleTypeData {
  name: string;
}
export interface RoleData {
  name: string;
  role_type: number;
}
