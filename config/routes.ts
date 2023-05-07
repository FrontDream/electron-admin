const routes = [
  {
    name: '用户管理',
    icon: 'UserOutlined',
    path: '/user',
    routes: [
      {
        path: '/user',
        redirect: '/user/userManagement',
      },
      {
        name: '用户列表',
        path: '/user/userManagement',
        component: './userManagement',
      },
      {
        name: '部门列表',
        path: '/user/department',
        component: './department',
      },
      {
        name: '角色类型列表',
        path: '/user/roleType',
        component: './roleType',
      },
      {
        name: '角色列表',
        path: '/user/role',
        component: './roleManagement',
      },
      {
        path: '/user/login',
        layout: false,
        component: './login',
      },
    ],
  },
  {
    name: '证书管理',
    icon: 'SafetyCertificateOutlined',
    path: '/certificate',
    routes: [
      {
        path: '/certificate',
        redirect: '/certificate/list',
      },
      {
        name: '类型列表',
        path: '/certificate/type',
        component: './certificateType',
      },
      {
        name: '人员列表',
        path: '/certificate/person',
        component: './certificatePerson',
      },
      {
        name: '证书列表',
        path: '/certificate/list',
        component: './certificateList',
      },
    ],
  },
  {
    name: '文件管理',
    icon: 'FileDoneOutlined',
    path: '/fileManagement',
    routes: [
      {
        path: '/fileManagement',
        redirect: '/fileManagement/list',
      },
      {
        name: '文件列表',
        path: '/fileManagement/list',
        component: './documentManagement',
      },
    ],
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
    redirect: '/user/userManagement',
  },
  {
    component: '404',
  },
];

export default routes;
