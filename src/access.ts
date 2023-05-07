/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
import { UserInfoDetail, PermissionFirstLevel } from './utils';

export default function access(initialState: { currentUser?: UserInfoDetail } | undefined) {
  const { currentUser = {} as UserInfoDetail } = initialState ?? {};
  const { menu_list = [] as Array<PermissionFirstLevel> } = currentUser;
  const menuNames = [] as Array<string>;

  menu_list.map(firstMenu => {
    const { menu_name, list } = firstMenu;

    menuNames.push(menu_name);
    const secondMenus = list.map(item => item.menu_name) || [];

    menuNames.push(...secondMenus);
  });

  console.log('currentUser====:', currentUser);
  console.log('menuNames====:', menuNames);

  return {
    isUser: (route: any) => menuNames.includes(route.name),
    isUserList: (route: any) => menuNames.includes(route.name),
    isDepartmentList: (route: any) => menuNames.includes(route.name),
    isRoleTypeList: (route: any) => menuNames.includes(route.name),
    isRoleList: (route: any) => menuNames.includes(route.name),
    isCertificate: (route: any) => menuNames.includes(route.name),
    isCertificateTypeList: (route: any) => menuNames.includes(route.name),
    isCertificatePersonList: (route: any) => menuNames.includes(route.name),
    isCertificateList: (route: any) => menuNames.includes(route.name),
    isDocumentManagement: (route: any) => menuNames.includes(route.name),
    isDocumentList: (route: any) => menuNames.includes(route.name),
  };
}
