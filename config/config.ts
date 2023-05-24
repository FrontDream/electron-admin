// https://umijs.org/config/
import { defineConfig } from 'umi';
import { join } from 'path';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';

const { REACT_APP_ENV } = process.env;

export default defineConfig({
  electronBuilder: {
    buildType: 'webpack',
    mainSrc: 'src/main',
    // externals: ['knex', 'sqlite3'],
    preloadEntry: {
      'index.ts': 'preload.js',
    },
    rendererTarget: 'web',
    builderOptions: {
      appId: 'com.xuda.desktop-oa',
      productName: '旭达共享',
      nsis: {
        oneClick: false, // 是否一键安装
        allowToChangeInstallationDirectory: true, //是否允许修改安装目录
        // allowElevation: true, // 允许请求提升。若为false，则用户必须使用提升的权限重新启动安装程序。
        installerIcon: './build/icons/icon.ico', // 安装时图标
        uninstallerIcon: './build/icons/icon.ico', //卸载时图标
        installerHeaderIcon: './build/icons/icon.ico', // 安装时头部图标
        createDesktopShortcut: true, // 是否创建桌面图标
        createStartMenuShortcut: true, // 是否创建开始菜单图标
        shortcutName: '旭达共享', // 快捷方式名称
        runAfterFinish: true, //是否安装完成后运行
      },
    },
  },
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: true,
    siderWidth: 208,
    ...defaultSettings,
  },
  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  access: {},
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // 如果不想要 configProvide 动态设置主题需要把这个设置为 default
    // 只有设置为 variable， 才能使用 configProvide 动态设置主色调
    // https://ant.design/docs/react/customize-theme-variable-cn
    'root-entry-name': 'variable',
    'primary-color': '#C8793E',
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  // Fast Refresh 热更新
  fastRefresh: {},
  openAPI: [
    {
      requestLibPath: "import { request } from 'umi'",
      // 或者使用在线的版本
      // schemaPath: "https://gw.alipayobjects.com/os/antfincdn/M%24jrzTTYJN/oneapi.json"
      schemaPath: join(__dirname, 'oneapi.json'),
      mock: false,
    },
    {
      requestLibPath: "import { request } from 'umi'",
      schemaPath: 'https://gw.alipayobjects.com/os/antfincdn/CA1dOm%2631B/openapi.json',
      projectName: 'swagger',
    },
  ],
  nodeModulesTransform: {
    type: 'none',
  },
  mfsu: {},
  webpack5: {},
  exportStatic: {},
});
