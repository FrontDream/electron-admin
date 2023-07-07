import { Button, message, Modal, Upload, UploadProps } from 'antd';
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
import { CertificatePersonItem, isSuccess, CertificatetPersonData, TableListPagination, downLoad } from '@/utils';
import {
  getCertificatePersonListApi,
  addCertificatePersonApi,
  deleteCertificatePersonApi,
  updateCertificatePersonApi,
  importPersonValidateExcelApi,
  importPersonFromExcelApi,
  downPersonListApi,
} from '@/services';
import moment from 'moment';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import styles from './index.less';
import { jobStatusMap } from '@/utils';

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
      title: '人员编号',
      dataIndex: 'id_no',
      copyable: true,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      render: (_, record) => [
        <a key={'name'} onClick={() => history.push(`/certificate/person/${record.id}`)}>
          {record.name}
        </a>,
      ],
    },
    {
      title: '身份证号',
      dataIndex: 'id_number',
      copyable: true,
      width: 200,
    },
    {
      title: '证件失效时间',
      dataIndex: 'expire_time',
      hideInSearch: true,
    },
    {
      title: '在职状态',
      dataIndex: 'job_status',
      hideInSearch: true,
      renderText: val => {
        return jobStatusMap[val] || '-';
      },
    },
    {
      title: '人员归属',
      dataIndex: 'person_belong',
      hideInSearch: true,
    },
    {
      title: '注册单位',
      dataIndex: 'company',
      hideInSearch: true,
    },
    {
      title: '合同所属公司',
      dataIndex: 'contract',
      hideInSearch: true,
    },
    {
      title: '闽政通所在单位',
      dataIndex: 'mzt',
      hideInSearch: true,
    },
    {
      title: '社保所在公司',
      dataIndex: 'social_security',
      hideInSearch: true,
    },
    {
      title: '医保所在公司',
      dataIndex: 'medical_insurance',
      hideInSearch: true,
    },
    {
      title: '住房公积金所在公司',
      dataIndex: 'prov_fund_company',
      hideInSearch: true,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      hideInSearch: true,
      renderText: val => (val === 1 ? '男' : '女'),
    },
    {
      title: '家庭住址',
      dataIndex: 'address',
      hideInSearch: true,
    },
    {
      title: '联系方式',
      dataIndex: 'phone',
      hideInSearch: true,
    },
    {
      title: '入职日期',
      dataIndex: 'entry_time',
      hideInSearch: true,
    },
    {
      title: '离职时间',
      dataIndex: 'resign_time',
      hideInSearch: true,
    },
    {
      title: '项目备案名称',
      dataIndex: 'project_record_name',
      hideInSearch: true,
    },
    {
      title: '项目备案职务',
      dataIndex: 'project_record_job',
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

  const uploadExcelProps: UploadProps = {
    name: 'file',
    customRequest: async ({ file }) => {
      const formData = new FormData();

      formData.append('filename', file as any);
      try {
        const validateRes = await importPersonValidateExcelApi({ file: formData });

        if (isSuccess(validateRes, '上传失败，请重试')) {
          const { data = { is_exist: false } } = validateRes;
          const updateExcel = async () => {
            try {
              const uploadRes = await importPersonFromExcelApi({ file: formData });

              if (isSuccess(uploadRes, '上传失败，请重试')) {
                message.success('上传成功');
                actionRef.current?.reload();
              }
            } catch (error) {
              console.log('error:', error);
            }
          };

          if (data.is_exist) {
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

  const handleDown = async () => {
    try {
      const res = await downPersonListApi();

      if (isSuccess(res)) {
        const { url } = res?.data;
        const day = moment().format('YYYY-MM-DD HH:mm:ss');

        downLoad(url, `${day}人员台账.xlsx`);
        message.success('下载成功');
      }
    } catch (e) {
      console.log('error:', e);
    }
  };

  return (
    <PageContainer>
      <ProTable<CertificatePersonItem, TableListPagination>
        scroll={{ x: 4000 }}
        headerTitle="人员列表"
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
            key="add"
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
          persistenceKey: 'certificatetPersonList',
          persistenceType: 'localStorage',
        }}
      />

      {modalVisible && (
        <ModalForm<CertificatetPersonData>
          formRef={modalFormRef}
          modalProps={{ centered: true, confirmLoading, maskClosable: false }}
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
          <ProFormText label={'人员编号'} name="id_no" placeholder={'请输入人员编号'} />
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
          <ProFormText
            label={'身份证号'}
            name="id_number"
            rules={[
              {
                required: true,
                message: '证件号不能为空',
              },
            ]}
            placeholder={'请输入证件号'}
          />
          <ProFormDatePicker name="expire_time" label="证件失效日期" placeholder={'请选择证书失效日期'} />
          <ProFormSelect
            name="job_status"
            label="在职状态"
            placeholder={'请选择在职状态'}
            options={[
              { label: '在职', value: 1 },
              { label: '离职', value: 2 },
              { label: '兼职', value: 3 },
            ]}
          />
          <ProFormText label={'人员归属'} name="person_belong" placeholder={'请输入人员归属'} />
          <ProFormText label={'注册单位'} name="company" placeholder={'请输入注册单位'} />
          <ProFormText label={'合同所属公司'} name="contract" placeholder={'请输入合同所属公司'} />
          <ProFormText label={'闽政通所在单位'} name="mzt" placeholder={'请输入闽政通所在单位'} />
          <ProFormText label={'社保所在公司'} name="social_security" placeholder={'请输入社保所在公司'} />
          <ProFormText label={'医保所在公司'} name="medical_insurance" placeholder={'请输入医保所在公司'} />
          <ProFormText label={'住房公积金所在公司'} name="prov_fund_company" placeholder={'请输入住房公积金所在公司'} />
          <ProFormSelect
            name="gender"
            label="性别"
            placeholder={'请选择性别'}
            options={[
              { label: '男', value: 1 },
              { label: '女', value: 2 },
            ]}
          />
          <ProFormText label={'家庭住址'} name="address" placeholder={'请输入家庭住址'} />
          <ProFormDigit
            name="phone"
            label="联系方式"
            placeholder={'请输入联系方式'}
            rules={[
              {
                pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
                message: '请输入联系方式',
              },
            ]}
            fieldProps={{ controls: false }}
          />
          <ProFormDatePicker name="entry_time" label="入职日期" placeholder={'请选择入职日期'} />
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
          <ProFormText label={'项目备案名称'} name="project_record_name" placeholder={'请输入项目备案名称'} />
          <ProFormText label={'项目备案职务'} name="project_record_job" placeholder={'请输入项目备案职务'} />
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
