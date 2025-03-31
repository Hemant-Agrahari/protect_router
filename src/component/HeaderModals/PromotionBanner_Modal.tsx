import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import Image from 'next/image'
import { Dialog } from '@mui/material'
import { useAppSelector } from '@/redux/hooks'
import { logError } from '@/utils'
import { GetMethod } from '@/services/fetchAPI'
import { useTranslation } from 'react-i18next'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import Link from 'next/link'

const PromotionBanner_Modal = () => {
  const base_url = process.env.NEXT_PUBLIC_IMAGE_URL
  const [openPromo, setOpenPromo] = useState(false)
  const [promotions, setPromotions] = useState<any>([])
  const user = useAppSelector((state) => state.user.user)
  const { t } = useTranslation()

  useEffect(() => {
    const hasClosedPromo = localStorage.getItem('hasClosedPromo')
    // Show the promo modal only if the user is logged in and has not closed it before
    if (user?._id && !hasClosedPromo) {
      setOpenPromo(true)
    }
  }, [user?._id])

  const handleClosePromo = () => {
    setOpenPromo(false)
    localStorage.setItem('hasClosedPromo', 'true')
  }

  useEffect(() => {
    GetMethod(`popup`)
      .then((response: any) => {
        setPromotions(
          response?.data.result.filter((item: any) => item?.type === 'second'),
        )
      })
      .catch((err) => {
        logError(err)
      })
  }, [])

  return (
    <>
      <Dialog
        className="promotionFirstModal promotionSecondModals"
        open={openPromo}
        onClose={handleClosePromo}
        disableScrollLock={true}
        scroll="body"
      >
        <div className="promotionFirstModal-content">
          <div onClick={handleClosePromo} className="promoCloseIcon">
            <CloseIcon />
          </div>
          <div className="promotionGift">
            <LazyLoadImage
              src={'/assets/images/promotion-gift.png'}
              alt={t('Promotions')}
              className="img-lazy"
              placeholderSrc={'/assets/images/come-get.png'}
              effect="blur"
            />
          </div>
          <div className="promotionGift-logo">
            <LazyLoadImage
              src={'/assets/images/logo.png'}
              alt={t('Logo')}
              placeholderSrc={'/assets/images/logo.png'}
            />
          </div>

          <ul className="promoGift-ul text-center">
            <li>
              {t(
                'The leading diversified online casino and one of the largest gambling companies in the world',
              )}
              .
            </li>
          </ul>
          <div className="promotionGift-bonus">
            <Image
              src={
                promotions[0]?.image
                  ? `${base_url}${promotions[0]?.image}`
                  : '/assets/images/bonus-img.png'
              }
              alt={t('bonus')}
              className=""
              height={200}
              width={900}
            />
          </div>
          <div className="promotionGift-footer">
            <p>{t('May all players have fun @ TT Casino Win')}.</p>
            <Link href="https://t.me/AISBoom">https://t.me/AISBoom</Link>
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default PromotionBanner_Modal
