import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { RecordListItem, TableListPagination, useUserEnum } from '@/utils';
import { getRecordListApi } from '@/services';
import moment from 'moment';

const RecordList: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const userEnum = useUserEnum();

  const columns: ProColumns<RecordListItem>[] = [
    {
      title: '详情',
      dataIndex: 'username',
      hideInSearch: true,
      renderText: (_, record: RecordListItem) => {
        const { user, create_at, action, task, content } = record;
        const time = moment(create_at).format('YYYY-MM-DD HH:mm:ss');
        const contentInfo = content.name ? `: ${content.name}` : '';

        return `${user.username}于${time}，${action.name}${task.name}${contentInfo}`;
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
      />
    </PageContainer>
  );
};

export default RecordList;
