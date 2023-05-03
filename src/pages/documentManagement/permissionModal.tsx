import { Modal, message, Tree, Card } from 'antd';
import React, { useState } from 'react';
import type { DataNode, TreeProps } from 'antd/es/tree';
import { getUserDocPermissionApi, getDepartmentUserApi, uploadPermissionApi } from '@/services';
import { useRequest } from 'umi';
import { DocumentListItem, isSuccess } from '@/utils';

interface IProps {
  visible: boolean;
  focusItem: DocumentListItem | null | undefined;
  onCancel: () => void;
}

const PermissionModal = (props: IProps) => {
  const { visible, focusItem, onCancel } = props;
  const [permissionConfirmLoading, setPermissionConfirmLoading] = useState(false);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);

  const { loading: userDocPermissionLoading } = useRequest(
    async () => {
      if (focusItem && focusItem.id) {
        const data = await getUserDocPermissionApi({
          doc_id: focusItem!.id,
        });

        setCheckedKeys(data);
      }
    },
    { refreshDeps: [] },
  );

  const { data: docUser = [] as DataNode[], loading: departmentUserLoading } = useRequest(
    async () => {
      const data = await getDepartmentUserApi();

      return { data };
    },
    { refreshDeps: [] },
  );

  const handleConfirmPermission = async () => {
    try {
      setPermissionConfirmLoading(true);
      const res = await uploadPermissionApi({
        doc_id: focusItem!.id,
        doc_type: focusItem!.type,
        user_list: checkedKeys,
      });

      if (isSuccess(res, '授权失败，请重试')) {
        message.success('授权成功！');
        onCancel();
      }
    } catch (error) {
      console.log('error:', error);
    } finally {
      setPermissionConfirmLoading(false);
    }
  };

  const onCheck: TreeProps['onCheck'] = (checkedKeysValue: React.Key[]) => {
    setCheckedKeys(checkedKeysValue);
  };

  return (
    <Modal
      centered
      confirmLoading={permissionConfirmLoading}
      title={'权限设定'}
      width="600px"
      open={visible}
      onOk={handleConfirmPermission}
      onCancel={onCancel}
    >
      <Card bordered={false} loading={userDocPermissionLoading || departmentUserLoading}>
        <Tree checkable defaultExpandAll={true} checkedKeys={checkedKeys} onCheck={onCheck} treeData={docUser} />
      </Card>
    </Modal>
  );
};

export default PermissionModal;
