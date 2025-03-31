import { GetMethod } from '@/services/fetchAPI';
import { logError } from '@/utils';
import { Grid } from '@mui/material';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loader from '../common/mui-component/Loader';
import CustomImage from '../common/CustomImage';

const PromotionTab = () => {
  const [promotions, setPromotions] = useState<any>([])
  const [promotionStatic, setPromotionStatic] = useState<any>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { t } = useTranslation()

  useEffect(() => {
    GetMethod(`promotionpackage`)
      .then((response: unknown) => {
        const responseData = response as {
          data: {
            result: {
              promotionData: any
              staticPromotionData: any
            }
          }
        }
        setPromotions(responseData.data.result.promotionData)
      })
      .catch((err) => {
        logError(err)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const getImageSrc = (item: any) => {
    const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL
    const bannerSrc = item?.banner || ''
    return baseUrl + bannerSrc
  }
  return (
    <>
      {isLoading ? (
      <Loader/>
      ) : (
        <div className="homeTabPromotion-content">
          <Grid container spacing={2}  className="mt-0 pl-0 pr-2">
            {promotions?.map((item: any, index: any) => {
              return (
                <Grid
                  item
                  xs={4}
                  sm={4}
                  md={4}
                  lg={4}
                  key={item?.promotionNumber}
                >
                  <Link
                    href={`/promotion-center/promo-el6?id=${item?._id}`}
                    className="promotion-img"
                  >
                    <div className='w-100 position-relative promotion-tab-padding'
                      key={item?.uuid}
                    >
                      <CustomImage
                        src={getImageSrc(item)}
                        alt={t('Image')}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-1"
                      />
                    </div>
                  </Link>
                </Grid>
              )
            })}
          </Grid>
          <Grid container spacing={2} className="mt-0 pl-0 pr-2">
            {promotionStatic?.map((item: any, index: any) => {
              return (
                <Grid item xs={4} sm={4} md={4} lg={4} key={item}>
                  <Link
                    href={'/promotion-center/promo-static'}
                    className="promotion-img"
                  >
                    <div className='w-100 position-relative promotion-tab-padding'
                      key={item?.uuid}
                    >
                      <CustomImage
                        src={getImageSrc(item)}
                        alt={t('Image')}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-1"
                      />
                    </div>
                  </Link>
                </Grid>
              )
            })}
          </Grid>
        </div>
      )}
    </>
  )
}

export default PromotionTab
