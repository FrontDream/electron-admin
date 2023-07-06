import { Button, message, Modal, Drawer, Card, UploadProps, Spin, Upload } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import {
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormDatePicker,
  FormInstance,
  ProFormUploadDragger,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { ProDescriptions, ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
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
  importCompanyValidateExcelApi,
  importCompanyFromExcelApi,
  downCompanyCertificateListApi,
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
  const downModalFormRef = useRef<FormInstance>();
  const [downVisible, setDownVisible] = useState<boolean>(false);
  const fileList = useStore(state => state.fileList);
  const setFileList = useStore(state => state.addFileList);
  const certificatetCompany = useCertificatetCompany();
  const companyCertificatetTypes = useCompanyCertificatetTypes();
  const companyCertificateTypeEnum = listToEnum(companyCertificatetTypes);
  const certificateCompanyEnum = listToEnum(certificatetCompany);
  const descriptionColumns: ProDescriptionsItemProps<CertificateItem>[] = [
    {
      title: '证照目录号',
      dataIndex: 'license_no',
      copyable: true,
    },
    {
      title: '证书类型',
      dataIndex: 'type',
      valueEnum: companyCertificateTypeEnum,
    },
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
      title: '发证机构',
      dataIndex: 'agency',
    },
    {
      title: '发证日期',
      dataIndex: 'cert_data',
    },
    {
      title: '年检日期',
      dataIndex: 'annual_date',
    },
    {
      title: '有效日期(止)',
      dataIndex: 'use_date_end',
    },
    {
      title: '摘要',
      dataIndex: 'summary',
    },
    {
      title: '备注',
      dataIndex: 'remark',
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
      title: '证照目录号',
      dataIndex: 'license_no',
      copyable: true,
      hideInSearch: true,
    },
    {
      title: '证书类型',
      dataIndex: 'type',
      valueType: 'select',
      valueEnum: companyCertificateTypeEnum,
    },
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
      title: '发证机构',
      dataIndex: 'agency',
      hideInSearch: true,
    },
    {
      title: '发证日期',
      dataIndex: 'cert_data',
      hideInSearch: true,
    },
    {
      title: '年检日期',
      dataIndex: 'annual_date',
      hideInSearch: true,
    },
    {
      title: '有效日期(止)',
      dataIndex: 'use_date_end',
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
      fixed: 'right',
      render: (_, record) => [
        <a
          key="update"
          onClick={() => {
            const { appendix_list = [] } = record;

            setModalVisible(true);
            setCurrentRow({ ...record });
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
    const body = { ...values, appendix_list: fileList };

    try {
      if (uploading) {
        message.warning('正在上传，请上传后重试!');
        return;
      }
      setConfirmLoading(true);
      let res = {};

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

  const uploadExcelProps: UploadProps = {
    name: 'file',
    customRequest: async ({ file }) => {
      const formData = new FormData();

      formData.append('filename', file as any);
      try {
        const validateRes = await importCompanyValidateExcelApi({ file: formData });

        if (isSuccess(validateRes, '上传失败，请重试')) {
          const { data = { is_cert_exist: false } } = validateRes;
          const updateExcel = async () => {
            try {
              const uploadRes = await importCompanyFromExcelApi({ file: formData });

              if (isSuccess(uploadRes, '上传失败，请重试')) {
                message.success('上传成功');
                actionRef.current?.reload();
              }
            } catch (error) {
              console.log('error:', error);
            }
          };

          if (data.is_cert_exist) {
            confirm({
              title: '存在覆盖的数据，确定覆盖吗？',
              icon: <ExclamationCircleFilled />,
              content: '覆盖后，无法恢复！请谨慎覆盖！',
              async onOk() {
                await updateExcel();
              },
              onCancel() {
                console.log('Cancel');
              },
            });
            return;
          }
          await updateExcel();
          return;
        }
      } catch (error) {
        console.log('error:', error);
      }
    },
    maxCount: 1,
    accept: '.xlsx,.xls',
    showUploadList: false,
  };

  const onDownFinish = async (values: { cert_type: number }) => {
    const { cert_type } = values;

    try {
      const res = await downCompanyCertificateListApi({ cert_type });

      console.log('res:', res);

      if (isSuccess(res)) {
        const { url } = res?.data;
        const day = moment().format('YYYY-MM-DD HH:mm:ss');
        let name = `${day}_台账.xlsx`;

        if (cert_type in companyCertificateTypeEnum) {
          name = `${day}_${companyCertificateTypeEnum[cert_type].text}类台账.xlsx`;
        }

        downLoad(url, name);
        message.success('下载成功');
      }
    } catch (e) {
      console.log('error:', e);
    }
  };

  const handleDown = () => {
    setDownVisible(true);
  };

  return (
    <PageContainer>
      <ProTable<CertificateItem, TableListPagination>
        scroll={{ x: 2000 }}
        headerTitle="企业证书列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button type="primary" key="down" onClick={handleDown}>
            下载
          </Button>,
          <Upload {...uploadExcelProps} key="upload">
            <Button type="primary" key="import">
              导入
            </Button>
          </Upload>,
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
          persistenceKey: 'companyCertificateList',
          persistenceType: 'localStorage',
        }}
      />

      {modalVisible && (
        <ModalForm<CertificateData>
          formRef={modalFormRef}
          modalProps={{ centered: true, confirmLoading, maskClosable: false }}
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
            label={'证照目录号'}
            name="license_no"
            rules={[
              {
                required: true,
                message: '证照目录号不能为空',
              },
            ]}
            placeholder={'请输入证照目录号'}
          />
          <ProFormSelect
            name="type"
            label="证书类型"
            placeholder={'请选择证书类型'}
            rules={[{ required: true, message: '请选择证书类型' }]}
            options={companyCertificatetTypes.map(item => ({ label: item.name, value: item.id }))}
          />
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
          <ProFormText label={'摘要'} name="summary" placeholder={'请输入摘要'} />
          <ProFormText
            label={'发证机构'}
            name="agency"
            rules={[
              {
                required: true,
                message: '发证机构不能为空',
              },
            ]}
            placeholder={'请输入发证机构'}
          />
          <ProFormDatePicker
            name="cert_data"
            label="发证日期"
            placeholder={'请选择发证日期'}
            rules={[{ required: true, message: '请选择发证日期' }]}
          />
          <ProFormDatePicker name="use_date_end" label="有效日期(止)" placeholder={'请选择有效日期(止)'} />
          <ProFormDatePicker name="annual_date" label="年检日期" placeholder={'请选择年检日期'} />
          <ProFormTextArea
            label="备注"
            name="remark"
            colProps={{
              span: 24,
            }}
          />
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
      <ModalForm<{ cert_type: number }>
        formRef={downModalFormRef}
        modalProps={{ centered: true, confirmLoading, maskClosable: false }}
        title={'证书下载'}
        width="400px"
        visible={downVisible}
        onVisibleChange={setDownVisible}
        onFinish={onDownFinish}
        className={styles.modalCon}
      >
        <ProFormSelect
          name="cert_type"
          label="证书类型"
          placeholder={'请选择证书类型'}
          rules={[{ required: true, message: '请选择证书类型' }]}
          options={companyCertificatetTypes.map(item => ({ label: item.name, value: item.id }))}
        />
      </ModalForm>
    </PageContainer>
  );
};

export default CompanyCertificateList;
