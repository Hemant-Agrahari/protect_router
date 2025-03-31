import { CashbackSection, VipBonus, VipSlider } from '@/component/RankingVip';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { GetStaticProps } from 'next';
import { commonStaticProps } from '@/utils/translation';
import dynamic from 'next/dynamic';
import { useAppSelector } from '@/redux/hooks';

// Method is for language switch
export const getStaticProps: GetStaticProps = async (context) => {
  const { locale } = context;
  return commonStaticProps(locale!);
};

const VipPage = () => {
  const user = useAppSelector((state) => state.user.user);
  const router = useRouter();

  useEffect(() => {
    console.log({ user }, typeof user);
    if (!user) {
      router.push('/');
    }
  }, []);

  return (
    <div className="container margin-top-12">
      <VipBonus />
      <CashbackSection />
      <VipSlider />
    </div>
  );
};

export default dynamic(() => Promise.resolve(VipPage), {
  ssr: false,
});
