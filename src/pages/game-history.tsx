import { GameHistory } from '@/component/PersonalCenter';
import { useRouter } from 'next/router';
import { GetStaticProps } from 'next';
import { commonStaticProps } from '@/utils/translation';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import CustomImage from '@/component/common/CustomImage';

// Method is for language switch
export const getStaticProps: GetStaticProps = async (context) => {
  const { locale } = context
  return commonStaticProps(locale!)
}
const Game_history = () => {
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <div className="container game-history-container">
      <div className="StatisticsTab">
        <div className="d-flex align-items-center m-2 cursor-pointer">
          <CustomImage
            src='/assets/images/ProfileBackButton.png'
            alt={t('Back button')}
            onClick={() => router.back()}
            width={25}
            height={25}
            className="back-image"
          />
          <div className="m-2 font-weight-800 text-white font-size-18">
            {t('Game History')}
          </div>
        </div>
        <GameHistory />
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(Game_history), { ssr: false })
