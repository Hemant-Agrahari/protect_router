import React, { useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { Tab } from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import {
  DepositTab,
  GameHistory,
  WithdrawTab,
} from '@/component/PersonalCenter'
import dynamic from 'next/dynamic'
import { commonStaticProps } from '@/utils/translation'
import { GetStaticProps } from 'next'
import { useTranslation } from 'react-i18next'
import { getLocalStorageItem } from '@/utils'

// Method is for language switch
export const getStaticProps: GetStaticProps = async (context) => {
  const { locale } = context
  return commonStaticProps(locale!)
}

const WalletHistory = () => {
  const { t } = useTranslation()
  let user: any = getLocalStorageItem('auth')
  const router = useRouter()

  // Tabs Functionality
  const [activeTab, setActiveTab] = useState('tab1')

  const handleChangeTab = (
    event: React.ChangeEvent<{}>,
    newValue: React.SetStateAction<string>,
  ) => {
    setActiveTab(newValue)
  }

  useEffect(() => {
    if (!user) {
      router.push('/')
    }
  }, [user])

  return (
    <div className="container" style={{ marginTop: '12vh' }}>
      <div className="DepositTab">
        <div style={{ display: 'flex', alignItems: 'center' }} className="m-2">
          <img
            src={'/assets/images/ProfileBackButton.png'}
            alt={t('Back button')}
            onClick={() => router.back()}
            style={{ cursor: 'pointer' }}
          />
          <div
            className="m-2"
            style={{ fontWeight: '800', color: '#fff', fontSize: '18px' }}
          >
            {t('Wallet History')}
          </div>
        </div>
        <div className="walletHistoryPage-tab">
          <TabContext value={activeTab}>
            <TabList
              onChange={handleChangeTab}
              aria-label="lab API tabs example"
            >
              <Tab
                label={t('Deposit')}
                value="tab1"
                className="toInvite"
                disableRipple
              />
              <Tab
                label={t('Withdraw')}
                value="tab2"
                className="forms"
                disableRipple
              />
              <Tab
                label={t('Game History')}
                value="tab3"
                className="statistics"
                disableRipple
              />
            </TabList>

            <TabPanel value="tab1" className="m-2">
              <DepositTab />
            </TabPanel>
            <TabPanel value="tab2" className="m-2">
              <WithdrawTab />
            </TabPanel>
            <TabPanel value="tab3" className="m-2">
              <GameHistory />
            </TabPanel>
          </TabContext>
        </div>
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(WalletHistory), {
  ssr: false,
})
