import { PageContainer } from '@ant-design/pro-layout';
import { Card, Descriptions } from 'antd';
import { useRequest } from 'umi';
import { useParams } from 'react-router-dom';
import { getCertificateCompanyDetailApi } from '@/services';
import moment from 'moment';
import CompanyCertificate from '@/components/CompanyCertificate';

const CertificateCompanyDetail = () => {
  const { id = '' } = useParams<{ id: string }>();

  const { data: companyData, loading: companyDetailLoading } = useRequest(
    async () => {
      const data = await getCertificateCompanyDetailApi(Number(id));

      return { data };
    },
    { refreshDeps: [id] },
  );

  return (
    <PageContainer>
      <Card bordered={false} title={'企业详情'} loading={companyDetailLoading}>
        <Descriptions style={{ marginBottom: 32 }}>
          <Descriptions.Item label="企业名称">{companyData?.name || '-'}</Descriptions.Item>
          <Descriptions.Item label="企业曾用名">{companyData?.former_name || '-'}</Descriptions.Item>
          <Descriptions.Item label="企业注册地址">{companyData?.reg_address || '-'}</Descriptions.Item>
          <Descriptions.Item label="企业详细地址">{companyData?.address || '-'}</Descriptions.Item>
          <Descriptions.Item label="统一社会信用编码">{companyData?.credit_code || '-'}</Descriptions.Item>
          <Descriptions.Item label="成立时间">{companyData?.established_date || '-'}</Descriptions.Item>
          <Descriptions.Item label="法定代表人">{companyData?.leg_representative || '-'}</Descriptions.Item>
          <Descriptions.Item label="注册资本(万元)">{companyData?.reg_capital || '-'}</Descriptions.Item>
          <Descriptions.Item label="类型/经济性质">{companyData?.economy_type || '-'}</Descriptions.Item>
          <Descriptions.Item label="创建人">{companyData?.create_user || '-'}</Descriptions.Item>
          <Descriptions.Item label="修改人">{companyData?.update_user || '-'}</Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {moment.unix(companyData?.ctime || 0).format('YYYY-MM-DD HH:mm:ss') || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="修改时间">
            {moment.unix(companyData?.mtime || 0).format('YYYY-MM-DD HH:mm:ss') || '-'}
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title={'企业证书详情'} bordered={false}></Card>
      <CompanyCertificate from={'certificateCompanyDetail'} id={id} />
    </PageContainer>
  );
};

export default CertificateCompanyDetail;
