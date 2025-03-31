import { GameHistory } from '@/component/PersonalCenter'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { GetStaticProps } from 'next'
import { commonStaticProps } from '@/utils/translation'
import { useTranslation } from 'react-i18next'
import dynamic from 'next/dynamic'
import { getLocalStorageItem } from '@/utils'
import { useEffect } from 'react'

// Method is for language switch
export const getStaticProps: GetStaticProps = async (context) => {
  const { locale } = context
  return commonStaticProps(locale!)
}
const Game_history = () => {
  const router = useRouter()
  const { t } = useTranslation()
  let user: any = getLocalStorageItem('auth')

  useEffect(() => {
    if (!user) {
      router.push('/')
    }
  }, [user])

  return (
    <div className="container" style={{ marginTop: '12vh' }}>
      <div className="StatisticsTab">
        <div style={{ display: 'flex', alignItems: 'center' }} className="m-2">
          <Image
            src={'/assets/images/ProfileBackButton.png'}
            alt={t('Back button')}
            onClick={() => router.back()}
            style={{ cursor: 'pointer' }}
            width={25}
            height={25}
          />
          <div
            className="m-2"
            style={{ fontWeight: '800', color: '#fff', fontSize: '18px' }}
          >
            {t('Game History')}
          </div>
        </div>
        <GameHistory />
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(Game_history), { ssr: false })
