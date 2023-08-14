import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { message, Tooltip } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { ProFormCheckbox, ProFormText, LoginForm, ModalForm, FormInstance } from '@ant-design/pro-form';
import { history, FormattedMessage, useModel } from 'umi';
import { loginApi, validateCustomApi, updateCustomMd5Api } from '@/services';
import { setItem, removeItem, getItem, isSuccess, LoginResData, LoginData } from '@/utils';
import styles from './index.less';

const Login: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const loginFormRef = useRef<FormInstance>();
  const [secretModalVisible, setSecretModalVisible] = useState<boolean>(false);
  const secretModalFormRef = useRef<FormInstance>();
  const [confirmLoading, setConfirmLoading] = useState(false);

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
      const validateRes = await validateCustomApi();
      const { data } = validateRes;

      if (data?.secret_valid) {
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
      } else {
        setSecretModalVisible(true);
      }
    } catch (error) {
      console.error('error:', error);
    }
  };

  const onFinish = async (value: { md5: string }) => {
    const { md5 } = value;

    try {
      setConfirmLoading(true);

      const res = await updateCustomMd5Api({ md5 });

      if (isSuccess(res, '秘钥验证失败，请重试')) {
        message.success('秘钥验证成功，欢迎继续使用');
        setSecretModalVisible(false);
      }
    } catch (error) {
      console.error('error:', error);
    } finally {
      setConfirmLoading(false);
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
              <Tooltip placement="topLeft" title={'请联系主管找回密码'}>
                <a
                  style={{
                    float: 'right',
                  }}
                >
                  <FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码" />
                </a>
              </Tooltip>
            </div>
          </LoginForm>
        </div>
      </div>
      {secretModalVisible && (
        <ModalForm<any>
          formRef={secretModalFormRef}
          modalProps={{ centered: true, confirmLoading, maskClosable: false }}
          title={'有效期已到，请输入秘钥'}
          width="400px"
          visible={secretModalVisible}
          onVisibleChange={setSecretModalVisible}
          onFinish={onFinish}
        >
          <ProFormText
            label={'秘钥'}
            rules={[
              {
                required: true,
                message: '秘钥不能为空',
              },
            ]}
            name="md5"
          />
        </ModalForm>
      )}
    </div>
  );
};

export default Login;
