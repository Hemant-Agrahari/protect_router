import Image from 'next/image'
import CashbackImg from '../../../public/assets/images/cashback.png'
import { useAppSelector } from '@/redux/hooks'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'

const Cashback = () => {
  const user = useAppSelector((state) => state.user.user)
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <>
      {/* CASHBACK Div ======= */}
      <div className="row mt-4 my-1 cashBackDiv mx-0" id="cashBack">
        <div className="col-6 col-sm-6 col-md-6 col-lg-3 d-none d-lg-block d-md-block ">
          <div className="d-flex justify-content-center align-items-center">
            <Image src={CashbackImg} alt={t('Cashback')} />
          </div>
        </div>
        <div className="col-6 col-sm-6 col-md-6 col-lg-3 d-lg-none d-sm-block d-md-none">
          <Image
            src={CashbackImg}
            alt={t('Cashback')}
            className="vipCashImage"
          />
        </div>

        <div className="col-6 col-sm-6 col-md-6 col-lg-3">
          <button className="cashback_button1">
            <div className="cash_btn">{t('Original Games')}</div>
            <div
              style={{
                color: '#FFC635',
                marginTop: '5px',
                marginBottom: '5px',
              }}
            >
              {user?.origanlCashBack ? user?.origanlCashBack : 0}%
            </div>
          </button>
        </div>
        <div className="col-6 col-sm-6 col-md-6 d-lg-none">
          <button className="cashback_buttonBonus1">
            {' '}
            {t('Original Games')}
          </button>
        </div>
        <div className="col-6 col-sm-6 col-md-6 col-lg-3">
          <button className="cashback_button1">
            <div className="cash_btn">{t('Live Casino')}</div>
            <div
              style={{
                color: '#FFC635',
                marginTop: '5px',
                marginBottom: '5px',
              }}
            >
              {user?.liveCasino ? user?.liveCasino : 0}%
            </div>
          </button>
        </div>
        <div className="col-6 col-sm-6 col-md-6 col-lg-3 d-none d-lg-block d-md-block">
          <button
            className="cashback_buttonBonus2"
            onClick={() => router.push('#vip-slider')}
          >
            <div className="cash-btn">{t('Bonus')}</div>
          </button>
        </div>

        <div
          className="col-12 col-sm-12 col-md-12 col-lg-3 mt-2 d-lg-none d-sm-flex justify-content-center d-md-none"
          style={{ display: 'flex' }}
        >
          <button className="cashback_buttonBonus2">{t('Bonus')}</button>
        </div>
      </div>
      {/* CASHBACK Cards ======= */}
      <div className="row mt-4">
        {[
          {
            number: '01',
            text: 'Place a bet on an original or LIVE game and the MONEY BACK engine will automatically calculate the return value based on your VIP level as you enjoy the game.',
          },
          {
            number: '02',
            text: 'The cash back mechanism will be settled on account balance at 0:00 based on your bets placed throughout the day.',
          },
          {
            number: '03',
            text: 'The more you play, the higher your money back, for example your [VIP1] cumulative level bet of $10,000 will bring you a $20 back bonus. (The return for VIP10 is $50)',
          },
        ].map((card, index) => (
          <div key={index} className="col-12 col-sm-12 col-md-6 col-lg-4 mb-3">
            <div className="digit p-3" style={{ height: '100%' }}>
              <h1 className={`digit_check1`}>{card.number}</h1>
              <h6
                className="fw-normal px-2 fs-6 lh-base"
                style={{ height: '100%', overflow: 'hidden' }}
              >
                {t(card.text)}
              </h6>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default Cashback
