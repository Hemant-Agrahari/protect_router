import React, { useEffect, useState } from 'react'
import Slider from 'react-slick'
import { useTranslation } from 'react-i18next'
import { GetMethod } from '@/services/fetchAPI'

const TopBanners = () => {
  const [bannerBig, setBannerBig] = useState([])
  const base_url = process.env.NEXT_PUBLIC_IMAGE_URL
  const { t } = useTranslation()

  const fetchBanner = async () => {
    try {
      const banner: any = await GetMethod('banner')
      if (banner.data?.status !== 'success') {
        throw new Error('banner do not fetched')
      }
      setBannerBig(banner.data.result)
    } catch (error) {
      console.error('Error fetching game data:', error)
    }
  }

  useEffect(() => {
    fetchBanner()
  }, [])

  let settings = {
    dots: true,
    infinite: false,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
          infinite: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
        },
      },
    ],
  }

  return (
    <div key={'top-banner-div'} className="homeBanner-slider pt-md-4 pt-3">
      <div className="vip-slider py-1">
        <Slider {...settings}>
          {bannerBig &&
            bannerBig.length > 0 &&
            bannerBig?.map((item: any, i) => (
              <div className="homeBanner" key={item}>
                <div className="homeBannerDesktop">
                  <img
                    src={base_url + item.bannerEnglishImage}
                    alt={t('Image')}
                    loading="eager"
                    className="BannerBigHomeSlider"
                  />
                </div>
              </div>
            ))}
        </Slider>
      </div>
    </div>
  )
}

export default TopBanners
