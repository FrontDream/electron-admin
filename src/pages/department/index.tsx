import { Button, message, Popconfirm } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { ModalForm, ProFormText, FormInstance } from '@ant-design/pro-form';
import { DepartmentListItem, isSuccess, DepartmentData, TableListPagination } from '@/utils';
import {
  getDepartmentListApi,
  addDepartmentApi,
  deleteDepartmentApi,
  updateDepartmentApi,
} from '@/services/department';
import moment from 'moment';

const DepartmentList: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<DepartmentListItem>();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isDdd, setIsDdd] = useState(true);
  const modalFormRef = useRef<FormInstance>();

  const columns: ProColumns<DepartmentListItem>[] = [
    {
      title: '部门名称',
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
          title="确定删除该部门吗?"
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

  const onFinish = async (value: DepartmentData) => {
    const { name } = value;

    try {
      setConfirmLoading(true);
      let res = {};

      if (isDdd) {
        res = await addDepartmentApi({ name });
      } else {
        res = await updateDepartmentApi({ name, id: currentRow?.id || 0 });
      }

      if (isSuccess(res)) {
        message.success(`${isDdd ? '新增' : '修改'}部门成功`);
        setModalVisible(false);
        if (actionRef.current) {
          actionRef.current.reload();
        }
      } else {
        message.error(`${isDdd ? '新增' : '修改'}部门失败，请重试！`);
      }
    } catch (error) {
      console.error('error:', error);
    } finally {
      setConfirmLoading(false);
    }
  };
  const handleRemove = async (record: DepartmentListItem) => {
    const hide = message.loading('正在删除');
    const { id = 0 } = record;

    try {
      const res = await deleteDepartmentApi(id);

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
      <ProTable<DepartmentListItem, TableListPagination>
        headerTitle="部门列表"
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
        request={getDepartmentListApi}
        columns={columns}
        pagination={{ pageSize: 10 }}
      />
      {modalVisible && (
        <ModalForm<DepartmentData>
          formRef={modalFormRef}
          modalProps={{ centered: true, confirmLoading }}
          title={isDdd ? '新建部门' : '修改部门'}
          width="400px"
          visible={modalVisible}
          onVisibleChange={setModalVisible}
          onFinish={onFinish}
          initialValues={isDdd ? {} : { ...currentRow }}
        >
          <ProFormText
            label={'部门名称'}
            rules={[
              {
                required: true,
                message: '部门名称不能为空',
              },
            ]}
            name="name"
          />
        </ModalForm>
      )}
    </PageContainer>
  );
};

export default DepartmentList;
