import { PlusOutlined, HomeOutlined, ContactsOutlined, ClusterOutlined } from '@ant-design/icons';
import { Avatar, Card, Col, Divider, Input, Row, Tree } from 'antd';
import React, { useState, useRef } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { useRequest } from 'umi';
import { DataNode, DirectoryTreeProps } from 'antd/es/tree';

import styles from './index.less';
import { getDocumentListApi } from '@/services';

const { DirectoryTree } = Tree;

const DocumentManagement = () => {
  const { data: treeData = [{ title: '', key: '0', children: [] }], loading } = useRequest(async () => {
    const res = await getDocumentListApi({
      parent_id: 0,
    });

    const children = res.map(item => ({ title: item.name, key: item.id, isLeaf: item.type === 2 }));

    const data = [
      {
        title: 'parent 0',
        key: '0-0',
        children,
      },
    ];

    return { data };
  });

  const onSelect: DirectoryTreeProps['onSelect'] = (keys, info) => {
    console.log('Trigger Select', keys, info);
  };

  const onExpand: DirectoryTreeProps['onExpand'] = (keys, info) => {
    console.log('Trigger Expand', keys, info);
  };

  console.log('documents:', treeData);

  return (
    <GridContent>
      <Row gutter={24}>
        <Col lg={7} md={24}>
          <Card bordered={false} style={{ marginBottom: 24 }} loading={loading} title="文件列表">
            <DirectoryTree multiple defaultExpandAll onSelect={onSelect} onExpand={onExpand} treeData={treeData} />
          </Card>
        </Col>
        <Col lg={17} md={24}>
          <Card className={styles.tabsCard} bordered={false} title="文件详情">
            22
          </Card>
        </Col>
      </Row>
    </GridContent>
  );
};

export default DocumentManagement;
