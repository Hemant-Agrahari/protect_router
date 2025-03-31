import React from 'react';
import { Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Dispatch, SetStateAction } from 'react';
import Wallet_DepositModal from './Wallet_DepositModal';
import Withdraw_modal1 from './Withdraw_modal1';
import { useTranslation } from 'react-i18next';
import { CustomButton } from '@/component/common';
import CustomMuiTab from '../common/mui-component/CustomMuiTab';
import CustomMuiTypography from '../common/mui-component/CustomMuiTypography';

type WalletProps = {
  handleCloseWalletModal: () => void;
  Wallet_Anchor: number;
  setWallet_Anchor: Dispatch<SetStateAction<number>>;
};

const WalletPopup: React.FC<WalletProps> = ({
  handleCloseWalletModal,
  Wallet_Anchor,
  setWallet_Anchor,
}) => {
  const { t } = useTranslation();

  const handleTabWallet_Anchor = (event: any, newTabIndex: any) => {
    setWallet_Anchor(newTabIndex);
  };

  return (
    <>
      <div className="modal-content wallet-popup-container wallet-popup-containe-color">
        <div className="modal_closebtn">
          <CustomButton type="button" className="close_form_btn">
            <CloseIcon
              onClick={handleCloseWalletModal}
              className="closeBTN text-white"
            />
          </CustomButton>
        </div>
        <div className="modal-body p-0">
          <CustomMuiTypography
            variant="h5"
            align="center"
            color="white"
            className="font-weight-700 mb-4 mt-2"
            title={t('Wallet')}
          />
          <Box className="TabLogin_Signup mb-3">
            <CustomMuiTab
              tabClassName="wallet-tab"
              tabsClassName="wallet-tabs"
              value={Wallet_Anchor}
              onChange={handleTabWallet_Anchor}
              tabLabels={[t('Deposit'), t('Withdraw')]}
              disableRipple={true}
            />
          </Box>
          <Box className="depoWithdro-tabContainer">
            {Wallet_Anchor === 0 && <Wallet_DepositModal />}
            {Wallet_Anchor === 1 && (
              <Withdraw_modal1
                handleCloseWalletModal={handleCloseWalletModal}
              />
            )}
          </Box>
        </div>
      </div>
    </>
  );
};
export default WalletPopup;
