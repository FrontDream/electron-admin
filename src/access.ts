/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
import { UserInfoDetail, PermissionFirstLevel } from './utils';

export default function access(initialState: { currentUser?: UserInfoDetail } | undefined) {
  const { currentUser = {} as UserInfoDetail } = initialState ?? {};
  const { menu_list = [] as Array<PermissionFirstLevel> } = currentUser;

  return {
    isUser: (route: any) => menu_list.includes(route.name),
    isUserList: (route: any) => menu_list.includes(route.name),
    isDepartmentList: (route: any) => menu_list.includes(route.name),
    isRoleTypeList: (route: any) => menu_list.includes(route.name),
    isRoleList: (route: any) => menu_list.includes(route.name),
    isCertificate: (route: any) => menu_list.includes(route.name),
    isCertificateTypeList: (route: any) => menu_list.includes(route.name),
    isCertificatePersonList: (route: any) => menu_list.includes(route.name),
    isCertificateList: (route: any) => menu_list.includes(route.name),
    isDocumentManagement: (route: any) => menu_list.includes(route.name),
    isDocumentList: (route: any) => menu_list.includes(route.name),
    isChartManagement: (route: any) => menu_list.includes(route.name),
    isDurationList: (route: any) => menu_list.includes(route.name),
    isLogList: (route: any) => menu_list.includes(route.name),
  };
}
