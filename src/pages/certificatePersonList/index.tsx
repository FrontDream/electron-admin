import { Button, message, Modal } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import {
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormDatePicker,
  ProFormDigit,
  FormInstance,
  ProFormDependency,
  ProFormTextArea,
} from '@ant-design/pro-form';
import {
  CertificatePersonItem,
  educationOptions,
  isSuccess,
  CertificatetPersonData,
  TableListPagination,
} from '@/utils';
import {
  getCertificatePersonListApi,
  addCertificatePersonApi,
  deleteCertificatePersonApi,
  updateCertificatePersonApi,
} from '@/services';
import moment from 'moment';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import styles from './index.less';

const { warning, confirm } = Modal;

const CertificatePersonList: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<CertificatePersonItem>();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isDdd, setIsDdd] = useState(true);
  const modalFormRef = useRef<FormInstance>();
  const history = useHistory();

  const columns: ProColumns<CertificatePersonItem>[] = [
    {
      title: '姓名',
      dataIndex: 'name',
      valueType: 'option',
      render: (_, record) => [
        <a key={'name'} onClick={() => history.push(`/certificate/person/${record.id}`)}>
          {record.name}
        </a>,
      ],
    },
    {
      title: '性别',
      dataIndex: 'gender',
      hideInSearch: true,
      renderText: val => (val === 1 ? '男' : '女'),
    },
    {
      title: '证件号码',
      dataIndex: 'id_number',
      copyable: true,
    },
    {
      title: '证件失效时间',
      dataIndex: 'expire_time',
      hideInSearch: true,
    },
    {
      title: '学历',
      dataIndex: 'edu_background_name',
      hideInSearch: true,
    },
    {
      title: '联系号码',
      dataIndex: 'phone',
    },
    {
      title: '入职时间',
      dataIndex: 'entry_time',
      hideInSearch: true,
    },
    {
      title: '离职时间',
      dataIndex: 'resign_time',
      hideInSearch: true,
    },
    {
      title: '所属公司',
      dataIndex: 'company',
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

  const onFinish = async (values: CertificatetPersonData) => {
    try {
      setConfirmLoading(true);
      let res = {};

      if (isDdd) {
        res = await addCertificatePersonApi({ ...values });
      } else {
        res = await updateCertificatePersonApi({ ...values, id: currentRow?.id || 0 });
      }

      if (isSuccess(res, `${isDdd ? '新增' : '修改'}人员失败，请重试！`)) {
        message.success(`${isDdd ? '新增' : '修改'}人员成功`);
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
  const handleRemove = async (record: CertificatePersonItem) => {
    const { id = 0, is_exists_cert, rel_cert_list } = record;
    const del = async () => {
      const hide = message.loading('正在删除');

      try {
        const res = await deleteCertificatePersonApi(id);

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
        content: `该人员正在使用中，请先前往证书列表删除 ${rel_cert_list.join(
          ',',
        )} 等证书或修改这些证书的所属人员后重试!`,
      });
      return;
    }
    confirm({
      title: '确定删除该人员吗?',
      icon: <ExclamationCircleFilled />,
      content: '人员删除后，无法恢复！请谨慎删除！',
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
      <ProTable<CertificatePersonItem, TableListPagination>
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
        request={getCertificatePersonListApi}
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
          persistenceKey: 'certificatetPerson',
          persistenceType: 'localStorage',
        }}
      />

      {modalVisible && (
        <ModalForm<CertificatetPersonData>
          formRef={modalFormRef}
          modalProps={{ centered: true, confirmLoading }}
          title={isDdd ? '新建人员' : '修改人员'}
          width="800px"
          visible={modalVisible}
          onVisibleChange={setModalVisible}
          onFinish={onFinish}
          initialValues={isDdd ? {} : { ...currentRow }}
          grid
          colProps={{
            span: 6,
          }}
          className={styles.modalCon}
        >
          <ProFormText
            label={'姓名'}
            name="name"
            rules={[
              {
                required: true,
                message: '姓名不能为空',
              },
            ]}
            placeholder={'请输入姓名'}
          />
          <ProFormSelect
            name="gender"
            label="性别"
            placeholder={'请选择性别'}
            rules={[{ required: true, message: '请选择性别' }]}
            options={[
              { label: '男', value: 1 },
              { label: '女', value: 2 },
            ]}
          />
          <ProFormText
            label={'证件号码'}
            name="id_number"
            rules={[
              {
                required: true,
                message: '证件号不能为空',
              },
            ]}
            placeholder={'请输入证件号'}
          />
          <ProFormText
            label={'所属公司'}
            name="company"
            rules={[
              {
                required: true,
                message: '所属公司不能为空',
              },
            ]}
            placeholder={'请输入所属公司'}
          />

          <ProFormSelect
            name="edu_background"
            label="学历"
            placeholder={'请选择学历'}
            rules={[{ required: true, message: '请选择学历' }]}
            options={educationOptions}
          />
          <ProFormDigit
            name="phone"
            label="联系号码"
            placeholder={'请输入联系号码'}
            rules={[
              { required: true, message: '请输入联系号码' },
              {
                pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
                message: '请输入联系号码',
              },
            ]}
            fieldProps={{ controls: false }}
          />
          <ProFormDatePicker
            name="entry_time"
            label="入职日期"
            placeholder={'请选择入职日期'}
            rules={[{ required: true, message: '请选择入职日期' }]}
          />
          <ProFormSelect
            name="job_status"
            label="是否离职"
            placeholder={'请选择是否离职'}
            rules={[{ required: true, message: '请选择是否离职' }]}
            options={[
              { label: '离职', value: 1 },
              { label: '在职', value: 2 },
            ]}
          />
          <ProFormDependency name={['job_status']}>
            {({ job_status }) => {
              if (job_status === 1) {
                return (
                  <ProFormDatePicker
                    name="resign_time"
                    label="离职日期"
                    placeholder={'请选择离职日期'}
                    rules={[{ required: true, message: '请选择离职日期' }]}
                  />
                );
              }
              return <></>;
            }}
          </ProFormDependency>

          <ProFormDatePicker
            name="expire_time"
            label="证件失效日期"
            placeholder={'请选择证书失效日期'}
            rules={[{ required: true, message: '请选择证书失效日期' }]}
          />
          <ProFormText label={'合同所属公司'} name="contract" placeholder={'请输入合同所属公司'} />
          <ProFormText label={'闽政通所属公司'} name="mzt" placeholder={'请输入闽政通所属公司'} />
          <ProFormText label={'医保所属公司'} name="medical_insurance" placeholder={'请输入医保所属公司'} />
          <ProFormText label={'社保所属公司'} name="social_security" placeholder={'请输入社保所属公司'} />
          <ProFormText label={'公积金所属公司'} name="prov_fund_company" placeholder={'请输入公积金所属公司'} />
          <ProFormText label={'继续教育情况'} name="continuing_edu" placeholder={'请输入继续教育情况'} />
          <ProFormTextArea
            label="备注"
            name="remark"
            colProps={{
              span: 24,
            }}
          />
        </ModalForm>
      )}
    </PageContainer>
  );
};

export default CertificatePersonList;
