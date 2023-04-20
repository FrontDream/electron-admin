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
  id: number;
  ctime?: string;
  mtime?: string;
  create_by?: string;
  update_by?: string;
  name?: string;
  sort_order?: number;
  create_user: string;
  update_user: string;
  is_exists_user: boolean;
  rel_user_list: Array<string>;
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
  is_exists_user: boolean;
  rel_user_list: Array<string>;
}
export interface RoleTypeData {
  name: string;
}
export interface RoleData {
  name: string;
  role_type: number;
}

export interface UserListRes extends TableListPagination {
  data: Array<UserListItem>;
}
export interface UserListItem {
  id: number;
  last_login: string;
  is_superuser: boolean;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_active: boolean;
  date_joined: string;
  ctime: number;
  mtime: number;
  create_by: string;
  update_by: string;
  job_number: string;
  username: string;
  password: string;
  mobile: number;
  email: string;
  department_id: number;
  role_id: number;
  is_delete: number;
  groups: Array<string>;
  user_permissions: Array<string>;
  is_self: number;
  create_user: string;
  update_user: string;
  status: boolean;
}

export interface UserData {
  username: string;
  job_number: string;
  password: string;
  mobile: number;
  email: string;
  department_id: number;
  role_id: number;
  id?: number;
}

export interface PasswordData {
  user_id: number;
  old_password: string;
  new_password: string;
}

export interface DocumentDetail {
  create_by: number;
  create_user: string;
  ctime: number;
  file_path: string;
  id: number;
  mtime: number;
  name: string;
  parent_id: number;
  size: string;
  type: number;
  update_by: number;
  update_user: string;
  url: string;
}
export interface DocumentListItem {
  create_by: string;
  create_user: string;
  ctime: number;
  file_path: string;
  id: number;
  mtime: number;
  name: string;
  parent_id: number;
  size: string;
  type: number;
  update_by: string;
  update_user: string;
  url: string;
}

export interface DocumentData {
  file_path: string;
  name: string;
  parent_id: number;
  size: string;
  type: number;
}

export interface CertificateListRes extends TableListPagination {
  data: Array<CertificatetItem>;
}
export interface CertificatetItem {
  create_by: number;
  create_user: string;
  ctime: number;
  id: number;
  mtime: number;
  name: string;
  sort_order: number;
  update_by: number;
  update_user: string;
}

export interface CertificateData {
  name: string;
}
