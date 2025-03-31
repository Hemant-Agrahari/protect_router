import { useFetch } from '@/services';
import InvitationBonusType from '@/types/invitationBonus';
import React from 'react';
import { useTranslation } from 'react-i18next';
import CustomImage from '../common/CustomImage';

type InvitationBonusData = {
  invitationBonusData: InvitationBonusType[]
}

const InvitationBonus = () => {
  const { data } = useFetch<InvitationBonusData>(`invitationBonus`)
  const { t } = useTranslation()

  // Function to get styles based on index
  const getAchievementBonusStyles = (index: number) => {
    const bonusDataLength = data?.result?.invitationBonusData?.length ?? 0;
    let backgroundColor = '';
    let textColor = 'var(--black)'; // Default text color

    if (index === bonusDataLength - 3) {
      backgroundColor = 'var(--light-purple)';
      textColor = 'var(--white)';
    } else if (index === bonusDataLength - 2) {
      backgroundColor = 'var(--vibrant-purple)';
      textColor = 'var(--white)';
    } else if (index === bonusDataLength - 1) {
      backgroundColor = 'var(--bold-purple)';
      textColor = 'var(--white)';
    }
    return {
      backgroundColor,
      color: textColor,
    };
  }

  return (
    <>
      <div className="invitation-bonus">
        <div className="referalPageSection-title text-white">
          {t('How Does The Invitation Bonus Work?')}
        </div>
        <div className="invitationBonus-col">
          <div className="invitationBonus-content">
            <div className="invitationBonus-content-title">{t('Invitation Bonus')}</div>
            <p>
              {t(
                'Each deposit user can receive at least $12 for each invitation. The more people you invite, the higher the bonus of the invitation to the corresponding level.'
              )}
            </p>
          </div>
          <div className="invitationBonus-img">
            <CustomImage src='/assets/images/invitation-bonus-work.png' alt="invitation-bonus" width={372} height={299} />
          </div>
        </div>
      </div>

      {/* ACHIEVEMENT BONUS */}
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
            ?.map((item, index) => {
              const { backgroundColor, color } = getAchievementBonusStyles(index);
              return (
                <div
                  className="cd-col"
                  style={{
                    backgroundColor,
                    color,
                  }}
                  key={index}
                >
                  <div className="title">{item.usersCount}</div>
                  <div className="title">
                    <span>{item.rewardAmount}</span>
                    <CustomImage
                      src='/assets/images/coin.png'
                      alt={t('coin')}
                      width={22}
                      height={22}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default InvitationBonus;
