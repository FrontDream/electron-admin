import { Button, message, Modal, Drawer, Card, UploadProps, Spin } from 'antd';
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
  ProFormDateRangePicker,
} from '@ant-design/pro-form';
import { ProDescriptions, ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import type { RangePickerProps } from 'antd/es/date-picker';
import {
  CertificateItem,
  isSuccess,
  CertificateData,
  TableListPagination,
  listToEnum,
  useCertificatetCompany,
  useCompanyCertificatetTypes,
  uploadFiles,
  AppendixList,
  downLoad,
} from '@/utils';
import {
  getCompanyCertificateListApi,
  addCompanyCertificateApi,
  deleteCompanyCertificateApi,
  updateCompanyCertificateApi,
} from '@/services';
import moment from 'moment';
import { ExclamationCircleFilled } from '@ant-design/icons';
import styles from './index.less';
import create from 'zustand';

const useStore = create(set => ({
  fileList: [] as AppendixList[],
  addFileList: list => set(state => ({ fileList: list })),
}));

const { confirm } = Modal;

const CompanyCertificateList: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<CertificateItem>();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [isDdd, setIsDdd] = useState(true);
  const modalFormRef = useRef<FormInstance>();
  const fileList = useStore(state => state.fileList);
  const setFileList = useStore(state => state.addFileList);
  const certificatetCompany = useCertificatetCompany();
  const companyCertificatetTypes = useCompanyCertificatetTypes();
  const companyCertificateTypeEnum = listToEnum(companyCertificatetTypes);
  const certificateCompanyEnum = listToEnum(certificatetCompany);
  const descriptionColumns: ProDescriptionsItemProps<CertificateItem>[] = [
    {
      title: '企业证书编号',
      dataIndex: 'cert_code',
      copyable: true,
    },
    {
      title: '证书所属企业',
      dataIndex: 'cert_id',
      valueEnum: certificateCompanyEnum,
    },
    {
      title: '资质等级',
      dataIndex: 'category',
    },
    {
      title: '发证机关',
      dataIndex: 'issue_authority',
    },
    {
      title: '发证日期',
      dataIndex: 'cert_data',
    },
    {
      title: '代码标注',
      dataIndex: 'code_label',
      renderText: (val: number) => (val === 1 ? '是' : '否'),
    },
    {
      title: '企业证书类型',
      dataIndex: 'type',
      valueEnum: companyCertificateTypeEnum,
    },
    {
      title: '是否有失效日期',
      dataIndex: 'has_fail_date',
      renderText: (val: number) => (val === 1 ? '是' : '否'),
    },
    {
      title: '失效日期',
      dataIndex: 'expire_time',
      renderText: (val: string, record: CertificateItem) => (record?.has_fail_date === 1 ? val : '-'),
    },
    {
      title: '失效提示日期',
      dataIndex: 'reminder_time',
      renderText: (val: string, record: CertificateItem) => (record?.has_fail_date === 1 ? val : '-'),
    },
    {
      title: '是否有使用有效期',
      dataIndex: 'has_use_date',
      renderText: (val: number) => (val === 1 ? '是' : '否'),
    },
    {
      title: '使用有效期',
      dataIndex: 'use_date_start',
      renderText: (val: string, record: CertificateItem) =>
        record?.has_use_date === 1 ? `${record?.use_date_start}至${record?.use_date_end}` : '-',
    },
    {
      title: '使用有效期提示日期',
      dataIndex: 'use_date_reminder',
      renderText: (val: string, record: CertificateItem) => (record?.has_use_date === 1 ? val : '-'),
    },
    {
      title: '创建人',
      dataIndex: 'create_user',
    },
    {
      title: '修改人',
      dataIndex: 'update_user',
    },
    {
      title: '创建时间',
      dataIndex: 'ctime',
      renderText: (val: number) => moment.unix(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '修改时间',
      dataIndex: 'mtime',
      renderText: (val: number) => moment.unix(val).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];
  const tableColumns: ProColumns<CertificateItem>[] = [
    {
      title: '企业证书编号',
      dataIndex: 'cert_code',
      copyable: true,
    },
    {
      title: '证书所属企业',
      dataIndex: 'cert_id',
      valueType: 'select',
      valueEnum: certificateCompanyEnum,
    },
    {
      title: '资质等级',
      dataIndex: 'category',
      hideInSearch: true,
    },
    {
      title: '发证机关',
      dataIndex: 'issue_authority',
      hideInSearch: true,
    },
    {
      title: '发证日期',
      dataIndex: 'cert_data',
      hideInSearch: true,
    },
    {
      title: '代码标注',
      dataIndex: 'code_label',
      hideInSearch: true,
      render: val => (val === 1 ? '是' : '否'),
    },
    {
      title: '失效日期',
      dataIndex: 'expire_time',
      hideInSearch: true,
    },
    {
      title: '失效提示时间',
      dataIndex: 'reminder_time',
      hideInSearch: true,
    },
    {
      title: '企业证书类型',
      dataIndex: 'type',
      valueType: 'select',
      valueEnum: companyCertificateTypeEnum,
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
            const { appendix_list = [], use_date_start, use_date_end, has_use_date } = record;

            setModalVisible(true);
            setCurrentRow({ ...record, validity_period: has_use_date === 1 ? [use_date_start, use_date_end] : [] });
            setIsDdd(false);

            setFileList(appendix_list);
          }}
        >
          修改
        </a>,
        <a
          key="detail"
          onClick={() => {
            setCurrentRow(record);
            setShowDetail(true);
          }}
        >
          详情
        </a>,

        <a key="del" onClick={() => handleRemove(record)}>
          删除
        </a>,
      ],
    },
  ];

  const onFinish = async (values: CertificateData) => {
    const { validity_period = [], has_use_date, ...rest } = values;
    let body = { ...rest, has_use_date, appendix_list: fileList };

    try {
      if (uploading) {
        message.warning('正在上传，请上传后重试!');
        return;
      }
      setConfirmLoading(true);
      let res = {};

      if (has_use_date === 1 && validity_period?.length > 0) {
        body = { ...body, use_date_start: validity_period[0], use_date_end: validity_period[1] };
      }

      if (isDdd) {
        res = await addCompanyCertificateApi({ ...body });
      } else {
        res = await updateCompanyCertificateApi({ ...body, id: currentRow?.id || 0 });
      }

      if (isSuccess(res, `${isDdd ? '新增' : '修改'}企业证书失败，请重试！`)) {
        message.success(`${isDdd ? '新增' : '修改'}企业证书成功`);
        setModalVisible(false);
        setFileList([]);
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
    const { id = 0 } = record;
    const del = async () => {
      const hide = message.loading('正在删除');

      try {
        const res = await deleteCompanyCertificateApi(id);

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

    confirm({
      title: '确定删除该企业证书吗?',
      icon: <ExclamationCircleFilled />,
      content: '企业证书删除后，无法恢复！请谨慎删除！',
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
    const reminder_time = moment(expire_time).subtract(6, 'months');

    modalFormRef.current?.setFieldValue('reminder_time', reminder_time);
  };
  const onRemove = (file: any) => {
    const { uid } = file;
    const files = fileList.filter(item => item.uid !== uid);

    setFileList(files);
  };

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    fileList: fileList,
    onRemove: onRemove,
    customRequest: async ({ file, onSuccess, onError }) => {
      const { name, uid } = file;

      try {
        setUploading(true);

        const res = await uploadFiles([{ name, file, uid }]);
        const fileListUpdate = useStore.getState().fileList;

        setUploading(false);
        onSuccess?.(res, file);

        setFileList([...fileListUpdate, ...res]);
      } catch (error) {
        onError?.(error);
      }
      return;
    },
  };

  return (
    <PageContainer>
      <ProTable<CertificateItem, TableListPagination>
        headerTitle="企业证书列表"
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
        request={getCompanyCertificateListApi}
        columns={tableColumns}
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
          persistenceKey: 'certificateList',
          persistenceType: 'localStorage',
        }}
      />

      {modalVisible && (
        <ModalForm<CertificateData>
          formRef={modalFormRef}
          modalProps={{ centered: true, confirmLoading }}
          title={isDdd ? '新建企业证书' : '修改企业证书'}
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
            label={'企业证书编号'}
            name="cert_code"
            rules={[
              {
                required: true,
                message: '企业证书编号不能为空',
              },
            ]}
            placeholder={'请输入企业证书编号'}
          />
          <ProFormSelect
            name="cert_id"
            label="证书所属企业"
            placeholder={'请选择证书所属企业'}
            rules={[{ required: true, message: '请选择证书所属企业' }]}
            options={certificatetCompany.map(item => ({ label: item.name, value: item.id }))}
          />
          <ProFormText name="category" label="资质等级" placeholder={'请输入资质等级'} />
          <ProFormText
            label={'发证机关'}
            name="issue_authority"
            rules={[
              {
                required: true,
                message: '发证机关不能为空',
              },
            ]}
            placeholder={'请输入发证机关'}
          />
          <ProFormDatePicker
            name="cert_data"
            label="发证日期"
            placeholder={'请选择发证日期'}
            rules={[{ required: true, message: '请选择发证日期' }]}
          />
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
            options={companyCertificatetTypes.map(item => ({ label: item.name, value: item.id }))}
          />
          <ProFormSelect
            name="has_fail_date"
            label="是否有失效日期"
            placeholder={'请选择是否有失效日期'}
            rules={[{ required: true, message: '请选择是否有失效日期' }]}
            options={[
              { label: '是', value: 1 },
              { label: '否', value: 2 },
            ]}
          />
          <ProFormDependency name={['has_fail_date']}>
            {({ has_fail_date }) => {
              if (has_fail_date === 1) {
                return (
                  <>
                    <ProFormDatePicker
                      name="expire_time"
                      label="失效日期"
                      placeholder={'请选择失效日期'}
                      rules={[{ required: true, message: '请选择失效日期' }]}
                      fieldProps={{ onChange: handleChangeExpireTime }}
                    />
                    <ProFormDependency name={['expire_time']}>
                      {({ expire_time }) => {
                        const month = moment(expire_time).subtract(6, 'months');
                        const disabledDate: RangePickerProps['disabledDate'] = current => {
                          return current && current > month.endOf('date');
                        };

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
                  </>
                );
              }
              return <></>;
            }}
          </ProFormDependency>
          <ProFormSelect
            name="has_use_date"
            label="是否有使用有效期"
            placeholder={'请选择是否有使用有效期'}
            rules={[{ required: true, message: '请选择是否有使用有效期' }]}
            options={[
              { label: '是', value: 1 },
              { label: '否', value: 2 },
            ]}
          />
          <ProFormDependency name={['has_use_date']}>
            {({ has_use_date }) => {
              if (has_use_date === 1) {
                return (
                  <>
                    <ProFormDateRangePicker
                      name="validity_period"
                      label="有效期范围"
                      placeholder={'请选择有效期范围'}
                      rules={[{ required: true, message: '请选择有效期范围' }]}
                    />

                    <ProFormDependency name={['validity_period']}>
                      {({ validity_period }) => {
                        const month = moment(validity_period).subtract(6, 'months');
                        const disabledDate: RangePickerProps['disabledDate'] = current => {
                          return current && current > month.endOf('date');
                        };

                        return (
                          <ProFormDatePicker
                            dependencies={['validity_period']}
                            name="use_date_reminder"
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
                  </>
                );
              }
              return <></>;
            }}
          </ProFormDependency>

          <Spin spinning={uploading}>
            <ProFormUploadDragger
              max={4}
              label="证书附件"
              colProps={{
                span: 24,
              }}
              fieldProps={{ ...uploadProps }}
            />
          </Spin>
        </ModalForm>
      )}
      <Drawer
        width={'50%'}
        open={showDetail}
        onClose={() => {
          setCurrentRow({} as CertificateItem);
          setShowDetail(false);
        }}
        closable={true}
        title={'证书详情'}
      >
        <ProDescriptions<CertificateItem>
          column={2}
          title={'基本信息'}
          dataSource={currentRow}
          columns={descriptionColumns}
        />
        <Card title={'附件'} bordered={false} className={styles.appendixListCard}>
          {currentRow?.appendix_list?.map(item => {
            return (
              <div key={item.uid}>
                <a onClick={() => downLoad(item.url, item.name)}>{item.name}</a>
              </div>
            );
          })}
        </Card>
      </Drawer>
    </PageContainer>
  );
};

export default CompanyCertificateList;
