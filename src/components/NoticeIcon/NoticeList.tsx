import { Avatar, List, Typography } from 'antd';

import React from 'react';
import classNames from 'classnames';
import styles from './NoticeList.less';
const { Paragraph } = Typography;

export type NoticeIconTabProps = {
  count?: number;
  showClear?: boolean;
  showViewMore?: boolean;
  style?: React.CSSProperties;
  title: string;
  tabKey: API.NoticeIconItemType;
  onClick?: (item: API.NoticeIconItem) => void;
  onClear?: () => void;
  emptyText?: string;
  clearText?: string;
  viewMoreText?: string;
  list: API.NoticeIconItem[];
  onViewMore?: (e: any) => void;
};
const NoticeList: React.FC<NoticeIconTabProps> = ({
  list = [],
  onClick,
  onClear,
  title,
  onViewMore,
  emptyText,
  showClear = true,
  clearText,
  viewMoreText,
  showViewMore = false,
}) => {
  if (!list || list.length === 0) {
    return (
      <div className={styles.notFound}>
        <img src="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg" alt="not found" />
        <div>{emptyText}</div>
      </div>
    );
  }
  return (
    <div>
      <List<API.NoticeIconItem>
        className={styles.list}
        dataSource={list}
        renderItem={(item, i) => {
          const itemCls = classNames(styles.item, {
            [styles.read]: item.read,
          });
          // eslint-disable-next-line no-nested-ternary
          // const leftIcon = item.avatar ? (
          //   typeof item.avatar === 'string' ? (
          //     <Avatar className={styles.avatar} src={item.avatar} />
          //   ) : (
          //     <span className={styles.iconElement}>{item.avatar}</span>
          //   )
          // ) : null;

          return (
            <List.Item
              className={itemCls}
              key={item.key || i}
              // onClick={() => {
              //   onClick?.(item);
              // }}
            >
              <List.Item.Meta
                className={styles.meta}
                avatar={<Avatar className={styles.avatar} src={'/notice.png'} />}
                title={
                  <div className={styles.title}>
                    证书编码为：
                    <Paragraph copyable>{item.cert_code}</Paragraph> 的证书将于{item.expire_time}过期
                    {/* <div className={styles.extra}>{item.extra}</div> */}
                  </div>
                }
                // description={
                //   <div>
                //     <div className={styles.description}>{item.description}</div>
                //     <div className={styles.datetime}>{item.datetime}</div>
                //   </div>
                // }
              />
            </List.Item>
          );
        }}
      />
      {/* <div className={styles.bottomBar}>
        {showClear ? (
          <div onClick={onClear}>
            {clearText} {title}
          </div>
        ) : null}
        {showViewMore ? (
          <div
            onClick={(e) => {
              if (onViewMore) {
                onViewMore(e);
              }
            }}
          >
            {viewMoreText}
          </div>
        ) : null}
      </div> */}
    </div>
  );
};

export default NoticeList;
