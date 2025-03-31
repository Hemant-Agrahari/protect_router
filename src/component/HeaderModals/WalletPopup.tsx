import React from 'react'
import { Box, Tab, Tabs, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { Dispatch, SetStateAction } from 'react'
import Wallet_DepositModal from './Wallet_DepositModal'
import Withdraw_modal1 from './Withdraw_modal1'
import { useTranslation } from 'react-i18next'

type WalletProps = {
  handleCloseWalletModal: () => void
  Wallet_Anchor: number
  setWallet_Anchor: Dispatch<SetStateAction<number>>
}

const WalletPopup: React.FC<WalletProps> = ({
  handleCloseWalletModal,
  Wallet_Anchor,
  setWallet_Anchor,
}) => {
  const { t } = useTranslation()

  const handleTabWallet_Anchor = (event: any, newTabIndex: any) => {
    setWallet_Anchor(newTabIndex)
  }

  return (
    <>
      <div
        className="modal-content"
        style={{ backgroundColor: 'var(--gray-700, #31001B)' }}
      >
        <div className="modal_closebtn">
          <button type="button" className="close_form_btn">
            <CloseIcon
              onClick={handleCloseWalletModal}
              className="closeBTN text-white"
            />
          </button>
        </div>
        <div className="modal-body p-0">
          <Typography
            variant="h5"
            align="center"
            color="white"
            sx={{ fontWeight: '700', mb: 4, mt: 2 }}
          >
            {t('Wallet')}
          </Typography>
          <Box className="TabLogin_Signup" sx={{ mb: 3 }}>
            <Tabs value={Wallet_Anchor} onChange={handleTabWallet_Anchor}>
              <Tab label={t('Deposit')} disableRipple={true} />
              <Tab label={t('Withdraw')} disableRipple={true} />
            </Tabs>
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
  )
}
export default WalletPopup
