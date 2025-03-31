import { useEffect, useState } from 'react'
import ProfitTodayChart from './ProfitTodayChart'
import { useFetch, useMutateData } from '@/services'
import { useAppSelector } from '@/redux/hooks'
import FormsData from '@/types/formsData'
import { logError } from '@/utils'
import { useTranslation } from 'react-i18next'
import Image from 'next/image';

const Forms = () => {
  const { mutateData } = useMutateData()
  const user = useAppSelector((state) => state.user.user)
  const { t } = useTranslation()
  const [formsData, setFormsData] = useState<FormsData>({
    depositedUser: 0,
    todayBettingbonus: 0,
    todayInvitaionBonus: 0,
    todayUpgradeBonus: 0,
    totalBettingbonus: 0,
    totalInvitaionBonus: 0,
    totalUpgradeBonus: 0,
  })

  useEffect(() => {
    mutateData('forms', {
      body: { userId: user?._id },
    })
      .then((res) => setFormsData(res?.data))
      .catch((err) => logError(err))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const { data } = useFetch<any>('formContent')

  const ProfitTodays =
    formsData?.todayInvitaionBonus &&
    formsData?.todayInvitaionBonus + formsData?.todayBettingbonus &&
    formsData?.todayBettingbonus + formsData?.todayUpgradeBonus &&
    formsData?.todayUpgradeBonus
  const ProfitTotals =
    formsData?.todayBettingbonus &&
    formsData?.todayBettingbonus + formsData?.todayBettingbonus &&
    formsData?.todayBettingbonus + formsData?.todayUpgradeBonus &&
    formsData?.todayUpgradeBonus

  return (
    <>
      <div className="partner-revenue formsTab profit-graph-section">
        <div className="partner">
          <div className="profitToday-title">{t('Profit Today')}</div>
          <ProfitTodayChart series={formsData} />
          <div className="profitToday-value">
            $
            {ProfitTodays && ProfitTodays.toString() !== 'NaN'
              ? ProfitTodays?.toFixed(2)
              : '0.00'}
          </div>
          <div className="profitToday-botm">{''}</div>
        </div>
        <div className="revenue">
          <div className="revenue-row">
            <div className="revenue-col">
              <span className="value">
                $
                {formsData?.todayBettingbonus
                  ? formsData?.todayBettingbonus?.toFixed(2)
                  : '0.00'}
              </span>
              <label htmlFor="">{t('Betting Commission')}</label>
            </div>
            <div className="revenue-col">
              <span className="value">
                $
                {formsData?.todayInvitaionBonus
                  ? formsData?.todayInvitaionBonus?.toFixed(2)
                  : '0.00'}
              </span>
              <label htmlFor="">{t('Invitation Bonus')}</label>
            </div>
            <div className="revenue-col">
              <span className="value">
                $
                {formsData?.todayUpgradeBonus
                  ? formsData?.todayUpgradeBonus?.toFixed(2)
                  : '0.00'}
              </span>
              <label htmlFor="">{t('Achievement Bonus')}</label>
            </div>
          </div>
          <div
            className="yourProfit mt-3"
            dangerouslySetInnerHTML={{
              __html: data?.result?.[0]?.description1,
            }}
          />
        </div>
      </div>
      <div className="partner-revenue formsTab">
        <div className="partner">
          <div className="profitToday-title">{t('Profit Today')}</div>
          <div className="profitToday-img">
          <Image src='/assets/images/profit-today.png' alt="profit today" width={176} height={140}/>
          </div>
          <div className="profitToday-value">
            {ProfitTotals?.toFixed(2) === 'NaN'
              ? '0.00'
              : ProfitTotals
                ? ProfitTotals?.toFixed(2)
                : '0.00'}
          </div>
          <div className="profitToday-botm">{t('Profit Total')}</div>
        </div>
        <div className="revenue">
          <div className="revenue-row">
            <div className="revenue-col">
              <span className="value">
                $
                {formsData?.todayBettingbonus
                  ? formsData?.todayBettingbonus?.toFixed(2)
                  : '0.00'}
              </span>
              <label htmlFor="">{t('Betting Commission')}</label>
            </div>
            <div className="revenue-col">
              <span className="value">
                {formsData?.todayInvitaionBonus
                  ? formsData?.todayInvitaionBonus?.toFixed(2)
                  : '0.00'}
              </span>
              <label htmlFor="">{t('Invitation Bonus')}</label>
            </div>
            <div className="revenue-col">
              <span className="value">
                {formsData?.todayUpgradeBonus
                  ? formsData?.todayUpgradeBonus?.toFixed(2)
                  : '0.00'}
              </span>
              <label htmlFor="">{t('Achievement Bonus')}</label>
            </div>
            <div className="revenue-col">
              <span className="value">
                {formsData?.depositedUser ? formsData?.depositedUser : 0}
              </span>
              <label form="">{t('Deposited Users')}</label>
            </div>
          </div>
          <div
            className="yourProfit mt-3"
            dangerouslySetInnerHTML={{
              __html: data?.result?.[0]?.description2,
            }}
          />
        </div>
      </div>
    </>
  )
}

export default Forms
