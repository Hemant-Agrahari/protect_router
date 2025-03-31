import Privacy_policy from '@/component/privacyPolicy/PrivacyPolicy'
import React from 'react'
import { GetStaticProps } from 'next'
import { commonStaticProps } from '@/utils/translation'
import dynamic from 'next/dynamic'

// Method is for language switch
export const getStaticProps: GetStaticProps = async (context) => {
  const { locale } = context
  return commonStaticProps(locale!)
}
const PrivacyPolicy = () => {
  return (
    <div>
      <Privacy_policy />
    </div>
  )
}

export default dynamic(() => Promise.resolve(PrivacyPolicy), {
  ssr: false,
})
