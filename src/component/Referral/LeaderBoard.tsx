import React from 'react';
import { useTranslation } from 'react-i18next';
import CustomImage from '../common/CustomImage';

const LeaderBoard = () => {
  const { t } = useTranslation()
  return (
    <div className="leaderboard-prize">
      <div className="leaderboardPrize-col">
        <div className="leaderboardPrize-title">{t('Leaderboard')}</div>
        <div className="leader-row">
          <div className="leader-col">
            <div className="leader-title">{t('Second Place')}</div>
            <CustomImage src="/assets/images/leaderTop-2.png" alt='Second Place' width={55} height={55}/>
            <div className="leader-user">User820769654</div>
            <div className="leader-price">$ 8413570</div>
          </div>
          <div className="leader-col">
            <div className="leader-title">{t('First Place')}</div>
            <CustomImage src="/assets/images/leaderTop-1.png" alt='First Place' width={55} height={55} />
            <div className="leader-user">User720769654</div>
            <div className="leader-price">$ 17201880</div>
          </div>
          <div className="leader-col">
            <div className="leader-title">{t('Third Place')}</div>
            <CustomImage src="/assets/images/leaderTop-3.png" alt='Third Place' width={55} height={55} />
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
