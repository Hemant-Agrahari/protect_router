import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useMutateData } from '@/services'
import { logError } from '@/utils'
import { useTranslation } from 'react-i18next'
import { GetStaticProps } from 'next'
import { commonStaticProps } from '@/utils/translation'
import dynamic from 'next/dynamic'

// Method is for language switch
export const getStaticProps: GetStaticProps = async (context) => {
  const { locale } = context
  return commonStaticProps(locale!)
}
const PromotionsFourth = () => {
  const base_url = process.env.NEXT_PUBLIC_IMAGE_URL
  const { id } = useRouter()?.query
  const { mutateData, isMutating } = useMutateData()
  const [promotionBanner, setPromotionBanner] = useState<any>()
  const { t } = useTranslation()

  useEffect(() => {
    mutateData(`promotion`, {
      body: {
        promotionId: id,
      },
    })
      .then((response) => {
        setPromotionBanner(response?.data)
      })
      .catch((err) => {
        logError(err)
      })
  }, [id])

  return (
    <div className="container" style={{ marginTop: '12vh' }}>
      <div className="promotion-banner text-center">
        {isMutating ? (
          t('Loading...')
        ) : (
          <img
            src={base_url + promotionBanner?.banner}
            alt={t('English banner')}
            style={{ width: '100%', height: '100%' }}
          />
        )}
      </div>
      <div className="promo-rules">
        <div className="promoRules-title">{t('Rules')}</div>
        <ul className="promoRules-ul">
          <p
            dangerouslySetInnerHTML={{ __html: promotionBanner?.description }}
          ></p>
        </ul>
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(PromotionsFourth), { ssr: false })
