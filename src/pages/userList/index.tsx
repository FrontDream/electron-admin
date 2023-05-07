import { Button, message, Switch, Modal } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { ModalForm, ProFormText, FormInstance, ProFormSelect, ProFormDigit } from '@ant-design/pro-form';
import { ExclamationCircleFilled } from '@ant-design/icons';
import {
  UserListItem,
  isSuccess,
  UserData,
  TableListPagination,
  RoleManagementListItem,
  DepartmentListItem,
  PasswordData,
} from '@/utils';
import {
  getUserListApi,
  addUserApi,
  deleteUserApi,
  updateUserApi,
  getDepartmentListApi,
  getRoleManagementListApi,
  updateUserStatusApi,
  updatePassword,
} from '@/services';
import moment from 'moment';
import { useRequest, useModel } from 'umi';

const { confirm } = Modal;

interface PasswordFormData extends PasswordData {
  password: string;
}

const userManagement: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<UserListItem>();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [passwordConfirmLoading, setPasswordConfirmLoading] = useState(false);
  const [isDdd, setIsDdd] = useState(true);
  const modalFormRef = useRef<FormInstance>();
  const passwordModalFormRef = useRef<FormInstance>();
  // const { initialState } = useModel('@@initialState');
  // const { currentUser } = initialState || {};

  const { data: departments = [] } = useRequest(async () => {
    const { data = [] } = await getDepartmentListApi({
      current: 1,
      pageSize: 9999,
    });

    return { data };
  });
  const { data: roles = [] } = useRequest(async () => {
    const { data = [] } = await getRoleManagementListApi({
      current: 1,
      pageSize: 9999,
    });

    return { data };
  });

  const roleEnum = roles.reduce((pre, cur: RoleManagementListItem) => {
    pre[cur.id] = {
      text: cur.name,
    };
    return pre;
  }, {});

  const departmentEnum = departments.reduce((pre, cur: DepartmentListItem) => {
    pre[cur.id] = {
      text: cur.name,
    };
    return pre;
  }, {});

  const handleChangeStatus = (record: UserListItem) => {
    const { id = 0, status } = record;
    const txt = status ? '禁用' : '启用';
    const updateUser = async () => {
      const hide = message.loading(`正在${txt}`);

      try {
        const res = await updateUserStatusApi({ id, status: !status });

        if (isSuccess(res)) {
          message.success(`${txt}成功`);
          if (actionRef.current) {
            actionRef.current.reload();
          }
        } else {
          message.error(`${txt}失败，请重试`);
        }
      } catch (error) {
        console.error('error:', error);
      } finally {
        hide();
      }
    };

    confirm({
      title: `确定${txt}该用户吗?`,
      icon: <ExclamationCircleFilled />,
      content: status ? '禁用后该用户无法登录！' : '启用后该用户可以登录!',
      async onOk() {
        updateUser();
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const columns: ProColumns<UserListItem>[] = [
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
    },
    {
      title: '角色',
      dataIndex: 'role_id',
      valueType: 'select',
      valueEnum: roleEnum,
    },
    {
      title: '部门',
      dataIndex: 'department_id',
      valueType: 'select',
      valueEnum: departmentEnum,
    },
    {
      title: '创建人',
      dataIndex: 'create_user',
      hideInSearch: true,
    },
    {
      title: '修改人',
      dataIndex: 'update_user',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'ctime',
      hideInSearch: true,
      renderText: (val: number) => moment.unix(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '修改时间',
      dataIndex: 'mtime',
      hideInSearch: true,
      renderText: (val: number) => moment.unix(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'option',
      render: (_, record) => {
        return <Switch checked={record.status} onChange={() => handleChangeStatus(record)} />;
      },
    },
    {
      title: '操作',
      dataIndex: 'id',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="update"
          onClick={() => {
            setModalVisible(true);
            setCurrentRow(record);
            setIsDdd(false);
          }}
        >
          修改
        </a>,
        <a
          key="updatePassword"
          onClick={() => {
            setPasswordModalVisible(true);
            setCurrentRow(record);
            setIsDdd(false);
          }}
        >
          修改密码
        </a>,
        <a key="del" onClick={() => handleRemove(record)}>
          删除
        </a>,
      ],
    },
  ];

  const onFinish = async (values: UserData) => {
    try {
      setConfirmLoading(true);
      let res = {};

      if (isDdd) {
        res = await addUserApi({ ...values });
      } else {
        res = await updateUserApi({ ...values, id: currentRow?.id || 0 });
      }

      if (isSuccess(res, `${isDdd ? '新增' : '修改'}用户失败，请重试！`)) {
        message.success(`${isDdd ? '新增' : '修改'}用户成功`);
        setModalVisible(false);
        if (actionRef.current) {
          actionRef.current.reload();
        }
      }
    } catch (error) {
      console.error('error:', error);
    } finally {
      setConfirmLoading(false);
    }
  };
  const onRePasswordFinish = async (values: PasswordData) => {
    try {
      setPasswordConfirmLoading(true);
      const res = await updatePassword({ ...values, user_id: currentRow!.id });

      if (isSuccess(res, '修改用户密码失败，请重试')) {
        message.success('修改密码成功');
        setPasswordModalVisible(false);
        if (actionRef.current) {
          actionRef.current.reload();
        }
      }
    } catch (error) {
      console.error('error:', error);
    } finally {
      setPasswordConfirmLoading(false);
    }
  };
  const handleRemove = async (record: UserListItem) => {
    const delUser = async () => {
      const hide = message.loading('正在删除');
      const { id = 0 } = record;

      try {
        const res = await deleteUserApi(id);

        if (isSuccess(res)) {
          message.success('删除成功');
          if (actionRef.current) {
            actionRef.current.reload();
          }
        } else {
          message.error('删除失败，请重试');
        }
      } catch (error) {
        console.error('error:', error);
      } finally {
        hide();
      }
    };

    confirm({
      title: '确定删除该用户吗?',
      icon: <ExclamationCircleFilled />,
      content: '用户删除后，无法恢复！请谨慎删除！',
      async onOk() {
        await delUser();
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  return (
    <PageContainer>
      <ProTable<UserListItem, TableListPagination>
        headerTitle="用户列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setModalVisible(true);
              setIsDdd(true);
            }}
          >
            新建
          </Button>,
        ]}
        request={getUserListApi}
        columns={columns}
        pagination={{ pageSize: 10 }}
        columnsState={{
          defaultValue: {
            ctime: {
              show: false,
            },
            mtime: {
              show: false,
            },
            create_user: {
              show: false,
            },
            update_user: {
              show: false,
            },
          },
          persistenceKey: 'userManagement',
          persistenceType: 'localStorage',
        }}
      />
      {modalVisible && (
        <ModalForm<UserData>
          formRef={modalFormRef}
          modalProps={{ centered: true, confirmLoading }}
          title={isDdd ? '新建用户' : '修改用户'}
          width="600px"
          visible={modalVisible}
          onVisibleChange={setModalVisible}
          onFinish={onFinish}
          initialValues={isDdd ? {} : { ...currentRow }}
          grid
          colProps={{
            span: 12,
          }}
        >
          <ProFormText
            label={'用户名'}
            name="username"
            rules={[
              {
                required: true,
                message: '用户名不能为空',
              },
            ]}
            placeholder={'请输入用户名'}
          />
          <ProFormText
            label={'邮箱'}
            name="email"
            rules={[
              { required: true, message: '请输入用户邮箱' },
              { type: 'email', message: '请输入正确格式的邮箱' },
            ]}
            placeholder="请输入用户邮箱"
          />
          <ProFormSelect
            name="department_id"
            label="部门"
            placeholder={'请选择用户所属部门'}
            rules={[{ required: true, message: '请选择用户所属部门' }]}
            options={departments.map(item => ({
              value: item.id,
              label: item.name,
            }))}
            fieldProps={{
              showSearch: true,
              filterOption: (input, option) => (option?.label as string).includes(input),
            }}
          />
          <ProFormSelect
            name="role_id"
            label="角色"
            placeholder={'请选择用户所属角色'}
            rules={[{ required: true, message: '请选择用户所属角色' }]}
            options={roles.map(item => ({
              value: item.id,
              label: item.name,
            }))}
            fieldProps={{
              showSearch: true,
              filterOption: (input, option) => (option?.label as string).includes(input),
            }}
          />
          <ProFormDigit
            name="mobile"
            label="电话"
            placeholder={'请输入用户电话'}
            rules={[
              { required: true, message: '请输入用户电话' },
              {
                pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
                message: '请输入正确的手机号',
              },
            ]}
            fieldProps={{ controls: false }}
          />
          <ProFormText
            label={'工号'}
            name="job_number"
            rules={[
              {
                required: true,
                message: '工号不能为空',
              },
            ]}
            placeholder={'请输入工号'}
          />
          {isDdd && (
            <>
              <ProFormText.Password
                label="密码"
                name="password"
                placeholder={'请输入用户登录密码'}
                rules={[
                  { required: true, message: '请输入用户登录密码' },
                  {
                    pattern: /^(?![^a-zA-Z]+$)(?!\\D+$).{8,16}$/,
                    message: '8-16位字符，必须包括字母和数字',
                  },
                ]}
              />
              <ProFormText.Password
                label="确认密码"
                name="rePassword"
                dependencies={['password']}
                placeholder={'请输入用户登录密码'}
                rules={[
                  { required: true, message: '请输入用户登录密码' },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject('密码与确认新密码不同！');
                    },
                  }),
                ]}
              />
            </>
          )}
        </ModalForm>
      )}
      {passwordModalVisible && (
        <ModalForm<PasswordFormData>
          formRef={passwordModalFormRef}
          modalProps={{ centered: true, confirmLoading: passwordConfirmLoading }}
          title={'修改密码'}
          width="400px"
          visible={passwordModalVisible}
          onVisibleChange={setPasswordModalVisible}
          onFinish={onRePasswordFinish}
        >
          <ProFormText.Password
            label="旧密码"
            name="old_password"
            placeholder={'请输入用户旧密码'}
            rules={[
              { required: true, message: '请输入用户旧密码' },
              {
                pattern: /^(?![^a-zA-Z]+$)(?!\\D+$).{8,16}$/,
                message: '8-16位字符，必须包括字母和数字',
              },
            ]}
          />
          <ProFormText.Password
            label="新密码"
            name="password"
            placeholder={'请输入用户新密码'}
            rules={[{ required: true, message: '请输入用户新密码' }]}
          />
          <ProFormText.Password
            label="确认新密码"
            name="new_password"
            dependencies={['password']}
            placeholder={'请输入用户新密码'}
            rules={[
              { required: true, message: '请输入用户新密码' },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('新密码与确认新密码不同！');
                },
              }),
            ]}
          />
        </ModalForm>
      )}
    </PageContainer>
  );
};

export default userManagement;
