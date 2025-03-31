import { useFetch } from '@/services'
import InvitationBonusType from '@/types/invitationBonus'
import Image from 'next/image'
import React from 'react'
import { useTranslation } from 'react-i18next'
type InvitationBonusData = {
  invitationBonusData: InvitationBonusType[]
}
const InvitationBonus = () => {
  const { data } = useFetch<InvitationBonusData>(`invitationBonus`)
  const { t } = useTranslation()

  return (
    <>
      <div className="invitation-bonus">
        <div className="referalPageSection-title text-white">
          {t('How Does The Invitation Bonus Work?')}
        </div>
        <div className="invitationBonus-col">
          <div className="invitationBonus-content">
            <div className="title">{t('Invitation Bonus')}</div>
            <p>
              {t(
                'Each deposit user can receive at least $12 for each invitation. The more people you invite, the higher the bonus of the invitation to the corresponding level.',
              )}
            </p>
          </div>
          <div className="invitationBonus-img">
            <img src={'/assets/images/invitation-bonus-work.png'} alt="" />
          </div>
        </div>
      </div>
      {/*ACHIEVEMENT BONUS*/}
      <div className="achievement-bonus">
        <div className="referalPageSection-title">{t('Achievement Bonus')}</div>
        <div className="cumulative-deposit">
          <div className="cd-title cd-col">
            <div className="title">
              {t('Cumulative')} <br /> {t('Deposit Users')}
            </div>
            <div className="title">{t('Bonus')}</div>
          </div>
          {data?.result?.invitationBonusData
            ?.slice()
            .sort((a, b) => a.rewardAmount - b?.rewardAmount)
            ?.map((item, index) => (
              <div
                className="cd-col"
                style={{
                  backgroundColor:
                    index === data?.result?.invitationBonusData?.length! - 3
                      ? '#BC68FF'
                      : index === data?.result?.invitationBonusData?.length! - 2
                        ? '#A737FF'
                        : index ===
                            data?.result?.invitationBonusData?.length! - 1
                          ? '#9010F5'
                          : '',
                  color:
                    index >= data?.result?.invitationBonusData?.length! - 3
                      ? '#fff'
                      : '#000',
                }}
                key={index}
              >
                <div className="title">{item.usersCount}</div>
                <div className="title">
                  <span>{item.rewardAmount}</span>{' '}
                  <Image
                    src={'/assets/images/coin.png'}
                    alt={t('coin')}
                    width={22}
                    height={22}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  )
}

export default InvitationBonus
