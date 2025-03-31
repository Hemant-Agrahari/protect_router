import {
  Box,
  Checkbox,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useTheme } from '@mui/material/styles'
import SwipeableViews from 'react-swipeable-views'
import { autoPlay } from 'react-swipeable-views-utils'
import { useFetch } from '@/services'
import { useAppSelector } from '@/redux/hooks'
import PackageDataType from '@/types/packageData'
import { useTranslation } from 'react-i18next'
import { GetMethod, PostMethod } from '@/services/fetchAPI'
import { logError, removeExtraSymbols } from '@/utils'
import { useFormik } from 'formik'
import * as yup from 'yup'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
import { CustomOutlinedInput } from '../common'
import { useRouter } from 'next/router'

const AutoPlaySwipeableViews = autoPlay(SwipeableViews)

type PackageType = {
  depositPackage: PackageDataType[]
  promotionPackage: PackageDataType[]
  promotion: Boolean
}

const Wallet_DepositModal = () => {
  const user = useAppSelector((state) => state.user.user)
  const { t } = useTranslation()
  const { data } = useFetch<PackageType>(`depositPackage?userId=${user?._id}`)
  const theme = useTheme()
  const [activeStep, setActiveStep] = useState(0)
  const [promotionCheck, setPromotionCheck] = useState(false) // State to track deposit amount
  const [coinType, setCoinType] = useState([])
  const router = useRouter()

  const images = [
    {
      label: 'San Francisco – Oakland Bay Bridge, United States',
      imgPath: '/assets/images/GetnewBanner.png',
    },
    {
      label: 'Bird',
      imgPath: '/assets/images/GetnewBanner.png',
    },
    {
      label: 'Bali, Indonesia',
      imgPath: '/assets/images/GetnewBanner.png',
    },
    {
      label: 'Goč, Serbia',
      imgPath: '/assets/images/GetnewBanner.png',
    },
  ]

  const validationSchema = yup.object({
    package: yup.string().required(`${t('Please select a package')}`),
    currency: yup.string().required(`${t('Please select a current')}`),
    currencySelect: yup.string(),
  })

  const formik = useFormik({
    initialValues: {
      promotionId: '',
      packageId: '',
      package: '',
      currency: '',
      currencySelect: 'default',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const currency_id: any = coinType.find(
        (coin: any) => coin.currency_name === values.currencySelect,
      )

      const payload = {
        userId: user?._id,
        promotionId: values?.promotionId,
        packageId: values?.packageId,
        amount: values.package,
        currency_id: currency_id?._id,
        currencyName: values?.currencySelect,
        convertedAmount: values.currency,
      }

      try {
        const result: any = await PostMethod('postDeposit', payload)

        if (result.data.status !== 'success') {
          throw new Error('post deposit api is not working')
        }

        if (result.data.status === 'success') {
          router.push(result.data.data.paymentLink)
        }
      } catch (error) {
        logError(error)
      }
    },
  })

  // Function to update selected deposit amount
  const handleDepositSelection = (
    id: string,
    amount: number,
    packageType: string,
  ) => {
    formik.setFieldValue('package', amount)

    if (packageType === 'promotion') {
      formik.setFieldValue('promotionId', id)
      formik.setFieldValue('packageId', '')
    } else if (packageType === 'package') {
      formik.setFieldValue('promotionId', '')
      formik.setFieldValue('packageId', id)
    }
  }

  const handleStepChange = (step: number) => {
    setActiveStep(step)
  }

  const fetchCoinType = async () => {
    try {
      const result: any = await GetMethod('getCoins')

      if (result.data.message !== 'Successfully Fetched') {
        throw new Error('get coin type api is not working')
      }

      if (result.data.currencyDetail.length > 0) {
        setCoinType(result.data.currencyDetail)
      }
    } catch (error) {
      logError(error)
    }
  }

  const handleCurrencyCalculation = async () => {
    try {
      const result: any = await PostMethod('getRates', {
        currency_name: formik.values.currencySelect,
      })

      if (result.status !== 200) {
        throw new Error('get currency rate api is not working')
      }

      if (result.data.result.value) {
        formik.setFieldValue(
          'currency',
          Number(formik.values.package) * result.data.result.value,
        )
      }
    } catch (error) {
      logError(error)
    }
  }

  useEffect(() => {
    if (formik.values.currencySelect === 'default') {
      fetchCoinType()
    }

    if (formik.values.currencySelect !== 'default') {
      formik.setFieldValue('currencySelect', 'default')
      formik.setFieldValue('currency', '')
    }
  }, [formik.values.package])

  useEffect(() => {
    if (formik.values.currencySelect !== 'default') {
      handleCurrencyCalculation()
    }
  }, [formik.values.currencySelect])

  return (
    <>
      {' '}
      <form className="modal_form_signIn" onSubmit={formik.handleSubmit}>
        <div>
          <Box>
            <Typography
              color="white"
              align="center"
              sx={{
                fontWeight: '600',
              }}
            >
              {t('Deposit Amount')}
            </Typography>
          </Box>
          <Box>
            <OutlinedInput
              sx={{
                '& .MuiOutlinedInput-input': {
                  color: '#fff',
                  borderBottom: 'none', // Change to borderBottom to remove underline
                },
                '& .MuiOutlinedInput-input::placeholder': {
                  textAlign: 'right',
                },
                borderRadius: 10,
                marginTop: 2,
              }}
              disabled
              id="outlined-adornment-password"
              startAdornment={
                <InputAdornment position="start">
                  <p className="text-white fs-5 mt-3"> $</p>
                </InputAdornment>
              }
              fullWidth
              {...formik.getFieldProps('package')}
            />
            {formik.touched.package && formik.errors.package ? (
              <div className="text-danger mt-2 mx-2 fw-bold ">
                {formik.errors.package}
              </div>
            ) : null}
          </Box>

          {/* Deposit Packages */}
          <h5 className="mt-4" style={{ color: '#fff' }}>
            {t('Deposit Packages')}
          </h5>

          <div className="deposit-bonus">
            {/* Map through deposit packages and render links */}
            {!data?.result?.depositPackage?.length ? (
              <h6 className="text-warning">{t('No Package Found')}</h6>
            ) : (
              data?.result?.depositPackage
                ?.sort((a, b) => a?.amount - b?.amount)
                ?.map((item) => (
                  <div
                    className="wallet_sec_other"
                    onClick={() => {
                      handleDepositSelection(item?._id, item?.amount, 'package')
                    }}
                    key={item?.amount}
                  >
                    <div className="depo-amount" style={{ cursor: 'pointer' }}>
                      <span> $</span>
                      {item?.amount}
                    </div>
                    {
                      <div className="bonus-percentage">
                        +{item?.bonus}% {t('Bonus')}
                      </div>
                    }
                    <div className="hot">{item?.tag}</div>
                  </div>
                ))
            )}
          </div>

          {/* Promotion package */}
          {!promotionCheck && data?.result?.promotionPackage.length ? (
            <>
              {' '}
              <h5 className="mt-2" style={{ color: '#fff' }}>
                {t('Promotion Packages')}
              </h5>
              <div className="deposit-bonus">
                {!data?.result?.promotionPackage?.length ? (
                  <h6 className="text-warning">{t('No Package Found')}</h6>
                ) : (
                  data?.result?.promotionPackage?.map((item) => (
                    <div
                      className="wallet_sec_other"
                      onClick={() => {
                        handleDepositSelection(
                          item?._id,
                          item?.depositAmount,
                          'promotion',
                        )
                      }}
                      key={item?.depositAmount}
                    >
                      <div
                        className="depo-amount"
                        style={{ cursor: 'pointer' }}
                      >
                        <span> $</span>
                        {item?.depositAmount}
                      </div>
                      {!promotionCheck && (
                        <div className="bonus-percentage">
                          +{item?.bonusPercentage}% {t('Bonus')}
                        </div>
                      )}
                      <div className="hot">{item?.maximumBonus}</div>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : null}

          {/* Caraosel  =========== */}
          {!promotionCheck && data?.result?.promotionPackage.length ? (
            <Box className="cashBack-slider">
              <AutoPlaySwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={activeStep}
                onChangeIndex={handleStepChange}
                enableMouseEvents
              >
                {images.map((step, index) => (
                  <div key={step.label}>
                    {Math.abs(activeStep - index) <= 2 ? (
                      <Box
                        component="img"
                        sx={{
                          height: 140,
                          display: 'block',
                          overflow: 'hidden',
                          width: '100%',
                        }}
                        src={step.imgPath}
                        alt={t(step.label)}
                      />
                    ) : null}
                  </div>
                ))}
              </AutoPlaySwipeableViews>
            </Box>
          ) : null}

          <Box className=" mt-3 white-input">
            <Select
              fullWidth
              startAdornment={
                <InputAdornment position="start">
                  <p className="text-white fs-5 mt-3"> $</p>
                </InputAdornment>
              }
              sx={{
                '& .MuiSelect-select': {
                  textAlign: 'left',
                },
              }}
              {...formik.getFieldProps('currencySelect')}
            >
              <MenuItem value="default">{t('Select currency')}</MenuItem>
              {Array.isArray(coinType) && coinType.length > 0
                ? coinType.map((coin: any, index) => {
                    return (
                      <MenuItem value={coin?.currency_name} key={index}>
                        {removeExtraSymbols(coin.currency_name)}
                      </MenuItem>
                    )
                  })
                : null}
            </Select>
          </Box>

          <Box>
            <CustomOutlinedInput
              className="mt-4"
              id="input-with-icon-textfield"
              placeholder={t('Coin')}
              fullWidth
              readOnly={true}
              {...formik.getFieldProps('currency')}
              startAdornment={
                <InputAdornment position="start">
                  <CurrencyExchangeIcon />
                </InputAdornment>
              }
            />
            {formik.touched.currency && formik.errors.currency && (
              <div style={{ color: 'red' }}>{formik.errors.currency}</div>
            )}
          </Box>

          {data?.result?.promotionPackage?.length ? (
            <div className="doNot_div mt-4">
              <span>
                <Checkbox
                  checked={promotionCheck}
                  onChange={() => setPromotionCheck(!promotionCheck)}
                  sx={{
                    '& .MuiSvgIcon-root': {
                      fontSize: 30,
                      color: 'gray',
                    },
                  }}
                />
              </span>

              <span className="doNotText">
                {t('Do not participate in promotions')}
              </span>
            </div>
          ) : (
            ''
          )}

          <div className="depositBtn">
            <button className="modal-btn-CPF mt-3 fw-semibold" type="submit">
              {t('Deposit')}
            </button>
          </div>
        </div>
      </form>
    </>
  )
}

export default Wallet_DepositModal
