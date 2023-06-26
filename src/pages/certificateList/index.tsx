import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import Certificate from '@/components/Certificate';

const CertificateList: React.FC = () => {
  return (
    <PageContainer>
      <Certificate from="certificateList" />
    </PageContainer>
  );
};

export default CertificateList;
