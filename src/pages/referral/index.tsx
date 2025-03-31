import { useEffect, useState } from 'react'
import { Tab } from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Forms, Statistics, ToInvite } from '@/component/Referral'
import { useRouter } from 'next/router'
import { GetStaticProps } from 'next'
import { commonStaticProps } from '@/utils/translation'
import { useTranslation } from 'react-i18next'
import dynamic from 'next/dynamic'
import { getLocalStorageItem } from '@/utils'

// Method is for language switch
export const getStaticProps: GetStaticProps = async (context) => {
  const { locale } = context
  return commonStaticProps(locale!)
}

const Referral = () => {
  let user: any = getLocalStorageItem('auth')
  const { t } = useTranslation()
  const router = useRouter()
  const [referralTabValue, setReferralTabValue] = useState('1')

  const referralTabHandle = (
    event: React.ChangeEvent<{}>,
    newValue: React.SetStateAction<string>,
  ) => {
    setReferralTabValue(newValue)
  }

  useEffect(() => {
    if (!user) {
      router.push('/')
    }
  }, [])

  return (
    <div className="container" style={{ marginTop: '12vh' }}>
      <div className="referalPage-tab">
        <TabContext value={referralTabValue}>
          <TabList
            onChange={referralTabHandle}
            aria-label="lab API tabs example"
          >
            <Tab
              label={t('Invite')}
              value="1"
              className="toInvite"
              disableRipple
            />
            <Tab
              label={t('Statistics')}
              value="2"
              className="statistics"
              disableRipple
            />
            <Tab
              label={t('History')}
              value="3"
              className="forms"
              disableRipple
            />
          </TabList>
          <TabPanel value="1">
            <ToInvite />
          </TabPanel>
          <TabPanel value="2">
            <Forms />
          </TabPanel>
          <TabPanel value="3">
            <Statistics />
          </TabPanel>
        </TabContext>
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(Referral), {
  ssr: false,
})
