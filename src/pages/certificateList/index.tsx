import { Button, message, Modal } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import {
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormDatePicker,
  FormInstance,
  ProFormDependency,
  ProFormUploadDragger,
} from '@ant-design/pro-form';
import type { RangePickerProps } from 'antd/es/date-picker';
import { CertificateItem, isSuccess, CertificateTypeItem, CertificateData, TableListPagination } from '@/utils';
import {
  getCertificateListApi,
  addCertificateApi,
  deleteCertificateApi,
  updateCertificateApi,
  getCertificateTypeListApi,
} from '@/services';
import moment from 'moment';
import { ExclamationCircleFilled } from '@ant-design/icons';
import styles from './index.less';
import { useRequest } from 'umi';

const { warning, confirm } = Modal;

const CertificateList: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<CertificateItem>();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isDdd, setIsDdd] = useState(true);
  const modalFormRef = useRef<FormInstance>();

  const { data: certificatetTypes = [] } = useRequest(async () => {
    const { data = [] } = await getCertificateTypeListApi({
      current: 1,
      pageSize: 9999,
    });

    return { data };
  });

  const certificateTypeEnum = certificatetTypes.reduce((pre, cur: CertificateTypeItem) => {
    pre[cur.id] = {
      text: cur.name,
    };
    return pre;
  }, {});

  const columns: ProColumns<CertificateItem>[] = [
    {
      title: '证书编号',
      dataIndex: 'cert_code',
    },
    {
      title: '岗位类别',
      dataIndex: 'category',
      hideInSearch: true,
    },
    {
      title: '专业',
      dataIndex: 'major',
      hideInSearch: true,
    },
    {
      title: '发证日期',
      dataIndex: 'cert_data',
      hideInSearch: true,
    },
    {
      title: '失效日期',
      dataIndex: 'expire_time',
      hideInSearch: true,
    },
    {
      title: '代码标注',
      dataIndex: 'code_label',
      hideInSearch: true,
      render: val => (val === 1 ? '是' : '否'),
    },
    {
      title: '失效提示时间',
      dataIndex: 'reminder_time',
      hideInSearch: true,
    },
    {
      title: '证书类型',
      dataIndex: 'type',
      valueType: 'select',
      valueEnum: certificateTypeEnum,
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

  const onFinish = async (values: CertificateData) => {
    console.log('values:', values);
    try {
      setConfirmLoading(true);
      let res = {};

      console.log('currentRow:', currentRow);

      if (isDdd) {
        res = await addCertificateApi({ ...values });
      } else {
        res = await updateCertificateApi({ ...values, id: currentRow?.id || 0 });
      }

      if (isSuccess(res, `${isDdd ? '新增' : '修改'}证书失败，请重试！`)) {
        message.success(`${isDdd ? '新增' : '修改'}证书成功`);
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
  const handleRemove = async (record: CertificateItem) => {
    const { id = 0, is_exists_cert, rel_cert_list } = record;
    const del = async () => {
      const hide = message.loading('正在删除');

      try {
        const res = await deleteCertificateApi(id);

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
        content: `该人员正在使用中，请先前往证书管理删除 ${rel_cert_list.join(
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

  const handleChangeExpireTime = val => {
    const expire_time = moment(val);
    const reminder_time = moment(expire_time).subtract(3, 'months');

    modalFormRef.current?.setFieldValue('reminder_time', reminder_time);
  };

  return (
    <PageContainer>
      <ProTable<CertificateItem, TableListPagination>
        headerTitle="证书列表"
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
        request={getCertificateListApi}
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
          persistenceKey: 'certificatet',
          persistenceType: 'localStorage',
        }}
      />

      {modalVisible && (
        <ModalForm<CertificateData>
          formRef={modalFormRef}
          modalProps={{ centered: true, confirmLoading }}
          title={isDdd ? '新建证书' : '修改证书'}
          width="600px"
          visible={modalVisible}
          onVisibleChange={setModalVisible}
          onFinish={onFinish}
          initialValues={isDdd ? {} : { ...currentRow }}
          grid
          colProps={{
            span: 12,
          }}
          className={styles.modalCon}
        >
          <ProFormText
            label={'证书编号'}
            name="cert_code"
            rules={[
              {
                required: true,
                message: '证书编号不能为空',
              },
            ]}
            placeholder={'请输入证书编号'}
          />
          <ProFormText
            name="category"
            label="岗位类别"
            rules={[
              {
                required: true,
                message: '岗位类别不能为空',
              },
            ]}
            placeholder={'请输入岗位类别'}
          />
          <ProFormText
            name="major"
            label="专业"
            rules={[
              {
                required: true,
                message: '专业',
              },
            ]}
            placeholder={'请输入专业'}
          />
          <ProFormDatePicker
            name="cert_data"
            label="发证日期"
            placeholder={'请选择发证日期'}
            rules={[{ required: true, message: '请选择发证日期' }]}
          />

          <ProFormDatePicker
            name="expire_time"
            label="失效日期"
            placeholder={'请选择失效日期'}
            rules={[{ required: true, message: '请选择失效日期' }]}
            fieldProps={{ onChange: handleChangeExpireTime }}
          />
          <ProFormDependency name={['expire_time']}>
            {({ expire_time }) => {
              console.log('expire_time:', expire_time);

              const month = moment(expire_time).subtract(3, 'months');
              const disabledDate: RangePickerProps['disabledDate'] = current => {
                return current && current > month.endOf('date');
              };

              console.log(month);

              return (
                <ProFormDatePicker
                  dependencies={['expire_time']}
                  name="reminder_time"
                  label="失效提示时间"
                  placeholder={'请选择失效提示时间'}
                  rules={[{ required: true, message: '请选择失效提示时间' }]}
                  fieldProps={{
                    disabledDate: disabledDate,
                  }}
                />
              );
            }}
          </ProFormDependency>

          <ProFormSelect
            name="code_label"
            label="证书代码标注"
            placeholder={'请选择证书代码标注'}
            rules={[{ required: true, message: '请选择证书代码标注' }]}
            options={[
              { label: '是', value: 1 },
              { label: '否', value: 2 },
            ]}
          />

          <ProFormSelect
            name="type"
            label="证书类型"
            placeholder={'请选择证书类型'}
            rules={[{ required: true, message: '请选择证书类型' }]}
            options={certificatetTypes.map(item => ({ label: item.name, value: item.id }))}
          />
          <ProFormUploadDragger
            max={4}
            label="证书附件"
            name="appendix_list"
            colProps={{
              span: 24,
            }}
          />
        </ModalForm>
      )}
    </PageContainer>
  );
};

export default CertificateList;
