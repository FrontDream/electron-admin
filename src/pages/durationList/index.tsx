import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { DurationListItem, TableListPagination } from '@/utils';
import { getDurationListApi } from '@/services';

const DurationList: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<DurationListItem>[] = [
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '工号',
      dataIndex: 'job_number',
      hideInSearch: true,
    },
  ];

  return (
    <PageContainer>
      <ProTable<DurationListItem, TableListPagination>
        headerTitle="在线列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        request={getDurationListApi}
        columns={columns}
        pagination={{ pageSize: 10 }}
        columnsState={{
          persistenceKey: 'durationList',
          persistenceType: 'localStorage',
        }}
      />
    </PageContainer>
  );
};

export default DurationList;
