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
  const [persons, setPersons] = useState<Array<any>>([]);
  // 右侧元数据
  const [rightOptions, setRightOptions] = useState<Array<any>>([]);

  const { loading: userDocPermissionLoading } = useRequest(
    async () => {
      if (focusItem && focusItem.id) {
        const data = await getUserDocPermissionApi({
          doc_id: focusItem!.id,
        });

        setCheckedKeys(data.map(item => item.user_id));
        setRightOptions(data.map(item => ({ ...item, key: item.user_id })));
      }
    },
    { refreshDeps: [] },
  );

  const { data: docUser = [] as DataNode[], loading: departmentUserLoading } = useRequest(
    async () => {
      const data = await getDepartmentUserApi();
      const persons = [];

      data.map(department => {
        const children = department.children.map(item => ({
          ...item,
          can_view: true,
          can_create: true,
          can_update: true,
          can_destroy: true,
          can_authorize: true,
        }));

        persons.push(...children);
      });

      setPersons(persons);

      console.log('data:', data);

      return { data };
    },
    { refreshDeps: [] },
  );

  const handleConfirmPermission = async () => {
    try {
      setPermissionConfirmLoading(true);
      const doc_permission_list = rightOptions.map(item => {
        const { key, title, ...rest } = item;

        return { ...rest, user_id: key };
      });
      const res = await uploadPermissionApi({
        doc_id: focusItem!.id,
        doc_type: focusItem!.type,
        doc_permission_list,
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
    const updateRightOptions = persons
      .filter(item => checkedKeysValue.includes(item.key))
      .map(item => {
        const alreadyRightOption = rightOptions.find(option => option.key === item.key);

        if (alreadyRightOption) {
          return { ...alreadyRightOption };
        }
        return { ...item };
      });

    setRightOptions([...updateRightOptions]);
  };

  const onChange = (val: boolean, option: any, key: string) => {
    const updateRightOptions = rightOptions.map(item => {
      if (item.key === option.key) {
        return { ...item, [key]: val };
      }
      return { ...item };
    });

    setRightOptions(updateRightOptions);
  };

  console.log('persons:', persons);
  console.log('rightOptions:', rightOptions);

  return (
    <Modal
      centered
      confirmLoading={permissionConfirmLoading}
      title={'权限设定'}
      width="800px"
      open={visible}
      onOk={handleConfirmPermission}
      onCancel={onCancel}
    >
      <Row>
        <Col span={8}>
          <Card title={'部门人员'} bordered={false} loading={userDocPermissionLoading || departmentUserLoading}>
            <Tree checkable defaultExpandAll={true} checkedKeys={checkedKeys} onCheck={onCheck} treeData={docUser} />
          </Card>
        </Col>
        <Col span={16}>
          <Card title={'功能权限'} bordered={false} loading={userDocPermissionLoading || departmentUserLoading}>
            {rightOptions.map(option => {
              return (
                <div key={option.key} style={{ marginTop: '12px' }}>
                  <Checkbox checked={true} disabled>
                    {option.title}
                  </Checkbox>
                  <Row style={{ paddingLeft: '12px', marginTop: '12px' }}>
                    <Col span={6} key={'new'}>
                      <Checkbox
                        checked={option.can_create}
                        onChange={(e: CheckboxChangeEvent) => onChange(e.target.checked, option, 'can_create')}
                      >
                        {'新建文件夹'}
                      </Checkbox>
                    </Col>
                    <Col span={6} key={'reName'}>
                      <Checkbox
                        checked={option.can_update}
                        onChange={(e: CheckboxChangeEvent) => onChange(e.target.checked, option, 'can_update')}
                      >
                        {'重命名'}
                      </Checkbox>
                    </Col>
                    <Col span={6} key={'delete'}>
                      <Checkbox
                        checked={option.can_destroy}
                        onChange={(e: CheckboxChangeEvent) => onChange(e.target.checked, option, 'can_destroy')}
                      >
                        {'(批量)删除'}
                      </Checkbox>
                    </Col>
                    <Col span={6} key={'authorize'}>
                      <Checkbox
                        checked={option.can_authorize}
                        onChange={(e: CheckboxChangeEvent) => onChange(e.target.checked, option, 'can_authorize')}
                      >
                        {'向下授权'}
                      </Checkbox>
                    </Col>
                  </Row>
                </div>
              );
            })}
          </Card>
        </Col>
      </Row>
    </Modal>
  );
};

export default PermissionModal;
