import { Button, message, Modal, Typography, Col, Row } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { ModalForm, ProFormText, FormInstance } from '@ant-design/pro-form';
import { CustomsListItem, isSuccess, SecretListItem, CustomsData, TableListPagination } from '@/utils';
import { getCustomsListApi, addCustomsApi, updateCustomApi } from '@/services';
import moment from 'moment';

const { Paragraph } = Typography;

const CustomsList: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [secretVisible, setSecretVisible] = useState<boolean>(false);
  const [secretList, setSecretList] = useState<Array<SecretListItem>>([]);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<CustomsListItem>();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isDdd, setIsDdd] = useState(true);
  const modalFormRef = useRef<FormInstance>();

  const columns: ProColumns<CustomsListItem>[] = [
    {
      title: '客户名称',
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
        <a
          key="keys"
          onClick={() => {
            setSecretList(record.secret_list);
            setSecretVisible(true);
          }}
        >
          秘钥
        </a>,
      ],
    },
  ];

  const onFinish = async (value: CustomsData) => {
    const { name } = value;

    try {
      setConfirmLoading(true);
      let res = {};

      if (isDdd) {
        res = await addCustomsApi({ name });
      } else {
        res = await updateCustomApi({ name, id: currentRow?.id || 0 });
      }

      if (isSuccess(res, `${isDdd ? '新增' : '修改'}客户失败，请重试！`)) {
        message.success(`${isDdd ? '新增' : '修改'}客户成功`);
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
  const handleCancel = () => {
    setSecretVisible(false);
  };

  return (
    <PageContainer>
      <ProTable<CustomsListItem, TableListPagination>
        headerTitle="客户列表"
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
        request={getCustomsListApi}
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
          persistenceKey: 'customs',
          persistenceType: 'localStorage',
        }}
      />
      {modalVisible && (
        <ModalForm<CustomsData>
          formRef={modalFormRef}
          modalProps={{ centered: true, confirmLoading }}
          title={isDdd ? '新建客户' : '修改客户'}
          width="400px"
          visible={modalVisible}
          onVisibleChange={setModalVisible}
          onFinish={onFinish}
          initialValues={isDdd ? {} : { ...currentRow }}
        >
          <ProFormText
            label={'客户名称'}
            rules={[
              {
                required: true,
                message: '客户名称不能为空',
              },
            ]}
            name="name"
          />
        </ModalForm>
      )}
      <Modal title="秘钥详情" open={secretVisible} onOk={handleCancel} onCancel={handleCancel}>
        {secretList.map((item, index) => {
          return (
            <Row key={item.md5}>
              <Col span={7}>秘钥时长: {index === 4 ? '永久' : `${item.validity}天`} </Col>
              <Col span={17} style={{ display: 'flex' }}>
                秘钥：<Paragraph copyable>{item.md5}</Paragraph>
              </Col>
            </Row>
          );
        })}
      </Modal>
    </PageContainer>
  );
};

export default CustomsList;
