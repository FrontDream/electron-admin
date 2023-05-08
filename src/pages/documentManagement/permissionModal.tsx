import { Modal, message, Tree, Card, Col, Row, Checkbox } from 'antd';
import React, { useState } from 'react';
import type { DataNode, TreeProps } from 'antd/es/tree';
import { getUserDocPermissionApi, getDepartmentUserApi, uploadPermissionApi } from '@/services';
import { useRequest } from 'umi';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
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
  const [canAuthorize, setCanAuthorize] = useState(false);

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
        can_authorize: canAuthorize,
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

  const onChange = (e: CheckboxChangeEvent) => {
    setCanAuthorize(e.target.checked);
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
      <Row>
        <Col span={12}>
          <Card bordered={false} loading={userDocPermissionLoading || departmentUserLoading}>
            <Tree checkable defaultExpandAll={true} checkedKeys={checkedKeys} onCheck={onCheck} treeData={docUser} />
          </Card>
        </Col>
        <Col span={12}>
          <Checkbox checked={canAuthorize} onChange={onChange}>
            是否允许被授予人有权限向其他人授权
          </Checkbox>
        </Col>
      </Row>
    </Modal>
  );
};

export default PermissionModal;
