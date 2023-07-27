import { Button, message, Modal, Drawer, Card, UploadProps, Spin, Upload } from 'antd';
import { useState, useRef, useMemo } from 'react';
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
  ProFormTextArea,
} from '@ant-design/pro-form';
import { ProDescriptions, ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import {
  CertificateItem,
  isSuccess,
  CertificateData,
  TableListPagination,
  listToEnum,
  useCertificatetTypes,
  uploadFiles,
  AppendixList,
  downLoad,
  educationOptions,
  jobTitleOptions,
  techOptions,
  techCategoryOptions,
  thirdCategoryOptions,
  thirdGradeOptions,
  jobCategoryOptions,
  registryGradeOptions,
  registryJobCategory,
} from '@/utils';
import {
  getCertificateListApi,
  addCertificateApi,
  deleteCertificateApi,
  updateCertificateApi,
  importFromExcelApi,
  importValidateExcelApi,
  downCertificateListApi,
  getCertificatePersonListApi,
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

interface IProps {
  from: 'certificatePersonDetail' | 'certificateList';
  id?: string;
}

const Certificate = (props: IProps) => {
  const { from, id } = props;
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [downVisible, setDownVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<CertificateItem>();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [isDdd, setIsDdd] = useState(true);
  const modalFormRef = useRef<FormInstance>();
  const downModalFormRef = useRef<FormInstance>();
  // const [fileList, setFileList] = useState<AppendixList[]>([]);
  const fileList = useStore(state => state.fileList);
  const setFileList = useStore(state => state.addFileList);
  const certificatetTypes = useCertificatetTypes();
  const certificateTypeEnum = listToEnum(certificatetTypes);
  const isDetail = useMemo(() => {
    return from === 'certificatePersonDetail';
  }, [from]);
  const descriptionColumns: ProDescriptionsItemProps<CertificateItem>[] = [
    {
      title: '证书类型',
      dataIndex: 'type',
      valueEnum: certificateTypeEnum,
    },
    {
      title: '证书编号',
      dataIndex: 'cert_code',
      copyable: true,
    },
    {
      title: '证书人员',
      dataIndex: 'username',
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
      title: '证书等级',
      dataIndex: 'grade',
    },
    {
      title: '发证机构',
      dataIndex: 'agency',
    },
    {
      title: '职称批准文号',
      dataIndex: 'job_title_no',
    },
    {
      title: '发证日期',
      dataIndex: 'cert_data',
    },
    {
      title: '复检日期',
      dataIndex: 'check_date',
    },
    {
      title: '证书有效期(起)',
      dataIndex: 'use_date_start',
    },
    {
      title: '证书有效期(止)',
      dataIndex: 'use_date_end',
    },
    {
      title: '签名有效期范围',
      dataIndex: 'sign_start',
      renderText: (val: string, record: CertificateItem) =>
        record?.sign_start && record.sign_end ? `${record?.sign_start}至${record?.sign_end}` : '-',
    },
    {
      title: '证书继续教育时间',
      dataIndex: 'continue_date',
      renderText: (val: string, record: CertificateItem) => record?.continue_date || '-',
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
      title: '证书类型',
      dataIndex: 'type',
      valueType: 'select',
      valueEnum: certificateTypeEnum,
    },
    {
      title: '证书编号',
      dataIndex: 'cert_code',
      copyable: true,
    },
    {
      title: '证书人员',
      dataIndex: 'username',
    },
    {
      title: '身份证号',
      dataIndex: 'id_number',
      hideInTable: true,
    },
    {
      title: '闽政通所属公司',
      dataIndex: 'mzt',
      hideInTable: true,
    },
    {
      title: ' 社保所属公司',
      dataIndex: 'social_security',
      hideInTable: true,
    },
    {
      title: '岗位类别',
      dataIndex: 'category',
      hideInSearch: true,
    },
    {
      title: '证书等级',
      dataIndex: 'grade',
      hideInSearch: true,
    },
    {
      title: '专业',
      dataIndex: 'major',
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
            const { appendix_list = [], sign_start, sign_end } = record;

            setModalVisible(true);
            setCurrentRow({ ...record, sign_date: sign_start && sign_end ? [sign_start, sign_end] : [] });
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
    const { sign_date = [], ...rest } = values;
    let body = { ...rest, appendix_list: fileList };

    try {
      if (uploading) {
        message.warning('正在上传，请上传后重试!');
        return;
      }
      setConfirmLoading(true);
      let res = {};

      if (sign_date && sign_date?.length > 0) {
        body = { ...body, sign_start: sign_date[0], sign_end: sign_date[1] };
      }

      if (isDdd) {
        res = await addCertificateApi({ ...body });
      } else {
        res = await updateCertificateApi({ ...body, id: currentRow?.id || 0 });
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
  const getShowFields = (typeName: string) => {
    let showFields,
      requiredFields,
      gradeOptions: Array<string> = [],
      categoryOptions: Array<string> = [];

    if (typeName === '注册证') {
      showFields = [
        'category',
        'grade',
        'major',
        'agency',
        'cert_data',
        'use_date_start',
        'use_date_end',
        'continue_date',
        'sign_date',
      ];
      requiredFields = ['category', 'major'];
      gradeOptions = registryGradeOptions;
      categoryOptions = registryJobCategory;
    } else if (typeName === '职称证') {
      showFields = ['grade', 'major', 'job_title_no', 'agency', 'cert_data'];
      requiredFields = ['grade'];
      gradeOptions = jobTitleOptions;
    } else if (typeName === '毕业证') {
      showFields = ['grade', 'agency', 'major', 'cert_data'];
      requiredFields = ['grade'];
      gradeOptions = educationOptions;
    } else if (typeName === '三类证') {
      showFields = ['category', 'grade', 'agency', 'cert_data', 'use_date_end'];
      requiredFields = ['category', 'grade'];
      categoryOptions = thirdCategoryOptions;
      gradeOptions = thirdGradeOptions;
    } else if (typeName === '岗位证') {
      showFields = ['category', 'major', 'agency', 'cert_data', 'use_date_end'];
      requiredFields = ['category', 'major'];
      categoryOptions = jobCategoryOptions;
    } else if (typeName === '技工证') {
      showFields = ['category', 'grade', 'major', 'agency', 'cert_data', 'use_date_end', 'check_date'];
      requiredFields = ['category', 'major'];
      gradeOptions = techOptions;
      categoryOptions = techCategoryOptions;
    }
    return {
      showFields,
      requiredFields,
      gradeOptions,
      categoryOptions,
    };
  };

  const uploadExcelProps: UploadProps = {
    name: 'file',
    customRequest: async ({ file }) => {
      const formData = new FormData();

      formData.append('filename', file as any);
      try {
        const validateRes = await importValidateExcelApi({ file: formData });

        if (isSuccess(validateRes, '导入失败，请重试')) {
          const { data = {} } = validateRes;
          const updateExcel = async () => {
            try {
              const uploadRes = await importFromExcelApi({ file: formData });

              if (isSuccess(uploadRes, '导入失败，请重试')) {
                message.success('导入成功');
                actionRef.current?.reload();
              }
            } catch (error) {
              console.log('error:', error);
            }
          };

          if (data.has_new_person) {
            Modal.error({
              title: '证书中存在新人员，请先完善人员！',
              content: `涉及的人员身份证号号:${data?.id_list?.join(',')}`,
            });
            return;
          }
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

  const handleDown = () => {
    setDownVisible(true);
  };

  const onDownFinish = async (values: { cert_type: number }) => {
    const { cert_type } = values;

    try {
      const res = await downCertificateListApi({ cert_type });

      if (isSuccess(res)) {
        const { url } = res?.data;
        const day = moment().format('YYYY-MM-DD HH:mm:ss');
        let name = `${day}_台账.xlsx`;

        if (cert_type in certificateTypeEnum) {
          name = `${day}_${certificateTypeEnum[cert_type].text}类台账.xlsx`;
        }

        downLoad(url, name);
        message.success('下载成功');
      }
    } catch (e) {
      console.log('error:', e);
    }
  };

  return (
    <>
      <ProTable<CertificateItem, TableListPagination>
        scroll={{ x: 2000 }}
        headerTitle="证书列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        params={isDetail ? { cert_id: id } : {}}
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
              setFileList([]);
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
          persistenceKey: from,
          persistenceType: 'localStorage',
        }}
      />

      {modalVisible && (
        <ModalForm<CertificateData>
          formRef={modalFormRef}
          modalProps={{ centered: true, confirmLoading, maskClosable: false }}
          title={isDdd ? '新建证书' : '修改证书'}
          width="800px"
          visible={modalVisible}
          onVisibleChange={setModalVisible}
          onFinish={onFinish}
          initialValues={
            isDdd
              ? isDetail
                ? {
                    cert_id: Number(id),
                  }
                : {}
              : { ...currentRow }
          }
          grid
          colProps={{
            span: 6,
          }}
          className={styles.modalCon}
        >
          <ProFormSelect
            name="type"
            label="证书类型"
            placeholder={'请选择证书类型'}
            rules={[{ required: true, message: '请选择证书类型' }]}
            options={certificatetTypes.map(item => ({ label: item.name, value: item.id }))}
          />
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
            disabled={isDetail}
            name="cert_id"
            label="证书人员"
            placeholder={'请选择证书人员'}
            rules={[{ required: true, message: '请选择证书人员' }]}
            showSearch
            debounceTime={300}
            request={async ({ keyWords }) => {
              const res = await getCertificatePersonListApi({
                current: 1,
                pageSize: 20,
                name: keyWords,
              });
              const { data = [] } = res;

              return data.map(item => ({ label: `${item.name}${item.id_number}`, value: item.id }));
            }}
            fieldProps={{
              filterOption: () => {
                return true;
              },
            }}
            // options={certificatetPersons.map(item => ({ label: `${item.name}${item.id_number}`, value: item.id }))}
            // fieldProps={{
            //   showSearch: true,
            //   filterOption: false,
            //   onSearch: handleSearchPerson,
            //   // filterOption: (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
            // }}
          />
          <ProFormDependency name={['type']}>
            {({ type }) => {
              console.log('type:', type);
              console.log('certificatetTypes:', certificatetTypes);
              const typeItem = certificatetTypes.find(item => item.id === type) || { name: '' };
              const typeName = typeItem?.name;
              const {
                showFields = [],
                requiredFields = [],
                gradeOptions = [],
                categoryOptions,
              } = getShowFields(typeName);

              return (
                <>
                  {showFields.includes('category') ? (
                    typeName === '注册证' ? (
                      <ProFormText
                        name="category"
                        label="岗位类别"
                        placeholder={'请输入岗位类别'}
                        rules={[
                          {
                            required: requiredFields.includes('category'),
                            message: '岗位类别不能为空',
                          },
                        ]}
                      />
                    ) : (
                      <ProFormSelect
                        name="category"
                        label="岗位类别"
                        placeholder={'请输入岗位类别'}
                        rules={[
                          {
                            required: requiredFields.includes('category'),
                            message: '岗位类别不能为空',
                          },
                        ]}
                        options={categoryOptions}
                      />
                    )
                  ) : null}
                  {showFields.includes('grade') && (
                    <ProFormSelect
                      name="grade"
                      label="证书等级"
                      placeholder={'请输入证书等级'}
                      rules={[
                        {
                          required: requiredFields.includes('grade'),
                          message: '证书等级不能为空',
                        },
                      ]}
                      options={gradeOptions}
                    />
                    // <ProFormText
                    //   name="grade"
                    //   label="证书等级"
                    //   rules={[
                    //     {
                    //       required: requiredFields.includes('grade'),
                    //       message: '证书等级不能为空',
                    //     },
                    //   ]}
                    //   placeholder={'请输入证书等级'}
                    // />
                  )}
                  {showFields.includes('major') && (
                    <ProFormText
                      name="major"
                      label="证书专业"
                      rules={[
                        {
                          required: requiredFields.includes('major'),
                          message: '证书专业不能为空',
                        },
                      ]}
                      placeholder={'请输入证书专业'}
                    />
                  )}
                  {showFields.includes('job_title_no') && (
                    <ProFormText
                      name="job_title_no"
                      label="职称批准文号"
                      rules={[
                        {
                          required: requiredFields.includes('job_title_no'),
                          message: '职称批准文号不能为空',
                        },
                      ]}
                      placeholder={'请输入职称批准文号'}
                    />
                  )}
                  {showFields.includes('agency') && (
                    <ProFormText
                      name="agency"
                      label="发证机构"
                      rules={[
                        {
                          required: requiredFields.includes('agency'),
                          message: '发证机构不能为空',
                        },
                      ]}
                      placeholder={'请输入发证机构'}
                    />
                  )}
                  {showFields.includes('cert_data') && (
                    <ProFormDatePicker
                      name="cert_data"
                      label="发证时间"
                      placeholder={'请选择发证时间'}
                      rules={[{ required: requiredFields.includes('cert_data'), message: '请选择发证时间' }]}
                    />
                  )}
                  {showFields.includes('use_date_start') && (
                    <ProFormDatePicker
                      name="use_date_start"
                      label="证书有效期(起)"
                      placeholder={'请选择证书有效期(起)'}
                      rules={[{ required: requiredFields.includes('use_date_start'), message: '请选择证书有效期(起)' }]}
                    />
                  )}
                  {showFields.includes('use_date_end') && (
                    <ProFormDatePicker
                      name="use_date_end"
                      label="证书有效期(止)"
                      placeholder={'请选择证书有效期(止)'}
                      rules={[{ required: requiredFields.includes('use_date_end'), message: '请选择证书有效期(止)' }]}
                    />
                  )}
                  {showFields.includes('continue_date') && (
                    <ProFormDatePicker
                      name="continue_date"
                      label="证书继续教育时间"
                      placeholder={'请选择证书继续教育时间'}
                      rules={[{ required: requiredFields.includes('use_date_end'), message: '请选择证书继续教育时间' }]}
                    />
                  )}
                  {showFields.includes('sign_date') && (
                    <ProFormDateRangePicker
                      name="sign_date"
                      label="签名有效期范围"
                      placeholder={'请选择签名有效期范围'}
                      rules={[{ required: requiredFields.includes('sign_date'), message: '请选择签名有效期范围' }]}
                    />
                  )}
                  {showFields.includes('check_date') && (
                    <ProFormDatePicker
                      name="check_date"
                      label="复检日期"
                      placeholder={'请选择复检日期'}
                      rules={[{ required: requiredFields.includes('check_date'), message: '请选择复检日期' }]}
                    />
                  )}
                </>
              );
            }}
          </ProFormDependency>
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
          options={certificatetTypes.map(item => ({ label: item.name, value: item.id }))}
        />
      </ModalForm>
    </>
  );
};

export default Certificate;
