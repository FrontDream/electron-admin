import { Button, message, Popconfirm, Switch } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { ModalForm, ProFormText, FormInstance, ProFormSelect, ProFormDigit } from '@ant-design/pro-form';
import {
  UserListItem,
  isSuccess,
  UserData,
  TableListPagination,
  RoleManagementListItem,
  DepartmentListItem,
} from '@/utils';
import {
  getUserListApi,
  addUserApi,
  deleteUserApi,
  updateUserApi,
  getDepartmentListApi,
  getRoleManagementListApi,
} from '@/services';
import moment from 'moment';
import { useRequest } from 'umi';

const userManagement: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<UserListItem>();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isDdd, setIsDdd] = useState(true);
  const modalFormRef = useRef<FormInstance>();
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
      dataIndex: 'is_active',
      valueType: 'option',
      render: (_, record) => {
        return <Switch checked={record.is_active} />;
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
        <Popconfirm
          title="确定删除该用户吗?"
          okText="确定"
          cancelText="取消"
          key="del"
          onConfirm={() => handleRemove(record)}
        >
          <a key="del">删除</a>
        </Popconfirm>,
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

      if (isSuccess(res)) {
        message.success(`${isDdd ? '新增' : '修改'}用户成功`);
        setModalVisible(false);
        if (actionRef.current) {
          actionRef.current.reload();
        }
      } else {
        message.error(`${isDdd ? '新增' : '修改'}用户失败，请重试！`);
      }
    } catch (error) {
      console.error('error:', error);
    } finally {
      setConfirmLoading(false);
    }
  };
  const handleRemove = async (record: UserListItem) => {
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
          <ProFormText.Password
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入用户登录密码' }]}
            placeholder={'请输入用户登录密码'}
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
        </ModalForm>
      )}
    </PageContainer>
  );
};

export default userManagement;
