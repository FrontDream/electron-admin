import { SettingDrawer, PageLoading, Settings as LayoutSettings, MenuDataItem } from '@ant-design/pro-layout';
import { history, RunTimeLayoutConfig, RequestConfig } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { getItem, removeItem } from '@/utils';
import { getUserInfoApi as queryCurrentUser } from '@/services';
import defaultSettings from '../config/defaultSettings';
import { message } from 'antd';
import { SafetyCertificateOutlined, UserOutlined, FileDoneOutlined } from '@ant-design/icons';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

const menuMap = {
  // 用户管理相关
  用户管理: {
    icon: <UserOutlined />,
    path: '/user',
  },
  用户列表: {
    path: '/user/userManagement',
  },
  部门列表: {
    path: '/user/department',
  },
  角色类型列表: {
    path: '/user/roleType',
  },
  角色列表: {
    path: '/user/role',
  },
  // 证书管理相关
  证书管理: {
    icon: <SafetyCertificateOutlined />,
    path: '/certificate',
  },
  类型列表: {
    path: '/certificate/type',
  },
  人员列表: {
    path: '/certificate/person',
  },
  证书列表: {
    path: '/certificate/list',
  },
  // 文件管理相关
  文件管理: {
    icon: <FileDoneOutlined />,
    path: '/fileManagement',
  },
  文件列表: {
    path: '/fileManagement/list',
  },
};

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: any;
  loading?: boolean;
  fetchUserInfo?: () => Promise<any | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const res = await queryCurrentUser();

      return res.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果不是登录页面，执行

  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();

    console.log('currentUser:', currentUser);

    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
}

const loopMenuItem = (menus: any[]): MenuDataItem[] =>
  menus.map(({ menu_name, list }) => {
    const menu = menuMap[menu_name];

    return {
      ...menu,
      name: menu_name,
      children: list && loopMenuItem(list),
    };
  });

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  console.log('initialState:', initialState?.currentUser?.menu_list);
  const menuList = initialState?.currentUser?.menu_list;

  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.username,
    },
    headerTitleRender: () => {
      return (
        <a className="customHeader">
          <img src="/topLogo.svg" />
          <h1>旭达共享</h1>
        </a>
      );
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login

      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    disableMobile: true,
    // links: isDev
    //   ? [
    //       <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
    //         <LinkOutlined />
    //         <span>OpenAPI 文档</span>
    //       </Link>,
    //       <Link to="/~docs" key="docs">
    //         <BookOutlined />
    //         <span>业务组件文档</span>
    //       </Link>,
    //     ]
    //   : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          <SettingDrawer
            disableUrlParams
            enableDarkTheme
            settings={initialState?.settings}
            onSettingChange={settings => {
              setInitialState(preInitialState => ({
                ...preInitialState,
                settings,
              }));
            }}
          />
        </>
      );
    },
    ...initialState?.settings,
    menu: {
      locale: false,
      request: async () => loopMenuItem(menuList),
    },
  };
};
// src/app.tsx
const authHeaderInterceptor = (url: string, options: RequestConfig) => {
  const jwt = getItem('jwt');
  const authHeader = { Authorization: `JWT ${jwt}` };

  if (url.includes('/api')) {
    // 非登录
    if (url !== '/api/users/login') {
      return {
        url: isDev ? url : `http://43.142.36.238${url}`,
        options: { ...options, interceptors: true, headers: authHeader },
      };
    }
    return { url: isDev ? url : `http://43.142.36.238${url}`, options };
  }
  return { url, options };
};

const responseInterceptors = async (response: Response) => {
  try {
    const { status, url } = response;

    if (status === 200 && url.includes('/api')) {
      const res = await response.clone().json();

      const { code } = res;
      const loginCodes = [410, 411, 412, 413];

      if (loginCodes.includes(code)) {
        removeItem('jwt');
        history.push(loginPath);
        message.warning('登录已过期,请重新登录！');
        return {};
      }

      return res;
    } else if (status === 200) {
      return {};
    }
    throw new Error('状态码错误');
  } catch (e) {
    console.error('3error:', e);
  }
};

export const request: RequestConfig = {
  // 新增自动添加AccessToken的请求前拦截器
  requestInterceptors: [authHeaderInterceptor],
  responseInterceptors: [responseInterceptors],
};
