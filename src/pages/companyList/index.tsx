import { Button, message, Modal } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormDatePicker, FormInstance, ProFormMoney } from '@ant-design/pro-form';
import { CompanyCertificateListItem, isSuccess, CompanyCertificateData, TableListPagination } from '@/utils';
import {
  getCertificateCompanyListApi,
  addCertificateCompanyApi,
  deleteCertificateCompanyApi,
  updateCertificateCompanynApi,
} from '@/services';
import moment from 'moment';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import styles from './index.less';

const { warning, confirm } = Modal;

const CompanyList: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<CompanyCertificateListItem>();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isDdd, setIsDdd] = useState(true);
  const modalFormRef = useRef<FormInstance>();
  const history = useHistory();

  const columns: ProColumns<CompanyCertificateListItem>[] = [
    {
      title: '企业名',
      dataIndex: 'name',
      render: (_, record) => [
        <a key={'name'} onClick={() => history.push(`/certificate/certificateCompany/${record.id}`)}>
          {record.name}
        </a>,
      ],
    },
    {
      title: '企业曾用名',
      dataIndex: 'former_name',
    },
    {
      title: '统一社会信用编码',
      dataIndex: 'credit_code',
    },
    {
      title: '成立时间',
      dataIndex: 'established_date',
      hideInSearch: true,
    },
    {
      title: '法定代表人',
      dataIndex: 'leg_representative',
    },
    {
      title: '注册资本(万元)',
      dataIndex: 'reg_capital',
      hideInSearch: true,
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

  const onFinish = async (values: CompanyCertificateData) => {
    try {
      setConfirmLoading(true);
      let res = {};

      if (isDdd) {
        res = await addCertificateCompanyApi({ ...values });
      } else {
        res = await updateCertificateCompanynApi({ ...values, id: currentRow?.id || 0 });
      }

      if (isSuccess(res, `${isDdd ? '新增' : '修改'}企业失败，请重试！`)) {
        message.success(`${isDdd ? '新增' : '修改'}企业成功`);
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
  const handleRemove = async (record: CompanyCertificateListItem) => {
    const { id = 0, is_exists_cert, rel_cert_list } = record;
    const del = async () => {
      const hide = message.loading('正在删除');

      try {
        const res = await deleteCertificateCompanyApi(id);

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
        content: `该企业正在使用中，请先前往企业证书列表删除 ${rel_cert_list.join(
          ',',
        )} 等证书或修改这些证书的所属企业后重试!`,
      });
      return;
    }
    confirm({
      title: '确定删除该企业吗?',
      icon: <ExclamationCircleFilled />,
      content: '企业删除后，无法恢复！请谨慎删除！',
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
      <ProTable<CompanyCertificateListItem, TableListPagination>
        headerTitle="企业列表"
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
        request={getCertificateCompanyListApi}
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
          persistenceKey: 'companyCertificatet',
          persistenceType: 'localStorage',
        }}
      />

      {modalVisible && (
        <ModalForm<CompanyCertificateData>
          formRef={modalFormRef}
          modalProps={{ centered: true, confirmLoading }}
          title={isDdd ? '新建企业' : '修改企业'}
          width="600px"
          visible={modalVisible}
          onVisibleChange={setModalVisible}
          onFinish={onFinish}
          initialValues={isDdd ? {} : { ...currentRow }}
          grid
          colProps={{
            span: 8,
          }}
          className={styles.modalCon}
        >
          <ProFormText
            label={'企业名称'}
            name="name"
            rules={[
              {
                required: true,
                message: '企业名称不能为空',
              },
            ]}
            placeholder={'请输入企业名称'}
          />
          <ProFormText label={'企业曾用名'} name="former_name" placeholder={'请输入企业曾用名'} />
          <ProFormText label={'企业注册地址'} name="reg_address" placeholder={'请输入企业注册地址'} />
          <ProFormText label={'企业详情地址'} name="address" placeholder={'请输入企业详情地址'} />
          <ProFormText label={'统一社会信用编码'} name="credit_code" placeholder={'请输入一社会信用编码'} />
          <ProFormDatePicker name="established_date" label="成立时间" placeholder={'请选择成立时间'} />
          <ProFormText label={'法定代表人'} name="leg_representative" placeholder={'请输入法定代表人'} />
          <ProFormMoney label="注册资本(万元)" name="reg_capital" />
        </ModalForm>
      )}
    </PageContainer>
  );
};

export default CompanyList;
