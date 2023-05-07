import { UploadFile } from 'antd/lib/upload';

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

export interface LoginData {
  password: string;
  username: string;
  rememberMe?: boolean;
}
export interface LoginResData {
  id: number;
  role: number;
  token: string;
  user: string;
}

export interface UserInfoDetail {
  user_id: number;
  username: string;
  mobile: number;
  email: string;
  cert_msg: string;
  menu_list: Array<PermissionFirstLevel>;
}

export interface DepartmentListRes extends TableListPagination {
  data: Array<DepartmentListItem>;
}
export interface DepartmentUserItem {
  key: number;
  title: string;
}
export interface DepartmentUserRes extends DepartmentUserItem {
  children: Array<DepartmentUserItem>;
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
  can_delete: boolean;
  is_exists_role: boolean;
  rel_role_list: Array<string>;
}
export interface DepartmentData {
  name: string;
}
export interface RoleManagementListRes extends TableListPagination {
  data: Array<RoleManagementListItem>;
}
export interface RoleDetail {
  id: number;
  ctime: number;
  mtime: number;
  create_by: number;
  update_by: number;
  name: string;
  role_type: number;
  sort_order: number;
  role_type_name: string;
  is_exists_user: boolean;
  rel_user_list: Array<number>;
  menu_ids: Array<number>;
  api_ids: Array<number>;
  create_user: string;
  update_user: string;
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
  menu_ids: Array<number>;
  permission_ids: Array<number>;
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
export interface DocumentPermissionAction {
  can_upload: true;
  can_delete: true;
  can_download: true;
  can_create: true;
}
export interface DocumentRes extends DocumentPermissionAction {
  list: Array<DocumentListItem>;
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
  format: string;
  imageUrl?: string;
  isSelected?: boolean;
  isShowOpetate?: boolean;
  can_authorize: boolean;
  can_delete: boolean;
  can_download: boolean;
  can_edit: boolean;
}

export interface DocumentData {
  file_path?: string;
  name: string;
  parent_id: number;
  size?: string;
  type: number;
  format?: string;
}

export interface CertificateTypeListRes extends TableListPagination {
  data: Array<CertificateTypeItem>;
}
export interface CertificateTypeItem {
  create_by: number;
  create_user: string;
  ctime: number;
  id: number;
  mtime: number;
  name: string;
  sort_order: number;
  update_by: number;
  update_user: string;
  can_delete: boolean;
  is_exists_cert: boolean;
  rel_cert_list: Array<string>;
}

export interface CertificateTypeData {
  name: string;
}

export interface CertificatePersonListRes extends TableListPagination {
  data: Array<CertificatePersonItem>;
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
export interface CertificatePersonItem {
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
  id: number;
  /**
   * 证件号
   */
  id_number?: string;
  mtime?: number;
  /**
   * 证书人名称
   */
  name: string;
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
  is_exists_cert: boolean;
  rel_cert_list: Array<string>;
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
export interface CertificateRes extends TableListPagination {
  data: Array<CertificateItem>;
}

export interface CertificateItem {
  appendix_list: Array<AppendixList>;
  /**
   * 分类
   */
  category?: string;
  /**
   * 证书编号
   */
  cert_code?: string;
  /**
   * 证书颁布时间
   */
  cert_data?: string;
  /**
   * 关联证书人员id
   */
  cert_id: number;
  /**
   * 代码标注，1-是 2-否
   */
  code_label?: number;
  /**
   * 标注名称
   */
  code_label_name: string;
  create_by?: number;
  create_user?: string;
  ctime?: number;
  /**
   * 失效时间
   */
  expire_time?: string;
  id?: number;
  /**
   * 发证机关
   */
  issue_authority?: string;
  /**
   * 专业
   */
  major?: string;
  mtime?: number;
  /**
   * 失效提示时间，3代表3个月
   */
  reminder_time?: number;
  /**
   * 证书类型id
   */
  type: number;
  /**
   * 类型名称
   */
  type_name: string;
  update_by?: number;
  update_user?: string;
}

export interface AppendixList {
  /**
   * 附件path
   */
  file_path: string;
  /**
   * 附件名
   */
  name: string;
  /**
   * url
   */
  url: string;
  uid: string;
}
export interface CertificateData {
  cert_id: number;
  cert_code: string;
  type: number;
  category: string;
  major: string;
  cert_data: string;
  expire_time: string;
  code_label: number;
  reminder_time: string;
  issue_authority: string;
  appendix_list: Array<UploadFile>;
}
export interface CertificateReqData {
  cert_id: number;
  cert_code: string;
  type: number;
  category: string;
  major: string;
  cert_data: string;
  expire_time: string;
  code_label: number;
  reminder_time: string;
  issue_authority: string;
  appendix_list: Array<FileType>;
  id?: number;
}

export interface FileType {
  name: string;
  file_path: string;
}

export enum FileTypeEnum {
  Document = 1,
  Image = 2,
  Zip = 3,
  Others = 4,
}

export interface TempDocumentData {
  type: FileTypeEnum;
  format: string;
  filename: string;
}
export interface TempDocumentResData {
  list: Array<TempDocumentResItem>;
}
export interface TempDocumentResItem {
  filename: string;
  file_path: string;
  url: string;
}

export interface MultiRes {
  list: Array<DocumentListItem>;
}

export interface PermissionRes {
  list: Array<PermissionFirstLevel>;
}
export interface PermissionListItem {
  can_create?: boolean;
  can_destroy?: boolean;
  can_update?: boolean;
  can_view?: boolean;
  cat_id?: number;
  create_by?: number;
  create_user?: string;
  ctime?: number;
  id?: number;
  mtime?: number;
  object_name?: string;
  object_name_cn?: string;
  update_by?: number;
  update_user?: string;
}

export interface PermissionReq {
  object_name: string;
  object_name_cn: string;
  cat_id: number;
  id?: number;
}

export interface UpdateDocReq {
  doc_id: number;
  doc_type: number;
  can_view?: boolean;
  can_create?: boolean;
  can_update?: boolean;
  can_destroy?: boolean;
  user_list: Array<number | string>;
}

export interface PermissionThirdLevel {
  id: number;
  path: string;
  brief: string;
  request_method: string;
  disable?: boolean;
}
export interface PermissionSecondLevel {
  menu_id: number;
  menu_name: string;
  children: Array<PermissionThirdLevel>;
  parentMenuId?: number;
  parentMenuName?: string;
  thirdCheckedList?: Array<number>;
  secondIsChecked?: boolean;
}

export interface PermissionFirstLevel {
  menu_id: number;
  menu_name: string;
  list: Array<PermissionSecondLevel>;
}
