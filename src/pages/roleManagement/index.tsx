import { Button, message, Modal } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { ModalForm, ProFormText, FormInstance, ProFormSelect } from '@ant-design/pro-form';
import { RoleManagementListItem, isSuccess, RoleData, TableListPagination, RoleTypeListItem } from '@/utils';
import { getRoleManagementListApi, addRoleApi, deleteRoleApi, updateRoleApi, getRoleTypeListApi } from '@/services';
import moment from 'moment';
import { useRequest } from 'umi';
import { ExclamationCircleFilled } from '@ant-design/icons';

const { warning, confirm } = Modal;

const RoleManagementList: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<RoleManagementListItem>();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isDdd, setIsDdd] = useState(true);
  const modalFormRef = useRef<FormInstance>();

  const { data = [] } = useRequest(async () => {
    const res = await getRoleTypeListApi({
      current: 1,
      pageSize: 999,
    });

    return { data: res.data };
  });

  console.log('data:', data);
  const roleTypeEnum = data.reduce((pre, cur: RoleTypeListItem) => {
    pre[cur.id] = {
      text: cur.name,
    };
    return pre;
  }, {});

  const columns: ProColumns<RoleManagementListItem>[] = [
    {
      title: '角色名称',
      dataIndex: 'name',
    },
    {
      title: '角色类型',
      dataIndex: 'role_type',
      valueType: 'select',
      valueEnum: roleTypeEnum,
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
      title: '操作',
      dataIndex: 'option',
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
        <a key="del" onClick={() => handleRemove(record)}>
          删除
        </a>,
      ],
    },
  ];

  const onFinish = async (value: RoleData) => {
    const { name, role_type } = value;

    try {
      setConfirmLoading(true);
      let res = {};

      if (isDdd) {
        res = await addRoleApi({ name, role_type });
      } else {
        res = await updateRoleApi({ name, id: currentRow?.id || 0, role_type });
      }

      if (isSuccess(res)) {
        message.success(`${isDdd ? '新增' : '修改'}角色成功`);
        setModalVisible(false);
        if (actionRef.current) {
          actionRef.current.reload();
        }
      } else {
        message.error(`${isDdd ? '新增' : '修改'}角色失败，请重试！`);
      }
    } catch (error) {
      console.error('error:', error);
    } finally {
      setConfirmLoading(false);
    }
  };
  const handleRemove = async (record: RoleManagementListItem) => {
    const { id = 0, is_exists_user, rel_user_list } = record;

    console.log('record:', record);
    const delRole = async () => {
      const hide = message.loading('正在删除');

      try {
        const res = await deleteRoleApi(id);

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

    if (is_exists_user) {
      warning({
        title: '禁止删除',
        icon: <ExclamationCircleFilled />,
        content: `该角色正在使用中，请先删除 ${rel_user_list.join(',')} 后重试!`,
      });
      return;
    }
    confirm({
      title: '确定删除该角色吗?',
      icon: <ExclamationCircleFilled />,
      content: '角色删除后，无法恢复！请谨慎删除！',
      async onOk() {
        delRole();
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  return (
    <PageContainer>
      <ProTable<RoleManagementListItem, TableListPagination>
        headerTitle="角色列表"
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
        request={getRoleManagementListApi}
        columns={columns}
        pagination={{ pageSize: 10 }}
      />
      {modalVisible && (
        <ModalForm<RoleData>
          formRef={modalFormRef}
          modalProps={{ centered: true, confirmLoading }}
          title={isDdd ? '新建角色' : '修改角色'}
          width="400px"
          visible={modalVisible}
          onVisibleChange={setModalVisible}
          onFinish={onFinish}
          initialValues={isDdd ? {} : { ...currentRow }}
        >
          <ProFormText
            label={'角色名称'}
            rules={[
              {
                required: true,
                message: '角色名称不能为空',
              },
            ]}
            name="name"
          />
          <ProFormSelect
            options={data.map(item => ({ value: item.id, label: item.name }))}
            name="role_type"
            label="角色类型"
            rules={[
              {
                required: true,
                message: '角色类型不能为空',
              },
            ]}
          />
        </ModalForm>
      )}
    </PageContainer>
  );
};

export default RoleManagementList;
