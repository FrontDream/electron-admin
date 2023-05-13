import { Button, message, Modal } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { ModalForm, ProFormText, FormInstance } from '@ant-design/pro-form';
import { CertificateTypeItem, isSuccess, DepartmentData, TableListPagination } from '@/utils';
import {
  getCertificateTypeListApi,
  addCertificateTypeApi,
  deleteCertificateTypeApi,
  updateCertificateTypeApi,
} from '@/services';
import moment from 'moment';
import { ExclamationCircleFilled } from '@ant-design/icons';

const { warning, confirm } = Modal;

const CertificateTypeList: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<CertificateTypeItem>();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isDdd, setIsDdd] = useState(true);
  const modalFormRef = useRef<FormInstance>();

  const columns: ProColumns<CertificateTypeItem>[] = [
    {
      title: '证书类型',
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
      dataIndex: 'id',
      valueType: 'option',
      render: (_, record) => {
        const { can_delete } = record;

        if (can_delete) {
          return [
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
          ];
        }
        return [];
      },
    },
  ];

  const onFinish = async (value: DepartmentData) => {
    const { name } = value;

    try {
      setConfirmLoading(true);
      let res = {};

      console.log('currentRow:', currentRow);

      if (isDdd) {
        res = await addCertificateTypeApi({ name });
      } else {
        res = await updateCertificateTypeApi({ name, id: currentRow?.id || 0 });
      }

      if (isSuccess(res, `${isDdd ? '新增' : '修改'}证书类型失败，请重试！`)) {
        message.success(`${isDdd ? '新增' : '修改'}证书类型成功`);
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
  const handleRemove = async (record: CertificateTypeItem) => {
    const { id = 0, is_exists_cert, rel_cert_list } = record;
    const del = async () => {
      const hide = message.loading('正在删除');

      try {
        const res = await deleteCertificateTypeApi(id);

        if (isSuccess(res, '删除失败，请重试')) {
          message.success('删除成功');
          if (actionRef.current) {
            actionRef.current.reload();
          }
        }
      } catch (error) {
        console.error('error:', error);
      } finally {
        hide();
      }
    };

    if (is_exists_cert) {
      warning({
        title: '禁止删除',
        icon: <ExclamationCircleFilled />,
        content: `该证书类型正在使用中，请先前往证书列表删除 ${rel_cert_list.join(
          ',',
        )} 等证书或修改这些证书的所属证书类型后重试!`,
      });
      return;
    }
    confirm({
      title: '确定删除该证书类型吗?',
      icon: <ExclamationCircleFilled />,
      content: '证书类型删除后，无法恢复！请谨慎删除！',
      async onOk() {
        del();
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  return (
    <PageContainer>
      <ProTable<CertificateTypeItem, TableListPagination>
        headerTitle="证书类型列表"
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
        request={getCertificateTypeListApi}
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
          persistenceKey: 'certificatetType',
          persistenceType: 'localStorage',
        }}
      />
      {modalVisible && (
        <ModalForm<DepartmentData>
          formRef={modalFormRef}
          modalProps={{ centered: true, confirmLoading }}
          title={isDdd ? '新建证书类型' : '修改证书类型'}
          width="400px"
          visible={modalVisible}
          onVisibleChange={setModalVisible}
          onFinish={onFinish}
          initialValues={isDdd ? {} : { ...currentRow }}
        >
          <ProFormText
            label={'证书类型名称'}
            rules={[
              {
                required: true,
                message: '证书类型名称不能为空',
              },
            ]}
            name="name"
          />
        </ModalForm>
      )}
    </PageContainer>
  );
};

export default CertificateTypeList;
