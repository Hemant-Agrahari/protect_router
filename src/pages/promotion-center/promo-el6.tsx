import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutateData } from '@/services';
import { logError } from '@/utils';
import { useTranslation } from 'react-i18next';
import { GetStaticProps } from 'next';
import { commonStaticProps } from '@/utils/translation';
import dynamic from 'next/dynamic';
import CustomImage from '@/component/common/CustomImage';

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
    <div className="container margin-top-12">
      <div className="promotion-banner text-center">
        {isMutating ? (
          t('Loading...')
        ) : (
          <CustomImage
            src={
              promotionBanner?.banner ? base_url + promotionBanner.banner : ''
            }
            alt="English banner"
            width={1421}
            height={300}
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
