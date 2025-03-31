import {
  Button,
  ClickAwayListener,
  Input,
  InputAdornment,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { CustomMuiTooltip } from '@/component/common';
import { HelpOutlineOutlined } from '@mui/icons-material';
import { useAppSelector } from '@/redux/hooks';
import { useMutateData } from '@/services';
import InvitationDataType from '@/types/inviteData';
import { useTranslation } from 'react-i18next';
import { logError } from '@/utils';
import { copyToClipboard } from '@/utils/commonMethod';
import CustomImage from '../common/CustomImage';

const InvitePartner = () => {
  const user = useAppSelector((state) => state.user.user);
  const [inviteData, setInviteData] = useState<InvitationDataType>();
  const { mutateData } = useMutateData();
  const { t } = useTranslation();

  useEffect(() => {
    const fetch = async () => {
      await mutateData(`toInvite`, {
        body: { userId: user?._id },
      })
        .then((response) => {
          setInviteData(response?.data?.[0]);
        })
        .catch((error) => {
          logError(`Error fetching game data: ${error}`);
        });
    };
    if (user) {
      fetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const [tooltipOpen, setTooltipOpen] = useState(false);
  const handleTooltipClose = () => {
    setTooltipOpen(false);
  };
  const handleTooltipOpen = () => {
    setTooltipOpen(true);
  };

  return (
    <>
      <div className="partner-revenue toInviteTab">
        <div className="partner">
          <div className="revenue-row">
            <div className="revenue-col">
              <label>{t('Bonus Today')}</label>
              <span className="value">
                $
                {inviteData?.todayBonus?.toFixed(2)
                  ? inviteData?.todayBonus?.toFixed(2)
                  : 0}
              </span>
            </div>
            <div className="revenue-col">
              <label>{t('Yesterday Bonus')}</label>
              <span className="value">
                $
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
                    <Button title='Copy the invite Url'
                      disableRipple
                      variant="outlined"
                      onClick={() =>
                        copyToClipboard(
                          `${inviteData?.inviteUrl}`,
                          t('Link Copied!'),
                        )
                      }
                      className="border-0"
                    >
                      <CustomImage
                        src="/assets/images/userCopy-iocn.png"
                        alt="user-copy"
                        width={12}
                        height={12}
                      />
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
                    title='Copy the invite Code'
                      disableRipple
                      variant="outlined"
                      onClick={() =>
                        copyToClipboard(
                          `${inviteData?.inviteCode}`,
                          t('Code Copied!'),
                        )
                      }
                      className="border-0"
                    >
                      <CustomImage
                        src={'/assets/images/userCopy-iocn.png'}
                        alt={t('Image')}
                        width={12}
                        height={12}
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
                $
                {inviteData?.todayBonus?.toFixed(2)
                  ? inviteData?.todayBonus?.toFixed(2)
                  : 0}
              </span>
            </div>
            <div className="revenue-col">
              <label>{t('Yesterday Bonus')}</label>
              <span className="value">
                $
                {inviteData?.yesterdayBonus?.toFixed(2)
                  ? inviteData?.yesterdayBonus?.toFixed(2)
                  : 0}
              </span>
            </div>
          </div>
          <div className="revenue-targets">
            <div className="rt-title">{t('Monthly Revenue Targets')}</div>
            <CustomImage
              src="/assets/images/revenue-targets.png"
              alt={t('Image')}
              className="d-none d-sm-none d-md-block "
              width={100}
              height={100}
            />
            <div className="goal">
              <div className="goal-title">
                $ 246
                <ClickAwayListener onClickAway={handleTooltipClose}>
                  <CustomMuiTooltip
                    disableTouchListener
                    onClose={handleTooltipClose}
                    open={tooltipOpen}
                    arrow
                    title={<span>{t('Earnings description details')}</span>}
                  >
                    <Button className="tooltip-btn" onClick={handleTooltipOpen}>
                      <HelpOutlineOutlined />
                    </Button>
                  </CustomMuiTooltip>
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
  );
};

export default InvitePartner;
