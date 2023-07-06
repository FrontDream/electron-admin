import { FC } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import CompanyCertificate from '@/components/CompanyCertificate';

const CompanyCertificateList: FC = () => {
  return (
    <PageContainer>
      <CompanyCertificate from="companyCertificateList" />
    </PageContainer>
  );
};

export default CompanyCertificateList;
