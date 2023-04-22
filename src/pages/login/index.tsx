import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { message } from 'antd';
import React, { useEffect, useRef } from 'react';
import { ProFormCheckbox, ProFormText, LoginForm, FormInstance } from '@ant-design/pro-form';
import { history, FormattedMessage, useModel } from 'umi';
import { loginApi } from '@/services/user';
import { setItem, removeItem, getItem, isSuccess, LoginResData, LoginData } from '@/utils';
import styles from './index.less';

const Login: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const loginFormRef = useRef<FormInstance>();

  useEffect(() => {
    const username = getItem('username') || '';
    const password = getItem('password') || '';

    loginFormRef?.current?.setFieldsValue({
      username,
      password,
    });
  }, []);

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();

    if (userInfo) {
      await setInitialState(s => ({
        ...s,
        currentUser: userInfo,
      }));
    }
  };

  const handleSubmit = async (values: LoginData) => {
    // 登录
    const { username, password, rememberMe } = values;

    if (rememberMe) {
      setItem('username', username);
      setItem('password', password);
    } else {
      removeItem('username');
      removeItem('password');
    }

    try {
      const res = await loginApi({ username, password });

      if (isSuccess(res, '登录失败，请重试')) {
        const { data = {} as LoginResData } = res;

        setItem('jwt', data.token);
        message.success('登录成功');
        await fetchUserInfo();
        /** 此方法会跳转到 redirect 参数所在的位置 */
        if (!history) return;
        const { query } = history.location;
        const { redirect } = query as { redirect: string };

        history.push(redirect || '/');
        return;
      }
    } catch (error) {
      console.error('error:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.con}>
        <div className={styles.titles}>
          <img className={styles.logo} src={'/logo2x.png'}></img>
          <div className={styles.title}>
            <div className={styles.titleCn}>旭达共享</div>
            <div className={styles.titleEn}>XUN DA SHARING</div>
          </div>
        </div>
        <div className={styles.form}>
          <LoginForm<LoginData> formRef={loginFormRef} onFinish={handleSubmit} initialValues={{ rememberMe: true }}>
            <div className={styles.loginType}>账号密码登录</div>
            <ProFormText
              name="username"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined className={styles.prefixIcon} />,
              }}
              placeholder={'用户名'}
              rules={[
                {
                  required: true,
                  message: '请输入用户名',
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={styles.prefixIcon} />,
              }}
              placeholder={'请输入密码'}
              rules={[
                {
                  required: true,
                  message: '请输入密码',
                },
              ]}
            />
            <div
              style={{
                marginBottom: 24,
              }}
            >
              <ProFormCheckbox noStyle name="rememberMe">
                <FormattedMessage id="pages.login.rememberMe" defaultMessage="记住密码" />
              </ProFormCheckbox>
              <a
                style={{
                  float: 'right',
                }}
              >
                <FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码" />
              </a>
            </div>
          </LoginForm>
        </div>
      </div>
    </div>
  );
};

export default Login;
