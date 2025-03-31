import Image from 'next/image'
import { useTranslation } from 'react-i18next'
const AwardsIssued = () => {
  const { t } = useTranslation()
  // Define your static data as an array of objects
  const awardsData = [
    {
      imgSrc: '/assets/images/invitation-bonus.png',
      title: 'Invitation Bonus',
      value: '$ 37.766.415',
      received: '7553491',
    },
    {
      imgSrc: '/assets/images/achievement-bonus.png',
      title: 'Achievement Bonus',
      value: '$ 41.906.430',
      received: '8381627',
    },
    {
      imgSrc: '/assets/images/betting-commission.png',
      title: 'Betting Commission',
      value: '$ 38.404.240',
      received: '7681122',
    },
  ]

  return (
    <div className="awards-issued">
      <div className="referalPageSection-title text-white">
        {t('Awards Issued So Far')}
      </div>
      <div className="awardsIssued-row">
        {awardsData.map((award, index) => (
          <div className="awardsIssued-col" key={index}>
            <div className="awardsIssued-img d-md-none">
              <Image
                src={award.imgSrc}
                alt={t(award.title)}
                width={100}
                height={100}
              />
            </div>
            <div className="awardsIssued-img d-none d-md-block">
              <Image
                src={award.imgSrc}
                alt={t(award.title)}
                width={100}
                height={100}
              />
            </div>
            <div className="invitation-content">
              <div className="title">{t(award.title)}</div>
              <div className="value">{t(award.value)}</div>
              <div className="received">
                {t(award.received)} {t('people received')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AwardsIssued
