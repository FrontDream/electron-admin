import { PageContainer } from '@ant-design/pro-layout';
import { Card, Descriptions } from 'antd';
import { useRequest } from 'umi';
import { useParams } from 'react-router-dom';
import { getCertificatePersonDetailApi } from '@/services';
import moment from 'moment';
import Certificate from '@/components/Certificate';
import { jobStatusMap, downLoad } from '@/utils';

const CertificatePersonDetail = () => {
  const { id = '' } = useParams<{ id: string }>();
  const { data: personData, loading: personDetailLoading } = useRequest(
    async () => {
      const data = await getCertificatePersonDetailApi(Number(id));

      return { data };
    },
    { refreshDeps: [id] },
  );

  return (
    <PageContainer>
      <Card bordered={false} title={'人员详情'} loading={personDetailLoading}>
        <Descriptions style={{ marginBottom: 32 }}>
          <Descriptions.Item label="人员编号">{personData?.id_no || '-'}</Descriptions.Item>
          <Descriptions.Item label="姓名">{personData?.name || '-'}</Descriptions.Item>
          <Descriptions.Item label="身份证号">{personData?.id_number || '-'}</Descriptions.Item>
          <Descriptions.Item label="证件失效日期">{personData?.expire_time}</Descriptions.Item>
          <Descriptions.Item label="在职状态">{jobStatusMap[personData?.job_status || ''] || '-'}</Descriptions.Item>
          <Descriptions.Item label="人员归属">{personData?.person_belong || '-'}</Descriptions.Item>
          <Descriptions.Item label="注册单位">{personData?.company || '-'}</Descriptions.Item>
          <Descriptions.Item label="合同所属公司">{personData?.contract || '-'}</Descriptions.Item>
          <Descriptions.Item label="闽政通所在单位">{personData?.mzt || '-'}</Descriptions.Item>
          <Descriptions.Item label="社保所在公司">{personData?.social_security || '-'}</Descriptions.Item>
          <Descriptions.Item label="医保所在公司">{personData?.medical_insurance || '-'}</Descriptions.Item>
          <Descriptions.Item label="住房公积金所在公司">{personData?.prov_fund_company || '-'}</Descriptions.Item>
          <Descriptions.Item label="性别">{personData?.gender === 1 ? '男' : '女'}</Descriptions.Item>
          <Descriptions.Item label="家庭住址">{personData?.address || '-'}</Descriptions.Item>
          <Descriptions.Item label="联系方式">{personData?.phone}</Descriptions.Item>
          <Descriptions.Item label="入职日期">{personData?.entry_time}</Descriptions.Item>
          <Descriptions.Item label="项目备案名称">{personData?.project_record_name || '-'}</Descriptions.Item>
          <Descriptions.Item label="项目备案职务">{personData?.project_record_job || '-'}</Descriptions.Item>
          <Descriptions.Item label="创建人">{personData?.create_user}</Descriptions.Item>
          <Descriptions.Item label="修改人">{personData?.update_user}</Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {moment.unix(personData?.ctime || 0).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
          <Descriptions.Item label="修改时间">
            {moment.unix(personData?.mtime || 0).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>

          <Descriptions.Item label="备注">{personData?.remark || '-'}</Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title={'人员附件'} bordered={false}>
        {personData?.appendix_list?.map(item => {
          return (
            <div key={item.uid}>
              <a onClick={() => downLoad(item.url, item.name)}>{item.name}</a>
            </div>
          );
        })}
      </Card>
      <Card title={'证书详情'} bordered={false}></Card>
      <Certificate from="certificatePersonDetail" id={id} />
    </PageContainer>
  );
};

export default CertificatePersonDetail;
