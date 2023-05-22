const routes = [
  {
    name: '用户管理',
    icon: 'UserOutlined',
    path: '/user',
    access: 'isUser',
    routes: [
      {
        path: '/user',
        redirect: '/user/userList',
      },
      {
        name: '用户列表',
        path: '/user/userList',
        component: './userList',
        access: 'isUserList',
      },
      {
        name: '部门列表',
        path: '/user/departmentList',
        component: './departmentList',
        access: 'isDepartmentList',
      },
      {
        name: '角色类型列表',
        path: '/user/roleTypeList',
        component: './roleTypeList',
        access: 'isRoleTypeList',
      },
      {
        name: '角色列表',
        path: '/user/roleList',
        component: './roleList',
        access: 'isRoleList',
      },
    ],
  },
  {
    name: '证书管理',
    icon: 'SafetyCertificateOutlined',
    path: '/certificate',
    access: 'isCertificate',
    routes: [
      {
        path: '/certificate',
        redirect: '/certificate/list',
      },
      {
        name: '类型列表',
        path: '/certificate/typeList',
        component: './certificateTypeList',
        access: 'isCertificateTypeList',
      },
      {
        name: '人员列表',
        path: '/certificate/person',
        component: './certificatePersonList',
        access: 'isCertificatePersonList',
      },
      {
        name: '人员详情',
        hideInMenu: true,
        path: '/certificate/person/:id',
        component: './certificatePersonList/detail',
        // access: 'isCertificatePersonList',
      },
      {
        name: '证书列表',
        path: '/certificate/list',
        component: './certificateList',
        access: 'isCertificateList',
      },
      {
        name: '企业证书类型列表',
        path: '/certificate/companyTypeList',
        component: './companyCertificateTypeList',
      },
      {
        name: '企业列表',
        path: '/certificate/companyList',
        component: './companyList',
      },
    ],
  },
  {
    name: '文件管理',
    icon: 'FileDoneOutlined',
    path: '/documentManagement',
    access: 'isDocumentManagement',
    routes: [
      {
        path: '/documentManagement',
        redirect: '/documentManagement/list',
      },
      {
        name: '文件列表',
        path: '/documentManagement/list',
        component: './documentManagement',
        access: 'isDocumentList',
      },
    ],
  },
  {
    name: '报表管理',
    icon: 'BarChartOutlined',
    path: '/chartManagement',
    access: 'isChartManagement',
    routes: [
      {
        path: '/chartManagement',
        redirect: '/chartManagement/durationList',
      },
      {
        name: '在线统计',
        path: '/chartManagement/durationList',
        component: './durationList',
        access: 'isDurationList',
      },
      {
        name: '日志列表',
        path: '/chartManagement/recordList',
        component: './recordList',
        access: 'isLogList',
      },
    ],
  },
  {
    name: '秘钥管理',
    icon: 'SkypeOutlined',
    path: '/secret',
    routes: [
      {
        path: '/secret',
        redirect: '/secret/customsList',
      },
      {
        name: '客户列表',
        path: '/secret/customsList',
        component: './customsList',
      },
    ],
  },
  {
    path: '/login',
    name: '登录中心',
    layout: false,
    hideInMenu: true,
    component: './login',
  },
  // {
  //   name: 'account',
  //   icon: 'user',
  //   path: '/account',
  //   routes: [
  //     {
  //       path: '/account',
  //       redirect: '/account/center',
  //     },
  //     {
  //       name: 'center',
  //       icon: 'smile',
  //       path: '/account/center',
  //       component: './account/center',
  //     },
  //     {
  //       name: 'settings',
  //       icon: 'smile',
  //       path: '/account/settings',
  //       component: './account/settings',
  //     },
  //   ],
  // },
  {
    path: '/',
    redirect: '/documentManagement/list',
  },
  {
    component: '404',
  },
];

export default routes;
