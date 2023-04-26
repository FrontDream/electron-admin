import { Card, Row, Button, Input } from 'antd';
import { useState, useMemo, useEffect } from 'react';
import { DocumentListItem, fileImagesMap } from '@/utils';
import { PageContainer } from '@ant-design/pro-layout';
import cls from 'classnames';
import { getDocumentListApi } from '@/services';
import { UploadOutlined } from '@ant-design/icons';
import styles from './index.less';

export interface BreadcrumItemType {
  name: string;
  id: number;
}

const DocumentManagement = () => {
  const [breadcrumbsList, setBreadcrumbsList] = useState<Array<BreadcrumItemType>>([{ name: 'Home', id: 0 }]);
  const [flieId, setFlieId] = useState<number | null>();
  const [fileAndFolderList, setFileAndFolderList] = useState<Array<DocumentListItem>>([]);
  // 全选框的显隐 ,1 文件夹，2文件
  const isShowAllSelect = useMemo(() => {
    return fileAndFolderList.every(item => {
      return item.type === 2;
    });
  }, [fileAndFolderList]);

  useEffect(() => {
    getTableData(0);
  }, []);

  const getTableData = async (parent_id: number) => {
    const documentList = await getDocumentListApi({
      parent_id,
    });
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
      getTableData(item.id);
    }
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
      getTableData(0);
    } else if (breadcrumbsList.length > 1) {
      const list = [...breadcrumbsList];

      list.pop();

      setBreadcrumbsList(list);
      getTableData(list[list.length - 1].id);
    }
  };
  // 点击全部文件
  const handleAllFolderBtn = () => {
    setBreadcrumbsList([]);
    getTableData(0);
  };
  // 点击头部面包屑
  const handleBreadcrumbsItem = (item: BreadcrumItemType, index: number) => {
    setBreadcrumbsList(breadcrumbsList.splice(0, index + 1));
    getTableData(item.id);
  };

  // 点击全选框
  const allSelectBtn = () => {
    const chill = document.getElementById('all') as HTMLInputElement;
    const chilles = document.getElementsByName('single') as NodeList;
    const list = [...fileAndFolderList];

    if (chill.checked) {
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
            <Input placeholder="请输入搜索内容" className={styles.search} />
          </div>
        </Row>
        <Row className={styles.breads}>
          <div className={styles.breadcrumb_item}>
            <ul>
              {breadcrumbsList.map((item, idx) => {
                return (
                  <li key={item.id} onClick={() => handleBreadcrumbsItem(item, idx)}>
                    <span
                      className={styles.bc_name}
                      style={{ color: idx !== breadcrumbsList.length - 1 ? '#E52E22' : '#333' }}
                    >
                      {item.name}
                    </span>
                    {idx !== breadcrumbsList.length - 1 && <span className={styles.arrow_right}>&gt; </span>}
                  </li>
                );
              })}
            </ul>
          </div>
        </Row>
        <Row>
          <div className={styles.table_files}>
            {isShowAllSelect && (
              <div className={styles.table_top}>
                <label>
                  <input name="allCheckbox" type="checkbox" value="" id="all" onClick={allSelectBtn} />
                  <span>全选</span>
                </label>
              </div>
            )}
            <ul>
              {fileAndFolderList.map(item => {
                return (
                  <li
                    key={item.id}
                    title={item.name}
                    className={cls({
                      selected_bgc: flieId === item.id || item.isSelected,
                    })}
                    onMouseEnter={() => fileMouseEnter(item)}
                    onMouseLeave={fileMouseLeave}
                    onMouseDown={e => fileMouseDown(item, e)}
                    onDoubleClick={() => handleBreakdown(item)}
                    onClick={() => downloadBtn(item)}
                  >
                    <div className={styles.single_checkbox}>
                      {item.type === 2 && (
                        <div>
                          <label
                            htmlFor=""
                            style={{ display: flieId === item.id || item.isSelected ? 'block' : 'none' }}
                          >
                            <input name="single" type="checkbox" value="" onClick={e => singleSelect(item, e)} />
                          </label>
                          <div
                            className={styles.operate_box}
                            style={{ display: flieId === item.id || item.isSelected ? 'block' : 'none' }}
                            onMouseLeave={() => operateMouseLeave(item)}
                          ></div>
                        </div>
                      )}
                    </div>
                    <img src={item.imageUrl} alt="" className={styles.format_img} />
                    <div className={styles.flies_title}>{item.name}</div>
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
