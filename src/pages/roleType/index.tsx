import { Button, message, Popconfirm } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { ModalForm, ProFormText, FormInstance } from '@ant-design/pro-form';
import { RoleTypeListItem, isSuccess, TableListPagination, RoleTypeData } from '@/utils';
import { getRoleTypeListApi, addRoleTypeApi, deleteRoleTypeApi, updateRoleTypeApi } from '@/services';
import moment from 'moment';

const RoleTypeList: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<RoleTypeListItem>();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isDdd, setIsDdd] = useState(true);
  const modalFormRef = useRef<FormInstance>();

  const columns: ProColumns<RoleTypeListItem>[] = [
    {
      title: '角色类型名称',
      dataIndex: 'name',
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
        <Popconfirm
          title="确定删除该角色类型吗?"
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

  const onFinish = async (value: RoleTypeData) => {
    const { name } = value;

    try {
      setConfirmLoading(true);
      let res = {};

      if (isDdd) {
        res = await addRoleTypeApi({ name });
      } else {
        res = await updateRoleTypeApi({ name, id: currentRow?.id || 0 });
      }

      if (isSuccess(res)) {
        message.success(`${isDdd ? '新增' : '修改'}角色类型成功`);
        setModalVisible(false);
        if (actionRef.current) {
          actionRef.current.reload();
        }
      } else {
        message.error(`${isDdd ? '新增' : '修改'}角色类型失败，请重试！`);
      }
    } catch (error) {
      console.error('error:', error);
    } finally {
      setConfirmLoading(false);
    }
  };
  const handleRemove = async (record: RoleTypeListItem) => {
    const hide = message.loading('正在删除');
    const { id = 0 } = record;

    try {
      const res = await deleteRoleTypeApi(id);

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
      <ProTable<RoleTypeListItem, TableListPagination>
        headerTitle="角色类型列表"
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
        request={getRoleTypeListApi}
        columns={columns}
      />
      {modalVisible && (
        <ModalForm<RoleTypeData>
          formRef={modalFormRef}
          modalProps={{ centered: true, confirmLoading }}
          title={isDdd ? '新建角色类型' : '修改角色类型'}
          width="400px"
          visible={modalVisible}
          onVisibleChange={setModalVisible}
          onFinish={onFinish}
          initialValues={isDdd ? {} : { ...currentRow }}
        >
          <ProFormText
            label={'角色类型名称'}
            rules={[
              {
                required: true,
                message: '角色类型名称不能为空',
              },
            ]}
            name="name"
          />
        </ModalForm>
      )}
    </PageContainer>
  );
};

export default RoleTypeList;
