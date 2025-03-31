import React from 'react'
import { useTranslation } from 'react-i18next'

const LeaderBoard = () => {
  const { t } = useTranslation()
  return (
    <div className="leaderboard-prize">
      <div className="leaderboardPrize-col">
        <div className="leaderboardPrize-title">{t('Leaderboard')}</div>
        <div className="leader-row">
          <div className="leader-col">
            <div className="leader-title">{t('Second Place')}</div>
            <img src="/assets/images/leaderTop-2.png" alt={t('Second Place')} />
            <div className="leader-user">User820769654</div>
            <div className="leader-price">$ 8413570</div>
          </div>
          <div className="leader-col">
            <div className="leader-title">{t('First Place')}</div>
            <img src="/assets/images/leaderTop-1.png" alt={t('First Place')} />
            <div className="leader-user">User720769654</div>
            <div className="leader-price">$ 17201880</div>
          </div>
          <div className="leader-col">
            <div className="leader-title">{t('Third Place')}</div>
            <img src="/assets/images/leaderTop-3.png" alt={t('Third Place')} />
            <div className="leader-user">User820769654</div>
            <div className="leader-price">$ 8413570</div>
          </div>
        </div>
      </div>
      <div className="leaderboardPrize-col">
        <div className="leaderboardPrize-title">{t('Who Won the Prize')}</div>
        <ul className="wonPrize-ul">
          <li>
            <div className="user">User738006430</div>
            <div className="receive">{t('Receive an invite bonus')}</div>
            <div className="prize">$ 15</div>
          </li>
          <li>
            <div className="user">User738006430</div>
            <div className="receive">{t('Receive an invite bonus')}</div>
            <div className="prize">$ 15</div>
          </li>
          <li>
            <div className="user">User738006430</div>
            <div className="receive">{t('Receive an invite bonus')}</div>
            <div className="prize">$ 15</div>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default LeaderBoard
