import { Button, ClickAwayListener, Slider } from '@mui/material'
import React, { useState } from 'react'
import { BootstrapTooltip } from '../common'
import { HelpOutlineOutlined } from '@mui/icons-material'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
const useStyles = makeStyles({
  sliderRoot: {
    // Hide marks' labels
    '& .MuiSlider-markLabel': {
      display: 'none',
      color: 'red !important',
    },
  },
})
const CommissionSection = () => {
  const classes = useStyles()
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const [secondTooltipOpen, setSecondTooltipOpen] = useState(false)
  const [calculateSliderValue, setCalculateSliderValue] = useState(2)
  const { t } = useTranslation()

  const marks = []
  for (let value = 5; value <= 20000; value += 5) {
    marks.push({ value, label: `${value}` })
  }
  const handleCalculateSliderChange = (
    event: Event,
    value: number | number[],
  ) => {
    setCalculateSliderValue(value as number)
  }
  const handleSecTooltipClose = () => {
    setSecondTooltipOpen(false)
  }
  const handleSecTooltipOpen = () => {
    setSecondTooltipOpen(true)
  }
  const handleTooltipClose = () => {
    setTooltipOpen(false)
  }
  const handleTooltipOpen = () => {
    setTooltipOpen(true)
  }
  const getInvitationValue = (value: number) => {
    if (value >= 1 && value <= 20) {
      return 5
    } else if (value > 20 && value <= 40) {
      return 10
    } else if (value > 40 && value <= 60) {
      return 15
    } else if (value > 60 && value <= 80) {
      return 20
    } else if (value > 80 && value <= 100) {
      return 25
    }
    // Default value (should not happen if slider is properly configured)
    return 0
  }

  // Get the invitation value based on current slider value
  const invitationValue = getInvitationValue(calculateSliderValue)
  return (
    <div className="get-commission">
      <div className="referalPageSection-title">
        {t('How To Get Commission On Your Bets')}{' '}
        <ClickAwayListener onClickAway={handleTooltipClose}>
          <BootstrapTooltip
            disableTouchListener
            onClose={handleTooltipClose}
            open={tooltipOpen}
            arrow
            title={<span>{t('Betting Commissions')}</span>}
          >
            <Button className="Buttonooltip-btn" onClick={handleTooltipOpen}>
              <HelpOutlineOutlined />
            </Button>
          </BootstrapTooltip>
        </ClickAwayListener>
      </div>
      <div className="referalPageSection-titleText">
        {t('LongTerm Income')}{' '}
      </div>
      <div className="getCommission-col">
        <div className="getCommission-colTop">
          <div className="getCommission-colTop-content">
            <div className="bonus-rules">
              <div className="bonus-rules-text">{t(`Bonus Rules`)}</div>
              <ul className="bonus-rules-ul">
                <li>{t('The proportions of the 3 levels are as follows')}:</li>
                <li>
                  {t('- Level')} 1:
                  <span style={{ color: '#FFCD3C' }}> 50%</span> Platform
                  {t('Platform Advantage')}
                </li>
                <li>
                  {t('- Level')} 2:
                  <span style={{ color: '#FFCD3C' }}> 15%</span> Platform
                  {t('Platform Advantage')}
                </li>
                <li>
                  {t('- Level')} 3:<span style={{ color: '#FFCD3C' }}> 5%</span>{' '}
                  {t('Platform Advantage')}
                </li>
              </ul>
            </div>
            <div className="long-term-income">{t('Commission Income')}</div>
          </div>
          <div className="getCommission-colTop-img">
            <img src={'/assets/images/get-commission-top.png'} alt="" />
          </div>
        </div>
        <div className="getCommission-colBotm">
          <div className="leval-calculator-col">
            <img src={'/assets/images/profile-level.png'} alt="" />
          </div>
          <div className="leval-calculator-col income-calculator">
            <div className="income-title">
              {t('Static Calculator Text')}
              <ClickAwayListener onClickAway={handleSecTooltipClose}>
                <BootstrapTooltip
                  disableTouchListener
                  onClose={handleSecTooltipClose}
                  open={secondTooltipOpen}
                  arrow
                  title={<span>{t('Earnings Calculation')}</span>}
                >
                  <Button
                    className="tooltip-btn"
                    onClick={handleSecTooltipOpen}
                  >
                    <HelpOutlineOutlined />
                  </Button>
                </BootstrapTooltip>
              </ClickAwayListener>
            </div>
            <div className="calculat-value">
              $ <span>{invitationValue}</span>
            </div>
            <div className="invite-user">
              {`${t('Invite')} ${calculateSliderValue} ${t('Users assets Expected annual income to be earned')}`}
            </div>

            <div className="calculat-slider">
              <Slider
                color="warning"
                value={calculateSliderValue}
                onChange={handleCalculateSliderChange}
                aria-label="Custom marks"
                step={null}
                marks={marks}
                classes={{ root: classes.sliderRoot }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommissionSection
