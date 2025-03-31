import PromotionTab from '@/component/Homepage/PromotionTab'
import { GetStaticProps } from 'next'
import { commonStaticProps } from '@/utils/translation'
import dynamic from 'next/dynamic'

// Method is for language switch
export const getStaticProps: GetStaticProps = async (context) => {
  const { locale } = context
  return commonStaticProps(locale!)
}
const PromotionPage = () => {
  return (
    <div className="container" style={{ marginTop: '15vh' }}>
      <PromotionTab />
    </div>
  )
}

export default dynamic(() => Promise.resolve(PromotionPage), {
  ssr: false,
})
