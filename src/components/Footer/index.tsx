import { DefaultFooter } from '@ant-design/pro-layout';
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      copyright={`${currentYear} 福建南旭投资有限公司`}
      links={[
        {
          key: 'tec',
          title: '技术支持:宁德炎岭智能科技有限公司',
          href: '/',
        },
        {
          key: 'phone',
          title: '客服热线:0593-2830686',
          href: '/',
        },
      ]}
    />
  );
};

export default Footer;
