import { SettingDrawer, PageLoading, Settings as LayoutSettings } from '@ant-design/pro-layout';
import { history, Link, RunTimeLayoutConfig, RequestConfig } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { getItem, removeItem } from '@/utils';
import { getUserInfoApi as queryCurrentUser } from '@/services';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import defaultSettings from '../config/defaultSettings';
import { message } from 'antd';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

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

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
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
  };
};
// src/app.tsx
const authHeaderInterceptor = (url: string, options: RequestConfig) => {
  const jwt = getItem('jwt');
  const authHeader = { Authorization: `JWT ${jwt}` };

  // 非登录
  if (url !== '/api/users/login') {
    return {
      url,
      options: { ...options, interceptors: true, headers: authHeader },
    };
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
