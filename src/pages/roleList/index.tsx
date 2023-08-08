import { Button, message, Modal, Row, Col, Checkbox, Tree, Spin } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { ModalForm, ProFormText, FormInstance, ProFormSelect } from '@ant-design/pro-form';
import {
  RoleManagementListItem,
  isSuccess,
  RoleData,
  TableListPagination,
  RoleTypeListItem,
  PermissionFirstLevel,
  PermissionSecondLevel,
  RoleDetail,
} from '@/utils';
import {
  getRoleManagementListApi,
  addRoleApi,
  deleteRoleApi,
  updateRoleApi,
  getRoleTypeListApi,
  getPermissionListApi,
  getRoleDetailApi,
} from '@/services';
import moment from 'moment';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import { useRequest } from 'umi';
import { ExclamationCircleFilled } from '@ant-design/icons';
import styles from './index.less';

const { warning, confirm } = Modal;

const RoleManagementList: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<RoleDetail>();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [isDdd, setIsDdd] = useState(true);
  const modalFormRef = useRef<FormInstance>();
  // 全部权限列表
  const [permissionList, setPermissionList] = useState<Array<PermissionFirstLevel>>([]);
  // 左侧选中节点
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  // 全部二级菜单
  const [secondMenus, setSecondMenus] = useState<Array<PermissionSecondLevel>>([]);
  // 右侧元数据
  const [rightOptions, setRightOptions] = useState<Array<PermissionSecondLevel>>([]);

  const { data = [] } = useRequest(async () => {
    const res = await getRoleTypeListApi({
      current: 1,
      pageSize: 999,
    });

    return { data: res.data };
  });

  useEffect(() => {
    if (!modalVisible) {
      setCheckedKeys([]);
      setRightOptions([]);
    }
  }, [modalVisible]);

  // 获取权限列表
  useRequest(
    async () => {
      const res = await getPermissionListApi();
      const { list: permissionList = [] } = res;

      setPermissionList(permissionList);
      const secondMenus = [] as Array<PermissionSecondLevel>;

      permissionList.map(firstMenu => {
        const { menu_id, menu_name, list = [] } = firstMenu;
        const updateList = list.map(item => ({ ...item, parentMenuId: menu_id, parentMenuName: menu_name }));

        secondMenus.push(...updateList);
      });

      setSecondMenus(secondMenus);
    },
    { refreshDeps: [] },
  );

  const roleTypeEnum = data.reduce((pre, cur: RoleTypeListItem) => {
    pre[cur.id] = {
      text: cur.name,
    };
    return pre;
  }, {});

  const columns: ProColumns<RoleManagementListItem>[] = [
    {
      title: '角色名称',
      dataIndex: 'name',
    },
    {
      title: '角色类型',
      dataIndex: 'role_type',
      valueType: 'select',
      valueEnum: roleTypeEnum,
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
        <a key="update" onClick={() => handleEdit(record)}>
          修改
        </a>,
        <a key="del" onClick={() => handleRemove(record)}>
          删除
        </a>,
      ],
    },
  ];
  const handleEdit = async (record: RoleManagementListItem) => {
    const { id } = record;

    setModalVisible(true);
    setDetailLoading(true);

    setIsDdd(false);
    const data = await getRoleDetailApi({ id });
    const { menu_ids = [], api_ids = [], name, role_type } = data;
    const updateRightOptions = secondMenus
      .filter(item => menu_ids.includes(item.menu_id))
      .map(item => {
        item?.children?.forEach(item => {
          if (item.request_method === 'GET') {
            item.disable = true;
          }
        });
        // 求交集
        const thirdChildIds = item?.children.map(child => child.id);
        const thirdChildIdsSet = new Set(thirdChildIds);
        const thirdCheckedList = api_ids.filter(id => thirdChildIdsSet.has(id));

        console.log('thirdCheckedList:', thirdCheckedList);
        return { ...item, secondIsChecked: true, thirdCheckedList };
      });

    const checkedMenus: Array<number> = [];

    permissionList.map(firstLevel => {
      const { list = [] } = firstLevel;

      // 当二级没有全选时，过滤掉一级
      list.map(secondLevel => {
        if (menu_ids.includes(secondLevel.menu_id)) {
          checkedMenus.push(secondLevel.menu_id);
        }
      });
    });

    setCurrentRow(data);
    modalFormRef.current?.setFieldsValue({ name, role_type });
    setRightOptions(updateRightOptions);
    setCheckedKeys(checkedMenus);
    setDetailLoading(false);
  };

  const onFinish = async (value: RoleData) => {
    const { name, role_type } = value;

    try {
      setConfirmLoading(true);
      let res = {};
      const permission_ids = [];
      let menu_ids = [];

      for (const rightOption of rightOptions) {
        const { menu_id, parentMenuId, thirdCheckedList = [] } = rightOption;

        permission_ids.push(...thirdCheckedList);
        menu_ids.push(...[menu_id, parentMenuId]);
      }
      menu_ids = Array.from(new Set(menu_ids)) as Array<number>;

      if (isDdd) {
        res = await addRoleApi({ name, role_type, menu_ids, permission_ids });
      } else {
        res = await updateRoleApi({ name, id: currentRow?.id || 0, role_type, menu_ids, permission_ids });
      }

      if (isSuccess(res, `${isDdd ? '新增' : '修改'}角色失败，请重试！`)) {
        message.success(`${isDdd ? '新增' : '修改'}角色成功`);
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
  const handleRemove = async (record: RoleManagementListItem) => {
    const { id = 0, is_exists_user, rel_user_list } = record;

    console.log('record:', record);
    const delRole = async () => {
      const hide = message.loading('正在删除');

      try {
        const res = await deleteRoleApi(id);

        if (isSuccess(res)) {
          message.success('删除成功');
          if (actionRef.current) {
            actionRef.current.reload();
          }
        } else {
          message.error('删除失败，请重试');
        }
      } catch (error) {
        console.error('error:', error);
      } finally {
        hide();
      }
    };

    if (is_exists_user) {
      warning({
        title: '禁止删除',
        icon: <ExclamationCircleFilled />,
        content: `该角色正在使用中，请先删除 ${rel_user_list.join(',')} 后重试!`,
      });
      return;
    }
    confirm({
      title: '确定删除该角色吗?',
      icon: <ExclamationCircleFilled />,
      content: '角色删除后，无法恢复！请谨慎删除！',
      async onOk() {
        delRole();
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const onChange = (list: CheckboxValueType[], option: PermissionSecondLevel) => {
    const updateOption = { ...option, thirdCheckedList: [...list] };
    const updateRightOptions = rightOptions.map(item => {
      if (item.menu_id === updateOption.menu_id) {
        return { ...item, ...updateOption };
      }
      return item;
    });

    setRightOptions(updateRightOptions);
  };

  const onCheck = (checkedKeysValue: React.Key[]) => {
    console.log('onCheck', checkedKeysValue);
    setCheckedKeys(checkedKeysValue);
    const updateRightOptions = secondMenus
      .filter(item => checkedKeysValue.includes(item.menu_id))
      .map(item => {
        const alreadyRightOption = rightOptions.find(option => option.menu_id === item.menu_id);
        let getOptionID;

        item?.children?.forEach(item => {
          if (item.request_method === 'GET') {
            getOptionID = item.id;
            item.disable = true;
          }
        });

        if (alreadyRightOption) {
          return alreadyRightOption;
        }
        return { ...item, secondIsChecked: true, thirdCheckedList: [getOptionID] };
      });

    setRightOptions(updateRightOptions);
  };

  console.log('rightOptions:', rightOptions);
  console.log('currentRow:', currentRow);
  console.log('permissionList:', permissionList);
  return (
    <PageContainer className={styles.pageCon}>
      <ProTable<RoleManagementListItem, TableListPagination>
        headerTitle="角色列表"
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
        request={getRoleManagementListApi}
        columns={columns}
        pagination={{ defaultPageSize: 10 }}
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
          persistenceKey: 'roleManagement',
          persistenceType: 'localStorage',
        }}
      />
      {modalVisible && (
        <ModalForm<RoleData>
          formRef={modalFormRef}
          modalProps={{ centered: true, confirmLoading, maskClosable: false }}
          title={isDdd ? '新建角色' : '修改角色'}
          width="800px"
          visible={modalVisible}
          onVisibleChange={setModalVisible}
          onFinish={onFinish}
          grid
          className={styles.modalCon}
        >
          <Spin spinning={detailLoading} style={{ width: '100%' }}>
            <Row>
              <ProFormText
                label={'角色名称'}
                rules={[
                  {
                    required: true,
                    message: '角色名称不能为空',
                  },
                ]}
                name="name"
                colProps={{
                  span: 11,
                }}
              />
              <Col span={2}></Col>
              <ProFormSelect
                options={data.map(item => ({ value: item.id, label: item.name }))}
                name="role_type"
                label="角色类型"
                rules={[
                  {
                    required: true,
                    message: '角色类型不能为空',
                  },
                ]}
                colProps={{
                  span: 11,
                }}
              />
            </Row>
            <Row style={{ width: '100%' }}>
              <Col span={11} className={styles.roleManage}>
                <div className={styles.title}>菜单权限</div>
                <div className={styles.checkboxAll}>
                  <Tree
                    className={styles.children}
                    defaultExpandAll={true}
                    checkable
                    treeData={permissionList}
                    fieldNames={{ title: 'menu_name', key: 'menu_id', children: 'list' }}
                    checkedKeys={checkedKeys}
                    onCheck={onCheck}
                  />
                </div>
              </Col>
              <Col span={2}></Col>
              <Col span={11} className={styles.roleManage}>
                <div className={styles.title}>功能权限</div>
                <div className={styles.checkboxAll}>
                  {rightOptions.map(option => {
                    return (
                      <div key={option.menu_id}>
                        <Checkbox checked={option?.secondIsChecked} disabled>
                          {option.menu_name}
                        </Checkbox>
                        <Checkbox.Group
                          value={option?.thirdCheckedList}
                          onChange={list => onChange(list, option)}
                          className={styles.children}
                        >
                          <Row>
                            {option?.children?.map(item => (
                              <Col span={8} key={item.id}>
                                <Checkbox value={item.id} disabled={item?.disable}>
                                  {item.brief}
                                </Checkbox>
                              </Col>
                            ))}
                          </Row>
                        </Checkbox.Group>
                      </div>
                    );
                  })}
                </div>
              </Col>
            </Row>
          </Spin>
        </ModalForm>
      )}
    </PageContainer>
  );
};

export default RoleManagementList;
