import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setUserBalance } from '@/redux/user/userReducer'
import { PostMethod } from '@/services/fetchAPI'
import { handleKeyDown, logError } from '@/utils'
import {
  Box,
  InputAdornment,
  Typography,
  Select,
  MenuItem,
  TextField,
} from '@mui/material'
import { useFormik } from 'formik'
import Image from 'next/image'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import * as Yup from 'yup'

type Props = {
  handleCloseWalletModal: () => void
}

const Withdraw_modal1: React.FC<Props> = ({ handleCloseWalletModal }) => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const user = useAppSelector((state) => state.user.user)

  const formik = useFormik({
    initialValues: {
      walletAmount: '',
      currency: 'Tron',
      walletAddress: '',
    },
    validationSchema: Yup.object({
      walletAmount: Yup.number()
        .required(t('Please enter an amount'))
        .positive(t('Amount must be positive')),
      currency: Yup.string().required(t('Please select currency')),
      walletAddress: Yup.string()
        .min(12, t('Wallet address must be at least 12 characters long'))
        .max(60, t('Wallet address cannot be longer than 60 characters'))
        // .matches(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address')
        .required(t('Please enter wallet address')),
    }),
    onSubmit: (values) => {
      if (Number(values?.walletAmount) > Number(user?.chips)) {
        toast.error(t('Insufficient chips'))
        return
      }

      const params = {
        userId: user?._id,
        currencyType: values.currency,
        amount: values.walletAmount,
        walletAddress: values.walletAddress,
      }

      setLoading(true)

      PostMethod('withdrawChips', params)
        .then((res: any) => {
          setLoading(false)
          if (res.data.status === 'success') {
            toast.success(res.data.message)
            const updatedBalance = res.data.result.chips
            if (updatedBalance) {
              dispatch(setUserBalance(updatedBalance))
            }
            handleCloseWalletModal()
          } else {
            toast.error(res?.data?.message)
          }
        })
        .catch((err: any) => {
          toast.error(t('Something Went Wrong'))
          logError(err)
        })
    },
  })

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="withdraw-first">
        <Box className="px-1">
          <Typography color="white" sx={{ fontWeight: '600' }}>
            {t('Withdraw Amount')}
          </Typography>
        </Box>
        <Box className="fillInThe mb-3">
          <TextField
            onKeyDown={handleKeyDown}
            sx={{
              '& .MuiOutlinedInput-input::placeholder': {
                textAlign: 'right',
              },
            }}
            type="number"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <p className="text-white fs-5 mt-3">
                    {' '}
                    <Image
                      src={'/assets/images/coin.png'}
                      alt={t('coin')}
                      width={23}
                      height={23}
                    />
                  </p>
                </InputAdornment>
              ),
            }}
            fullWidth
            name="walletAmount"
            value={formik.values.walletAmount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.walletAmount && Boolean(formik.errors.walletAmount)
            }
            helperText={
              formik.touched.walletAmount && formik.errors.walletAmount
            }
          />
        </Box>
        <Box className="px-1">
          <Typography color="white" sx={{ fontWeight: '600' }}>
            {t('Choose Currency')}
          </Typography>
        </Box>
        <Box className="fillInThe mb-3 white-input">
          <Select
            value={formik.values.currency}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="currency"
            fullWidth
            sx={{
              '& .MuiSelect-select': {
                textAlign: 'left',
              },
            }}
          >
            <MenuItem value="Tron">{t('Tron')}</MenuItem>
            <MenuItem value="Trc20">{t('Trc20')}</MenuItem>
          </Select>
        </Box>
        <Box className="px-1">
          <Typography color="white" sx={{ fontWeight: '600' }}>
            {t('Wallet Address')}
          </Typography>
        </Box>
        <Box className="fillInThe">
          <TextField
            sx={{
              '& .MuiOutlinedInput-input::placeholder': {
                textAlign: 'right',
              },
            }}
            fullWidth
            name="walletAddress"
            value={formik.values.walletAddress}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.walletAddress &&
              Boolean(formik.errors.walletAddress)
            }
            helperText={
              formik.touched.walletAddress && formik.errors.walletAddress
            }
          />
        </Box>

        <div className="depositBtn">
          <button type="submit" className="modal-btn-withdraw mt-4">
            {loading ? t('Loading...') : t('Withdraw')}
          </button>
        </div>
      </div>
    </form>
  )
}

export default Withdraw_modal1
