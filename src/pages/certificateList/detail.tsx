import { PageContainer } from '@ant-design/pro-layout';
import { Card, Descriptions, Divider } from 'antd';
import type { FC } from 'react';
import { useRequest } from 'umi';
import { getCertificateDetailApi } from '@/services';
import { useParams } from 'react-router-dom';
import { CertificateItem, useCertificatetPersons, useCertificatetTypes, getNameById } from '@/utils';

const Detail: FC = () => {
  const { id = 0 } = useParams<{ id: string }>();

  const { data = {} as CertificateItem, loading } = useRequest(async () => {
    const res = await getCertificateDetailApi(Number(id));

    return { data: res.data };
  });

  const certificatetPersons = useCertificatetPersons();
  const certificatetTypes = useCertificatetTypes();

  const {
    cert_code,
    cert_id = 0,
    category,
    major,
    cert_data,
    expire_time,
    code_label,
    ctime,
    mtime,
    create_user,
    update_user,
    reminder_time,
    type = 0,
  } = data;

  return (
    <PageContainer>
      <Card bordered={false} loading={loading}>
        <Descriptions title="基础信息" style={{ marginBottom: 32 }}>
          <Descriptions.Item label="证书编号">{cert_code}</Descriptions.Item>
          <Descriptions.Item label="证书人员">{getNameById(certificatetPersons, cert_id)}</Descriptions.Item>
          <Descriptions.Item label="岗位类别">{category}</Descriptions.Item>
          <Descriptions.Item label="专业">{major}</Descriptions.Item>
          <Descriptions.Item label="发证日期">{cert_data}</Descriptions.Item>
          <Descriptions.Item label="失效日期">{expire_time}</Descriptions.Item>
          <Descriptions.Item label="失效提示时间">{reminder_time}</Descriptions.Item>
          <Descriptions.Item label="代码标注">{code_label === 1 ? '是' : '否'}</Descriptions.Item>
          <Descriptions.Item label="证书类型">{getNameById(certificatetTypes, type)}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{ctime}</Descriptions.Item>
          <Descriptions.Item label="修改时间">{mtime}</Descriptions.Item>
          <Descriptions.Item label="创建人">{create_user}</Descriptions.Item>
          <Descriptions.Item label="修改人">{update_user}</Descriptions.Item>
        </Descriptions>
        <Divider style={{ marginBottom: 32 }} />
        <Descriptions title="用户信息" style={{ marginBottom: 32 }}>
          <Descriptions.Item label="用户姓名">付小小</Descriptions.Item>
          <Descriptions.Item label="联系电话">18100000000</Descriptions.Item>
          <Descriptions.Item label="常用快递">菜鸟仓储</Descriptions.Item>
          <Descriptions.Item label="取货地址">浙江省杭州市西湖区万塘路18号</Descriptions.Item>
          <Descriptions.Item label="备注">无</Descriptions.Item>
        </Descriptions>
      </Card>
    </PageContainer>
  );
};

export default Detail;
