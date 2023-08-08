import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { DurationListItem, TableListPagination, useUserEnum } from '@/utils';
import { getDurationListApi } from '@/services';

const DurationList: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const userEnum = useUserEnum();

  const columns: ProColumns<DurationListItem>[] = [
    {
      title: '用户名',
      dataIndex: 'username',
      hideInSearch: true,
    },
    {
      title: '用户名',
      dataIndex: 'user_id',
      valueEnum: userEnum,
      hideInTable: true,
    },
    {
      title: '工号',
      dataIndex: 'job_number',
      hideInSearch: true,
    },
    {
      title: '登录时间',
      dataIndex: 'last_time',
      hideInSearch: true,
    },
    {
      title: '截止时间',
      dataIndex: 'now_time',
      hideInSearch: true,
    },
    {
      title: '在线时长',
      dataIndex: 'duration',
      hideInSearch: true,
      renderText: result => {
        const h = Math.floor((result / 3600) % 24);
        const m = Math.floor((result / 60) % 60);

        if (h < 1) {
          return (result = m + '分钟');
        }
        return (result = h + '小时' + m + '分钟');
      },
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
        pagination={{ defaultPageSize: 10 }}
        columnsState={{
          persistenceKey: 'durationList',
          persistenceType: 'localStorage',
        }}
      />
    </PageContainer>
  );
};

export default DurationList;
