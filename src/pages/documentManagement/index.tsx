import { Card, Row, Button, Input, Checkbox, Dropdown, MenuProps } from 'antd';
import { useState, useMemo, useEffect } from 'react';
import { DocumentListItem, fileImagesMap } from '@/utils';
import { PageContainer } from '@ant-design/pro-layout';
import cls from 'classnames';
import { getDocumentListApi } from '@/services';
import { UploadOutlined, DownloadOutlined, EllipsisOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import styles from './index.less';

export interface BreadcrumItemType {
  name: string;
  id: number;
}

const DocumentManagement = () => {
  const [allChecked, setAllChecked] = useState(false);
  const [breadcrumbsList, setBreadcrumbsList] = useState<Array<BreadcrumItemType>>([]);
  const [flieId, setFlieId] = useState<number | null>();
  const [fileAndFolderList, setFileAndFolderList] = useState<Array<DocumentListItem>>([]);
  // 全选框的显隐 ,1 文件夹，2文件
  const isShowAllSelect = useMemo(() => {
    return fileAndFolderList.every(item => {
      return item.type === 2;
    });
  }, [fileAndFolderList]);

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
      return { ...item, isSelected: false, isShowOpetate: false, imageUrl: fileImagesMap[format] };
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
      // this.breadcrumbsList.push(item);
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
  };
  // 点击头部面包屑
  const handleBreadcrumbsItem = (item: BreadcrumItemType, index: number) => {
    setBreadcrumbsList(breadcrumbsList.splice(0, index + 1));
    getTableData({ parent_id: item.id });
  };

  // 点击全选框
  const allSelectBtn = (e: CheckboxChangeEvent) => {
    const isAll = e.target.checked;
    const chilles = document.getElementsByName('single') as NodeList;
    const list = [...fileAndFolderList];

    if (isAll) {
      list.forEach(item => {
        if (item.type && item.type === 1) {
          item.isSelected = true;
        }
      });
      for (let i = 0; i < chilles.length; i++) {
        chilles[i].checked = true;
      }
    } else {
      list.forEach(item => {
        if (item.type && item.type === 1) {
          item.isSelected = false;
        }
      });
      for (let i = 0; i < chilles.length; i++) {
        chilles[i].checked = false;
      }
    }
    setFileAndFolderList(list);
    setAllChecked(isAll);
  };

  // 点击单选框
  const singleSelect = (item: DocumentListItem, e) => {
    item.isSelected = e.target.checked;
    setFlieId(item.id);
    const chill = document.getElementById('all') as HTMLInputElement;
    const chillesNum = document.getElementsByName('single').length;
    const selectedNum = document.querySelectorAll('input[name="single"]:checked').length;

    console.log('selectedNum:', selectedNum);
    console.log('chillesNum:', chillesNum);
    console.log('chill:', chill);
    if (chill) {
      if (chillesNum === selectedNum) {
        chill.checked = true;
      } else {
        chill.checked = false;
      }
    }
  };

  // 鼠标离开 编辑和删除区域，
  const operateMouseLeave = item => {
    item.isShowOpetate = false;
  };
  const editBtn = (item: DocumentListItem) => {
    console.log(item, '这是编辑');
  };

  const deleteBtn = (item: DocumentListItem) => {
    console.log('删除：', item);
  };

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a rel="noopener noreferrer">
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

  return (
    <PageContainer className={styles.pageCon}>
      <Card>
        <Row className={styles.btnList}>
          <Button type="primary" shape="round" icon={<UploadOutlined />} className={styles.uploadBtn}>
            上传
          </Button>
          <Button className={styles.newFolder} shape="round">
            新建文件夹
          </Button>
          <Button className={styles.batchDelete} shape="round">
            批量删除
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
              <Checkbox onChange={allSelectBtn} checked={allChecked} disabled={!isShowAllSelect}>
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
                        display: item.type === 2 && (flieId === item.id || item.isSelected) ? 'block' : 'none',
                      }}
                      name="single"
                      onChange={e => singleSelect(item, e)}
                    />
                    <div
                      className={styles.operation}
                      style={{ display: flieId === item.id || item.isSelected ? 'block' : 'none' }}
                      onMouseLeave={() => operateMouseLeave(item)}
                    >
                      <DownloadOutlined style={{ color: '#C8793E', cursor: 'pointer' }} />
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
      </Card>
    </PageContainer>
  );
};

export default DocumentManagement;
