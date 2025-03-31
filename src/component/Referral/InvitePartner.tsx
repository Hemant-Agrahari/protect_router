import { Button, ClickAwayListener, Input, InputAdornment } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { BootstrapTooltip } from '../common'
import { HelpOutlineOutlined } from '@mui/icons-material'
import { useAppSelector } from '@/redux/hooks'
import { useMutateData } from '@/services'
import InvitationDataType from '@/types/inviteData'
import { toast } from 'react-toastify'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import { logError } from '@/utils'

const InvitePartner = () => {
  const user = useAppSelector((state) => state.user.user)
  const [inviteData, setInviteData] = useState<InvitationDataType>()
  const { mutateData } = useMutateData()
  const { t } = useTranslation()

  useEffect(() => {
    const fetch = async () => {
      await mutateData(`toInvite`, {
        body: { userId: user?._id },
      })
        .then((response) => {
          setInviteData(response?.data?.[0])
        })
        .catch((error) => {
          logError(`Error fetching game data: ${error}`)
        })
    }
    if (user) {
      fetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const [tooltipOpen, setTooltipOpen] = useState(false)
  const handleTooltipClose = () => {
    setTooltipOpen(false)
  }
  const handleTooltipOpen = () => {
    setTooltipOpen(true)
  }

  const inviteUrlCopy = async () => {
    await navigator.clipboard.writeText(`${inviteData?.inviteUrl}`)
    toast.success(t('Link copied!'))
  }
  const inviteCodeCopy = async () => {
    await navigator.clipboard.writeText(`${inviteData?.inviteCode}`)
    toast.success(t('Code copied!'))
  }

  return (
    <>
      {' '}
      <div className="partner-revenue toInviteTab">
        <div className="partner">
          <div className="revenue-row">
            <div className="revenue-col">
              <label>Guest Users</label>
              <span className="value">
                {inviteData?.guestUser ? inviteData?.guestUser : 0}
              </span>
            </div>
            <div className="revenue-col">
              <label>Deposited Users</label>
              <span className="value">
                {inviteData?.depositedUser ? inviteData?.depositedUser : 0}
              </span>
            </div>
            <div className="revenue-col">
              <label>{t('Bonus Today')}</label>
              <span className="value">
                ${' '}
                {inviteData?.todayBonus?.toFixed(2)
                  ? inviteData?.todayBonus?.toFixed(2)
                  : 0}
              </span>
            </div>
            <div className="revenue-col">
              <label>{t('Yesterday Bonus')}</label>
              <span className="value">
                ${' '}
                {inviteData?.yesterdayBonus?.toFixed(2)
                  ? inviteData?.yesterdayBonus?.toFixed(2)
                  : 0}
              </span>
            </div>
          </div>
          <div className="partner-title">{t('Invite a Partner')}</div>
          <div className="invite-copy">
            <div className="formgroup">
              <label form="">{t('Invite URL')}:</label>
              <Input
                value={
                  inviteData?.inviteUrl
                    ? inviteData?.inviteUrl
                    : 'Invite URL not Generated'
                }
                disableUnderline={true}
                id=""
                endAdornment={
                  <InputAdornment position="end">
                    <Button
                      disableRipple
                      variant="outlined"
                      onClick={inviteUrlCopy}
                      style={{ border: 'none' }}
                    >
                      <img src={'/assets/images/userCopy-iocn.png'} alt="" />
                    </Button>
                  </InputAdornment>
                }
              />
            </div>
            <div className="formgroup">
              <label form="">{t('Copy the invite Code')}:</label>
              <Input
                value={
                  inviteData?.inviteCode
                    ? inviteData?.inviteCode
                    : 'invite Code Not Generated'
                }
                disableUnderline={true}
                id=""
                readOnly
                endAdornment={
                  <InputAdornment position="end">
                    <Button
                      disableRipple
                      variant="outlined"
                      onClick={inviteCodeCopy}
                      style={{ border: 'none' }}
                    >
                      <img
                        src={'/assets/images/userCopy-iocn.png'}
                        alt={t('Image')}
                      />
                    </Button>
                  </InputAdornment>
                }
              />
            </div>
          </div>
        </div>
        <div className="revenue">
          <div className="revenue-row">
            <div className="revenue-col">
              <label>{t('Today Bonus')}</label>
              <span className="value">
                ${' '}
                {inviteData?.todayBonus?.toFixed(2)
                  ? inviteData?.todayBonus?.toFixed(2)
                  : 0}
              </span>
            </div>
            <div className="revenue-col">
              <label>{t('Yesterday Bonus')}</label>
              <span className="value">
                ${' '}
                {inviteData?.yesterdayBonus?.toFixed(2)
                  ? inviteData?.yesterdayBonus?.toFixed(2)
                  : 0}
              </span>
            </div>
          </div>
          <div className="revenue-targets">
            <div className="rt-title">{t('Monthly Revenue Targets')}</div>
            <Image
              src={'/assets/images/revenue-targets.png'}
              alt={t('Image')}
              className="d-none d-sm-none d-md-block "
              width={100}
              height={100}
            />
            <Image
              src={'/assets/images/revenue-targets.png'}
              alt={t('Image')}
              className="d-sm-block d-lg-none d-md-none"
              height={50}
              width={55}
            />

            <div className="goal">
              <div className="goal-title">
                $ 246
                <ClickAwayListener onClickAway={handleTooltipClose}>
                  <BootstrapTooltip
                    disableTouchListener
                    onClose={handleTooltipClose}
                    open={tooltipOpen}
                    arrow
                    title={<span>{t('Earnings description details')}</span>}
                  >
                    <Button className="tooltip-btn" onClick={handleTooltipOpen}>
                      <HelpOutlineOutlined />
                    </Button>
                  </BootstrapTooltip>
                </ClickAwayListener>
              </div>
              <div className="goalText">
                {t('5 more people to invite before the goal is reached')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default InvitePartner
