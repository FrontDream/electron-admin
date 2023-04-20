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

export interface CertificatePersonListRes extends TableListPagination {
  data: Array<CertificatetPersonItem>;
}

/**
 * 学历枚举id， (1, "初中"),         (2, "高中"),         (3, "中专"),         (4, "大专"),         (5,
 * "本科"),         (6, "研究生"),
 */
export enum EducationType {
  MiddleSchool = 1,
  HightSchool = 2,
  SecondarySchool = 3,
  JuniorCollege = 4,
  Undergraduate = 5,
  Master = 6,
}
export interface CertificatetPersonItem {
  /**
   * 公司
   */
  company: string;
  create_by?: number;
  create_user?: string;
  ctime?: number;

  edu_background: EducationType;
  /**
   * 学历名
   */
  edu_background_name?: string;
  /**
   * 入职时间
   */
  entry_time: string;
  /**
   * 证件失效时间
   */
  expire_time: string;
  /**
   * 性别id
   */
  gender?: number;
  /**
   * 性别名
   */
  gender_name?: string;
  id?: number;
  /**
   * 证件号
   */
  id_number?: string;
  mtime?: number;
  /**
   * 证书人名称
   */
  name?: string;
  /**
   * 电话号码
   */
  phone?: string;
  /**
   * 离职时间
   */
  resign_time?: string;
  update_by?: number;
  update_user?: string;
}

export interface CertificatetPersonData {
  company: string;
  edu_background: EducationType;
  entry_time: string;
  expire_time: string;
  gender: number;
  id_number: string;
  name: string;
  phone: string;
  resign_time: string;
  id?: number;
}
