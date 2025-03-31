import { LinearProgress } from '@mui/material';
import { LevelBadge } from '.';
import VIPImg from '../../../public/assets/images/levelVip.png';
import { useAppSelector } from '@/redux/hooks';
import { useFetch } from '@/services';
import { levelPageData } from './VipSlider';
import { useTranslation } from 'react-i18next';
import CustomImage from '../common/CustomImage';

const VipBonus = () => {
  const user = useAppSelector((state) => state.user.user)
  const { t } = useTranslation()

  const { data, isLoading } = useFetch<levelPageData>(
    `level?userId=${user?._id}`,
  )
  const depositPercentage = user?.vipLevelDetails?.depositPer
  const result =
    depositPercentage === undefined
      ? 0
      : depositPercentage >= 100
        ? 100
        : depositPercentage > 0
          ? parseFloat(depositPercentage.toFixed(2))
          : 0

  const betPercentage = user?.vipLevelDetails?.betPer

  const betResult =
    betPercentage === undefined
      ? 0
      : betPercentage >= 100
        ? 100
        : betPercentage > 0
          ? parseFloat(betPercentage.toFixed(2))
          : 0

  return (
    <div className="row">
      <div className="col-12 col-sm-12 col-md-12 col-lg-4 mb-2">
        <div className="p-sm-3 p-2 py-4 text-center vip-bounus-container">
          <h6>
            <span className="vip-heading-text">{t('YOUR VIP LEVEL IS')} </span>
            <span className="vip-heading-text-blue">
              {t('LEVEL')} {user?.level}
            </span>
          </h6>
          <div className="userLevel mt-3">
            <div className="vipImg">
              <CustomImage
                src={VIPImg}
                alt={`Vip ${t('image')}`}
                width={91}
                height={113}
              />
            </div>
          </div>
          <div className="hpMenu-top-vip">
            <div className="user-levelScore">
              <div className="userScore">
                <div className="userScore-col deposit">
                  <div className="title-value">
                    <div className="title">{t('Deposit')}</div>
                    <div className="amount">
                      <CustomImage
                        src="/assets/images/coin.png"
                        alt={t('coin')}
                        width={14}
                        height={14}
                        className="coin-margin"
                      />
                      {user?.vipLevelDetails?.currenDeposit?.toFixed(2)}/
                      <span
                      >
                        <CustomImage
                          src='/assets/images/coin.png'
                          alt={t('coin')}
                          width={14}
                          height={14}
                          className="coin-margin ms-1"
                        />
                        {user?.vipLevelDetails?.nextLevelDeposit}
                      </span>
                    </div>
                  </div>
                  <div className="process-score">
                    <LinearProgress
                      variant="determinate"
                      value={result || 0}
                      className='customLinearProgress'
                    />
                    <div className="progressValue"> {result}%</div>
                  </div>
                </div>
                <div className="userScore-col betAmount">
                  <div className="title-value">
                    <div className="title">{t('Bet Amount')}</div>
                    <div className="amount">
                      <CustomImage
                        src="/assets/images/coin.png"
                        alt={t('coin')}
                        width={14}
                        height={14}
                        className="coin-margin"
                      />
                      {user?.vipLevelDetails?.currentBet?.toFixed(2)}/
                      <span
                      >
                        <CustomImage
                          src="/assets/images/coin.png"
                          alt={t('coin')}
                          width={14}
                          height={14}
                          className="coin-margin ms-1"
                        />
                        {user?.vipLevelDetails?.nextLevelBet}
                      </span>
                    </div>
                  </div>
                  <div className="process-score">
                    <LinearProgress
                    className='bet-amount-linear-progress'
                      variant="determinate"
                      value={betResult || 0}
                    />
                    <div className="progressValue">{betResult}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <h6 className="text-white pb-2 f-16">
            {t('Upgrading to VIP')} {user?.level ? user?.level + 1 : 0 + 1}
            {t('also requires:')}
          </h6>
          <div className="row">
            <div className="col-6">
              <div className="ms-lg-3 upgrading-btn">
                <div className="font-weight-600 text-white">{t('Bet')}</div>
                <div className='font-weight-700 yellow-vivid-color mt-1'
                >
                  $
                  {user?.vipLevelDetails?.nextLevelBet
                    ? user?.vipLevelDetails?.nextLevelBet
                    : 0}
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="me-md-3 upgrading-btn">
                <div className="font-weight-600 text-white">{t('Deposit')}</div>
                <div
                  className="font-weight-700 yellow-vivid-color mt-2"
                >
                  $
                  {user?.vipLevelDetails?.nextLevelDeposit
                    ? user?.vipLevelDetails?.nextLevelDeposit
                    : 0}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*----------- SECOND FULL VIP BONUS PAGE DIV ---------- */}
      <div className="col-12 col-sm-12 col-md-12 col-lg-8 mb-2 ">
        <div className="fullvip-main p-1">
          <div
            className="p-sm-3 p-2 text-center vip-bounus-container"
          >
            <span className="font-weight-700 text-white font-size-17">
              {t('Full VIP Bonus')}
            </span>
            <div className="d-none d-md-block ">
              <div className="fullVipBonus-leval ">
                {isLoading ? (
                  <h3>{t('Loading...')}</h3>
                ) : (
                  data?.result?.levelData
                    ?.slice()
                    ?.sort((a, b) => a?.level - b?.level)
                    ?.map((item, level) => (
                      <LevelBadge
                        key={item?.level}
                        level={item?.level}
                        item={item}
                      />
                    ))
                )}
              </div>
            </div>
            <div className="d-sm-block d-md-none">
              <div className="fullVipBonus-leval flex-wrap">
                {isLoading ? (
                  <h3>{t('Loading...')}</h3>
                ) : (
                  data?.result?.levelData?.map((item, level) => (
                    <LevelBadge
                      key={item?.level}
                      level={item?.level}
                      item={item}
                    />
                  ))
                )}
              </div>
            </div>

            <div className="hpMenu-top-Fullvip">
              <div className="user-levelScore">
                <div className="userScore">
                  <div className="userScore-col deposit">
                    <div className="process-score">
                      <LinearProgress
                        variant="determinate"
                        value={
                          user?.level && data?.result?.levelData?.length
                            ? (user.level / data.result.levelData.length) * 100
                            : 0
                        }
                        className='linear-progress'
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="f-15 text-start text-white font-weight-400 lh-base"
            >
              {t('VIP level system')}
            </div>
            <div
              className="row mt-4"
            >
              <div className="col-6">
                <div
                  className="ms-lg-3 d-flex flex-column vip-bonus-amount"
                >
                  <div className='font-weight-700 text-white mb-1'
                  >
                    {t('Accumulated Bet Amount')}
                  </div>
                  <div className="font-weight-700 yellow-vivid-color">
                    $
                    {user?.vipLevelDetails?.currentBet
                      ? user?.vipLevelDetails?.currentBet.toFixed(2)
                      : 0}
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div
                  className="me-md-3 d-flex flex-column vip-bonus-amount"
                >
                  <div
                    className="font-weight-700 text-white mb-1"
                  >
                    {t('Accumulated Deposit Amount')}
                  </div>
                  <div className="font-weight-700 yellow-vivid-color">
                    $
                    {user?.vipLevelDetails?.currenDeposit
                      ? user?.vipLevelDetails?.currenDeposit.toFixed(2)
                      : 0}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VipBonus
