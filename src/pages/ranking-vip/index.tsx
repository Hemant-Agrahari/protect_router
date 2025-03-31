import { CashbackSection, VipBonus, VipSlider } from '@/component/RankingVip'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { GetStaticProps } from 'next'
import { commonStaticProps } from '@/utils/translation'
import dynamic from 'next/dynamic'
import { getLocalStorageItem } from '@/utils'

// Method is for language switch
export const getStaticProps: GetStaticProps = async (context) => {
  const { locale } = context
  return commonStaticProps(locale!)
}

const VipPage = () => {
  let user: any = getLocalStorageItem('auth')
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/')
    }
  }, [])

  return (
    <div className="container" style={{ marginTop: '12vh' }}>
      {/* VIP Bonus ======= */}
      <VipBonus />
      {/* CASHBACK ======= */}
      <CashbackSection />
      {/* SLIDER  ===== */}
      <VipSlider />
    </div>
  )
}

export default dynamic(() => Promise.resolve(VipPage), {
  ssr: false,
})
