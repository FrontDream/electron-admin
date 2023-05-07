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
    isUser: menuNames.includes('用户管理'),
    isUserList: menuNames.includes('用户列表'),
    isDepartmentList: menuNames.includes('部门列表'),
    isRoleTypeList: menuNames.includes('角色类型列表'),
    isRoleList: menuNames.includes('角色列表'),
    isCertificate: menuNames.includes('证书管理'),
    isCertificateTypeList: menuNames.includes('类型列表'),
    isCertificatePersonList: menuNames.includes('人员列表'),
    isCertificateList: menuNames.includes('证书列表'),
    isDocumentManagement: menuNames.includes('文件管理'),
    isDocumentList: menuNames.includes('文件列表'),
  };
}
