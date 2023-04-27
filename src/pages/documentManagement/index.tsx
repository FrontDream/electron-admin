import { Card, Row, Button, Input, Checkbox, Dropdown, Modal, MenuProps, message } from 'antd';
import { useState, useMemo, useEffect, useRef } from 'react';
import { DocumentListItem, fileImagesMap, isSuccess } from '@/utils';
import { PageContainer } from '@ant-design/pro-layout';
import { getDocumentListApi, deleteDocumentApi, addDocumentApi } from '@/services';
import {
  UploadOutlined,
  DownloadOutlined,
  EllipsisOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
} from '@ant-design/icons';
import { ModalForm, ProFormText, FormInstance } from '@ant-design/pro-form';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import styles from './index.less';

export interface BreadcrumItemType {
  name: string;
  id: number;
}

const { confirm } = Modal;

const DocumentManagement = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [allChecked, setAllChecked] = useState(false);
  const [breadcrumbsList, setBreadcrumbsList] = useState<Array<BreadcrumItemType>>([]);
  const [flieId, setFlieId] = useState<number | null>();
  const modalFormRef = useRef<FormInstance>();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [fileAndFolderList, setFileAndFolderList] = useState<Array<DocumentListItem>>([]);
  // 全选框的显隐 ,1 文件夹，2文件
  const isShowAllSelect = useMemo(() => {
    return fileAndFolderList.every(item => {
      return item.type === 2;
    });
  }, [fileAndFolderList]);

  const currentId = useMemo(() => {
    if (breadcrumbsList.length) {
      const lastItem = breadcrumbsList[breadcrumbsList.length - 1];

      return lastItem.id;
    }
    return 0;
  }, [breadcrumbsList]);

  useEffect(() => {
    getTableData({
      parent_id: 0,
    });
  }, []);

  const getTableData = async (params: { parent_id?: number; name?: string }) => {
    const documentList = await getDocumentListApi(params);
    const updateList = documentList.map(item => {
      let format = item.format;

      if (item.type === 1) {
        format = 'AAA';
      }
      return { ...item, isSelected: false, imageUrl: fileImagesMap[format] };
    });

    setFileAndFolderList(updateList);
  };
  const fileMouseEnter = (item: DocumentListItem) => {
    setFlieId(item.id);
  };
  // 鼠标离开 li
  const fileMouseLeave = () => {
    setFlieId(null);
  };
  // 鼠标右键
  const fileMouseDown = (item: DocumentListItem, e) => {
    e.target.oncontextmenu = function (e) {
      // 阻止鼠标右键默认事件
      e.preventDefault();
      console.log(item, 'zzzzz');
    };
  };

  // 双击文件夹进入下一级
  const handleBreakdown = (item: DocumentListItem) => {
    if (item.type && item.type === 1) {
      console.log(item, '这是双击');
      setBreadcrumbsList([...breadcrumbsList, { name: item.name, id: item.id }]);
      getTableData({ parent_id: item.id });
    }
    setAllChecked(false);
  };

  // 点击文件是下载
  const downloadBtn = item => {
    if (item.type && item.FileFormat === 2) {
      console.log('这是单击下载');
    }
  };

  // 返回上一级
  const backBtn = () => {
    if (breadcrumbsList.length === 1) {
      setBreadcrumbsList([]);
      getTableData({ parent_id: 0 });
    } else if (breadcrumbsList.length > 1) {
      const list = [...breadcrumbsList];

      list.pop();

      setBreadcrumbsList(list);
      getTableData({ parent_id: list[list.length - 1].id });
    }
  };
  // 点击全部文件
  const handleAllFolderBtn = () => {
    setBreadcrumbsList([]);
    getTableData({ parent_id: 0 });
    setAllChecked(false);
  };
  // 点击头部面包屑
  const handleBreadcrumbsItem = (item: BreadcrumItemType, index: number) => {
    setBreadcrumbsList(breadcrumbsList.splice(0, index + 1));
    getTableData({ parent_id: item.id });
    setAllChecked(false);
  };

  // 点击全选框
  const allSelectBtn = (e: CheckboxChangeEvent) => {
    const isAll = e.target.checked;
    const list = [...fileAndFolderList];

    list.forEach(item => {
      if (item.type && item.type === 2) {
        item.isSelected = isAll;
      }
    });

    setFileAndFolderList(list);
    setAllChecked(isAll);
  };

  // 点击单选框
  const singleSelect = (item: DocumentListItem, e) => {
    const isSelected = e.target.checked;

    setFlieId(item.id);
    const chill = document.getElementById('all') as HTMLInputElement;
    const chillesNum = document.getElementsByName('single').length;
    const selectedNum = document.querySelectorAll('input[name="single"]:checked').length;
    const updateList = fileAndFolderList.map(file => {
      if (file.id !== item.id) {
        return file;
      }
      return { ...file, isSelected };
    });

    setFileAndFolderList(updateList);
    if (chill) {
      if (chillesNum === selectedNum) {
        setAllChecked(true);
      } else {
        setAllChecked(false);
      }
    }
  };
  const handleDeleteOne = async () => {
    await deleteFileFolder([flieId!]);
  };

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a rel="noopener noreferrer" onClick={handleDeleteOne}>
          <DeleteOutlined /> 删除
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a rel="noopener noreferrer">
          <EditOutlined />
          重命名
        </a>
      ),
    },
  ];

  const onSearch = (name: string) => {
    getTableData({
      name,
    });
  };

  const deleteFileFolder = async (ids: Array<number>) => {
    const del = async () => {
      const hide = message.loading('正在删除');

      try {
        const res = await deleteDocumentApi(ids);

        if (isSuccess(res, '删除失败，请重试')) {
          message.success('删除成功');
          await refreshFiles();
        }
      } catch (error) {
        console.error('error:', error);
      } finally {
        hide();
      }
    };

    confirm({
      title: '确定删除吗?',
      icon: <ExclamationCircleFilled />,
      content: '删除后，无法恢复！请谨慎删除！',
      async onOk() {
        del();
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const handleBatchRemove = async () => {
    const selectedList = fileAndFolderList.filter(item => item.isSelected);

    if (!selectedList.length) {
      message.warning('请选择文件或文件夹后重试');
      return;
    }
    const ids = selectedList.map(item => item.id);

    await deleteFileFolder(ids);
  };

  const refreshFiles = async () => {
    await getTableData({ parent_id: currentId });
  };
  const createFolderFinish = async (value: { name: string }) => {
    const { name } = value;

    try {
      setConfirmLoading(true);
      const res = await addDocumentApi([{ name, parent_id: currentId, type: 1 }]);

      if (isSuccess(res)) {
        message.success('新建文件夹成功');
        setModalVisible(false);
        await refreshFiles();
      } else {
        message.error('新建文件夹失败，请重试');
      }
    } catch (error) {
      console.error('error:', error);
    } finally {
      setConfirmLoading(false);
    }

    console.log('value:', value);
  };

  const handleNewFolder = () => {
    setModalVisible(true);
  };

  return (
    <PageContainer className={styles.pageCon}>
      <Card>
        <Row className={styles.btnList}>
          <Button type="primary" shape="round" icon={<UploadOutlined />} className={styles.uploadBtn}>
            上传
          </Button>
          <Button type="primary" className={styles.batchDelete} shape="round" onClick={handleBatchRemove}>
            批量删除
          </Button>
          <Button type="primary" className={styles.newFolder} shape="round" onClick={handleNewFolder}>
            新建文件夹
          </Button>
          <Button type="primary" shape="round">
            权限设定
          </Button>
          <div className={styles.searchCon}>
            <Input.Search placeholder="请输入搜索内容" className={styles.search} onSearch={onSearch} />
          </div>
        </Row>
        <Row>
          <div className={styles.nav}>
            {breadcrumbsList.length > 0 && (
              <>
                <div onClick={backBtn} className={styles.backNext}>
                  返回上一级
                </div>
                <span className={styles.delimiter}>|</span>
              </>
            )}
            <div className={styles.breadcrumb_all}>
              <span onClick={handleAllFolderBtn} className={styles.breadcrumbAllText}>
                全部文件
              </span>
              {breadcrumbsList.length > 0 && <span className={styles.arrow_right}> &gt; </span>}
            </div>
            <div className={styles.breadcrumb_item}>
              <ul>
                {breadcrumbsList.map((item, idx) => {
                  return (
                    <li key={item.id} onClick={() => handleBreadcrumbsItem(item, idx)}>
                      <span
                        className={styles.bc_name}
                        style={{ color: idx !== breadcrumbsList.length - 1 ? '#c8793e' : '#979797' }}
                      >
                        {item.name}
                      </span>
                      {idx !== breadcrumbsList.length - 1 && <span className={styles.arrow_right}>&gt; </span>}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className={styles.fileTotal}>{`已全部加载，共${fileAndFolderList.length}个`}</div>
          </div>
        </Row>
        <Row>
          <div className={styles.table_files}>
            <div className={styles.table_top}>
              <Checkbox id="all" onChange={allSelectBtn} checked={allChecked} disabled={!isShowAllSelect}>
                全选
              </Checkbox>
            </div>
            <ul>
              {fileAndFolderList.map(item => {
                return (
                  <li
                    key={item.id}
                    title={item.name}
                    className={`${flieId === item.id || item.isSelected ? styles.selected_bgc : ''}`}
                    onMouseEnter={() => fileMouseEnter(item)}
                    onMouseLeave={fileMouseLeave}
                    onMouseDown={e => fileMouseDown(item, e)}
                    onDoubleClick={() => handleBreakdown(item)}
                    onClick={() => downloadBtn(item)}
                  >
                    <Checkbox
                      className={styles.itemCheckbox}
                      style={{
                        display: flieId === item.id || item.isSelected ? 'block' : 'none',
                      }}
                      name="single"
                      onChange={e => singleSelect(item, e)}
                      checked={item.isSelected}
                    />
                    <div
                      className={styles.operation}
                      style={{ display: flieId === item.id || item.isSelected ? 'block' : 'none' }}
                    >
                      {item.type === 2 && <DownloadOutlined style={{ color: '#C8793E', cursor: 'pointer' }} />}

                      <Dropdown menu={{ items }} placement="bottom" arrow>
                        <EllipsisOutlined style={{ color: '#C8793E', cursor: 'pointer' }} />
                      </Dropdown>
                    </div>

                    <div className={styles.content}>
                      <img src={item.imageUrl} alt="" className={styles.fileImg} />
                      <div className={styles.fileName}>{item.name}</div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </Row>
        {modalVisible && (
          <ModalForm<{ name: string }>
            formRef={modalFormRef}
            modalProps={{ centered: true, confirmLoading }}
            title={'新建文件夹'}
            width="400px"
            visible={modalVisible}
            onVisibleChange={setModalVisible}
            onFinish={createFolderFinish}
            initialValues={{ name: '新建文件夹' }}
          >
            <ProFormText
              label={'文件夹名称'}
              rules={[
                {
                  required: true,
                  message: '文件夹名称不能为空',
                },
              ]}
              name="name"
            />
          </ModalForm>
        )}
      </Card>
    </PageContainer>
  );
};

export default DocumentManagement;
