import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { RecordListItem, TableListPagination, useUserEnum, downLoad } from '@/utils';
import { getRecordListApi, downRecordListApi } from '@/services';
import moment from 'moment';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

const RecordList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<any>();

  const userEnum = useUserEnum();
  const handleDown = async () => {
    const res = await formRef.current?.validateFieldsReturnFormatValue();
    const downRes = await downRecordListApi(res);

    await downLoad(downRes.url, '日志记录.xlsx');
  };

  const columns: ProColumns<RecordListItem>[] = [
    {
      title: '详情',
      dataIndex: 'username',
      hideInSearch: true,
      renderText: (_, record: RecordListItem) => {
        const { user, create_at, action, task, content } = record;
        const time = moment(create_at).format('YYYY-MM-DD HH:mm:ss');
        const contentInfo = content.name ? `: ${content.name}` : '';

        return `${user.username}在${time}，${action.name}${task.name}${contentInfo}`;
      },
    },
    {
      title: '用户名',
      dataIndex: 'user_id',
      hideInTable: true,
      valueEnum: userEnum,
    },
    {
      title: '操作时间',
      dataIndex: 'times',
      valueType: 'dateTimeRange',
      hideInTable: true,
      search: {
        transform: value => {
          return {
            start_date: value[0],
            end_date: value[1],
          };
        },
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable<RecordListItem, TableListPagination>
        headerTitle="日志明细"
        actionRef={actionRef}
        formRef={formRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        request={getRecordListApi}
        columns={columns}
        pagination={{ pageSize: 10 }}
        columnsState={{
          persistenceKey: 'recordList',
          persistenceType: 'localStorage',
        }}
        toolBarRender={() => [
          <Button key="button" icon={<DownloadOutlined />} onClick={handleDown} type="primary">
            下载
          </Button>,
        ]}
      />
    </PageContainer>
  );
};

export default RecordList;
