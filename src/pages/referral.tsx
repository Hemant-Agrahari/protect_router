import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GetStaticProps } from 'next';
import { commonStaticProps } from '@/utils/translation';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { ToInvite, Forms, Statistics } from '@/component/Referral';
import CustomMuiTab from '@/component/common/mui-component/CustomMuiTab';
import { useAppSelector } from '@/redux/hooks';

// Method is for language switch
export const getStaticProps: GetStaticProps = async (context) => {
  const { locale } = context;
  return commonStaticProps(locale!);
};

const Referral = () => {
  const user = useAppSelector((state) => state.user.user);
  const { t } = useTranslation();
  const router = useRouter();
  const [referralTabValue, setReferralTabValue] = useState(0);

  //Referral Page tab
  const referralTabHandle = (event: React.SyntheticEvent, newValue: number) => {
    setReferralTabValue(newValue);
  };

  useEffect(() => {
    console.log({ user }, typeof user);
    if (!user) {
      router.push('/');
    }
  }, []);

  const tabLabels = [t('Invite'), t('Statistics'), t('History')];
  const tabClassNames = ['toInvite', 'statistics', 'forms'];

  return (
    <div className="container margin-top-12">
      <div className="referalPage-tab">
        <CustomMuiTab
          value={referralTabValue}
          onChange={referralTabHandle}
          tabLabels={tabLabels}
          tabClassName={tabClassNames}
          tabsClassName=""
        />
        {referralTabValue === 0 && <ToInvite />}
        {referralTabValue === 1 && <Forms />}
        {referralTabValue === 2 && <Statistics />}
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Referral), {
  ssr: false,
});
