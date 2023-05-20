import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Card, Descriptions, Button, UploadProps, Modal, message, Drawer, Spin } from 'antd';
import { useRequest } from 'umi';
import { useState, useRef } from 'react';
import type { RangePickerProps } from 'antd/es/date-picker';
import { useParams } from 'react-router-dom';
import {
  getCertificatePersonDetailApi,
  getCertificateListApi,
  updateCertificateApi,
  addCertificateApi,
  deleteCertificateApi,
} from '@/services';
import { ExclamationCircleFilled } from '@ant-design/icons';
import moment from 'moment';
import {
  CertificateItem,
  TableListPagination,
  AppendixList,
  useCertificatetTypes,
  listToEnum,
  CertificateData,
  isSuccess,
  uploadFiles,
  useCertificatetPersons,
  downLoad,
} from '@/utils';
import {
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormDatePicker,
  FormInstance,
  ProFormDependency,
  ProFormUploadDragger,
} from '@ant-design/pro-form';
import { ProDescriptions, ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import styles from './index.less';

import create from 'zustand';

const useStore = create(set => ({
  fileList: [] as AppendixList[],
  addFileList: list => set(state => ({ fileList: list })),
}));

const { confirm } = Modal;

const CertificatePersonDetail = () => {
  const { id = '' } = useParams<{ id: string }>();
  const certificatetTypes = useCertificatetTypes();
  const certificateTypeEnum = listToEnum(certificatetTypes);
  const actionRef = useRef<ActionType>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [isDdd, setIsDdd] = useState(true);
  const certificatetPersons = useCertificatetPersons();
  const certificatePersonEnum = listToEnum(certificatetPersons);

  const tableColumns: ProColumns<CertificateItem>[] = [
    {
      title: '证书编号',
      dataIndex: 'cert_code',
      copyable: true,
    },
    {
      title: '证书人员',
      dataIndex: 'cert_id',
      hideInSearch: true,
      valueType: 'select',
      valueEnum: certificatePersonEnum,
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
            const { appendix_list = [] } = record;

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

  const [currentRow, setCurrentRow] = useState<CertificateItem>();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const modalFormRef = useRef<FormInstance>();

  // const [fileList, setFileList] = useState<AppendixList[]>([]);
  const fileList = useStore(state => state.fileList);
  const setFileList = useStore(state => state.addFileList);
  const descriptionColumns: ProDescriptionsItemProps<CertificateItem>[] = [
    {
      title: '证书编号',
      dataIndex: 'cert_code',
      copyable: true,
    },
    {
      title: '证书人员',
      dataIndex: 'cert_id',
    },
    {
      title: '岗位类别',
      dataIndex: 'category',
    },
    {
      title: '专业',
      dataIndex: 'major',
    },
    {
      title: '发证日期',
      dataIndex: 'cert_data',
    },
    {
      title: '失效日期',
      dataIndex: 'expire_time',
    },
    {
      title: '代码标注',
      dataIndex: 'code_label',
      renderText: (val: number) => (val === 1 ? '是' : '否'),
    },
    {
      title: '失效提示时间',
      dataIndex: 'reminder_time',
    },
    {
      title: '证书类型',
      dataIndex: 'type',
      valueEnum: certificateTypeEnum,
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
  const { data: personData, loading: personDetailLoading } = useRequest(
    async () => {
      const data = await getCertificatePersonDetailApi(Number(id));

      return { data };
    },
    { refreshDeps: [id] },
  );

  const onFinish = async (values: CertificateData) => {
    try {
      if (uploading) {
        message.warning('正在上传，请上传后重试!');
        return;
      }
      setConfirmLoading(true);
      let res = {};

      if (isDdd) {
        res = await addCertificateApi({ ...values, appendix_list: fileList });
      } else {
        res = await updateCertificateApi({ ...values, id: currentRow?.id || 0, appendix_list: fileList });
      }

      if (isSuccess(res, `${isDdd ? '新增' : '修改'}证书失败，请重试！`)) {
        message.success(`${isDdd ? '新增' : '修改'}证书成功`);
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

    confirm({
      title: '确定删除该证书吗?',
      icon: <ExclamationCircleFilled />,
      content: '证书删除后，无法恢复！请谨慎删除！',
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
      <Card bordered={false} title={'人员详情'} loading={personDetailLoading}>
        <Descriptions style={{ marginBottom: 32 }}>
          <Descriptions.Item label="姓名">{personData?.name}</Descriptions.Item>
          <Descriptions.Item label="性别">{personData?.gender === 1 ? '男' : '女'}</Descriptions.Item>
          <Descriptions.Item label="证件号码">{personData?.id_number}</Descriptions.Item>
          <Descriptions.Item label="证件失效日期">{personData?.expire_time}</Descriptions.Item>
          <Descriptions.Item label="学历">{personData?.edu_background_name}</Descriptions.Item>
          <Descriptions.Item label="联系号码">{personData?.phone}</Descriptions.Item>
          <Descriptions.Item label="入职时间">{personData?.entry_time}</Descriptions.Item>
          <Descriptions.Item label="是否离职">{personData?.job_status === 1 ? '离职' : '在职'}</Descriptions.Item>
          {personData?.job_status === 1 && (
            <Descriptions.Item label="离职时间">{personData?.resign_time || '-'}</Descriptions.Item>
          )}
          <Descriptions.Item label="所属公司">{personData?.company}</Descriptions.Item>
          <Descriptions.Item label="合同所属公司">{personData?.contract || '-'}</Descriptions.Item>
          <Descriptions.Item label="闽政通所属公司">{personData?.mzt || '-'}</Descriptions.Item>
          <Descriptions.Item label="医保所属公司">{personData?.medical_insurance || '-'}</Descriptions.Item>
          <Descriptions.Item label="社保所属公司">{personData?.social_security || '-'}</Descriptions.Item>
          <Descriptions.Item label="公积金所属公司">{personData?.prov_fund_company || '-'}</Descriptions.Item>
          <Descriptions.Item label="继续教育情况">{personData?.continuing_edu || '-'}</Descriptions.Item>
          <Descriptions.Item label="创建人">{personData?.create_user}</Descriptions.Item>
          <Descriptions.Item label="修改人">{personData?.update_user}</Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {moment.unix(personData?.ctime || 0).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
          <Descriptions.Item label="修改时间">
            {moment.unix(personData?.mtime || 0).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
          <Descriptions.Item label="备注">{personData?.remark || '-'}</Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title={'证书详情'} bordered={false}>
        <ProTable<CertificateItem, TableListPagination>
          actionRef={actionRef}
          rowKey="id"
          search={{
            labelWidth: 120,
          }}
          params={{ cert_id: id }}
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
            persistenceKey: 'certificatePersonDetail',
            persistenceType: 'localStorage',
          }}
        />
      </Card>

      {modalVisible && (
        <ModalForm<CertificateData>
          formRef={modalFormRef}
          modalProps={{ centered: true, confirmLoading }}
          title={isDdd ? '新建证书' : '修改证书'}
          width="600px"
          visible={modalVisible}
          onVisibleChange={setModalVisible}
          onFinish={onFinish}
          initialValues={
            isDdd
              ? {
                  cert_id: Number(id),
                }
              : { ...currentRow }
          }
          grid
          colProps={{
            span: 8,
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
          <ProFormSelect
            name="cert_id"
            label="证书人员"
            disabled
            placeholder={'请选择证书人员'}
            rules={[{ required: true, message: '请选择证书人员' }]}
            options={certificatetPersons.map(item => ({ label: item.name, value: item.id }))}
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
              const month = moment(expire_time).subtract(3, 'months');
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

export default CertificatePersonDetail;
