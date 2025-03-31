import {
  Box,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import { useFetch } from '@/services';
import { useAppSelector } from '@/redux/hooks';
import PackageDataType from '@/types/packageData';
import { useTranslation } from 'react-i18next';
import { GetMethod, PostMethod } from '@/services/fetchAPI';
import { logError, removeExtraSymbols } from '@/utils';
import { useFormik } from 'formik';
import { z } from 'zod';
import { withZodSchema } from 'formik-validator-zod';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import { CustomButton, CustomMuiOutlinedInput } from '@/component/common';
import { validationMsg } from '@/utils/validationMsg';
import { useRouter } from 'next/router';
import FormErrorMessage from '@/component/common/FormErrorMessage';
import CustomMuiCheckbox from '@/component/common/mui-component/CustomMuiCheckbox';
import CustomMuiTypography from '../common/mui-component/CustomMuiTypography';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

type PackageType = {
  depositPackage: PackageDataType[];
  promotionPackage: PackageDataType[];
  promotion: Boolean;
};

const Wallet_DepositModal = () => {
  const user = useAppSelector((state) => state.user.user);
  const { t } = useTranslation();
  const { data } = useFetch<PackageType>(`depositPackage?userId=${user?._id}`);
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [promotionCheck, setPromotionCheck] = useState(false); // State to track deposit amount
  const [coinType, setCoinType] = useState([]);
  const router = useRouter();

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
  ];

  const validationSchema = z.object({
    promotionId: z.string().optional(),
    packageId: z.string().optional(),
    package: z.string().nonempty(t(validationMsg.packages.require)),
    currency: z.string().nonempty(t(validationMsg.currency.require)),
    currencySelect: z.string(),
  });

  type ValidationSchemaType = z.infer<typeof validationSchema>;

  const formik = useFormik<ValidationSchemaType>({
    initialValues: {
      promotionId: '',
      packageId: '',
      package: '',
      currency: '',
      currencySelect: 'default',
    },
    validate: withZodSchema(validationSchema),
    onSubmit: async (values) => {
      const currency_id: any = coinType.find(
        (coin: any) => coin.currency_name === values.currencySelect,
      );

      const payload = {
        userId: user?._id,
        promotionId: values?.promotionId,
        packageId: values?.packageId,
        amount: values.package,
        currency_id: currency_id?._id,
        currencyName: values?.currencySelect,
        convertedAmount: values.currency,
      };

      try {
        const result: any = await PostMethod('postDeposit', payload);

        if (result.data.status !== 'success') {
          throw new Error('post deposit api is not working');
        }

        if (result.data.status === 'success') {
          router.push(result.data.data.paymentLink);
        }
      } catch (error) {
        logError(error);
      }
    },
  });

  // Function to update selected deposit amount
  const handleDepositSelection = (
    id: string,
    amount: number,
    packageType: string,
  ) => {
    formik.setFieldValue('package', String(amount));

    if (packageType === 'promotion') {
      formik.setFieldValue('promotionId', id);
      formik.setFieldValue('packageId', '');
    } else if (packageType === 'package') {
      formik.setFieldValue('promotionId', '');
      formik.setFieldValue('packageId', id);
    }
  };

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  const fetchCoinType = async () => {
    try {
      const result: any = await GetMethod('getCoins');

      if (result.data.message !== 'Successfully Fetched') {
        throw new Error('get coin type api is not working');
      }

      if (result.data.currencyDetail.length > 0) {
        setCoinType(result.data.currencyDetail);
      }
    } catch (error) {
      logError(error);
    }
  };

  const handleCurrencyCalculation = async () => {
    try {
      const result: any = await PostMethod('getRates', {
        currency_name: formik.values.currencySelect,
      });

      if (result.status !== 200) {
        throw new Error('get currency rate api is not working');
      }

      if (result.data.result.value) {
        formik.setFieldValue(
          'currency',
          String(Number(formik.values.package) * result.data.result.value),
        );
      }
    } catch (error) {
      logError(error);
    }
  };

  useEffect(() => {
    if (formik.values.currencySelect === 'default') {
      fetchCoinType();
    }

    if (formik.values.currencySelect !== 'default') {
      formik.setFieldValue('currencySelect', 'default');
      formik.setFieldValue('currency', '');
    }
  }, [formik.values.package]);

  useEffect(() => {
    if (formik.values.currencySelect !== 'default') {
      handleCurrencyCalculation();
    }
  }, [formik.values.currencySelect]);

  return (
    <>
      <form className="modal_form_signIn" onSubmit={formik.handleSubmit}>
        <div>
          <Box>
            <CustomMuiTypography
              color="white"
              align="center"
              className="font-weight-600"
              title= {t('Deposit Amount')}
            />
          </Box>
          <Box>
            <OutlinedInput
              className="wallet-outlined-input"
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

            <FormErrorMessage
              error={formik.errors.package}
              touched={formik.touched.package}
            />
          </Box>

          {/* Deposit Packages */}
          <h5 className="mt-4 text-white">{t('Deposit Packages')}</h5>

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
                      handleDepositSelection(
                        item?._id,
                        item?.amount,
                        'package',
                      );
                    }}
                    key={item?.amount}
                  >
                    <div className="depo-amount cursor-pointer">
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
              <h5 className="mt-2 text-white">{t('Promotion Packages')}</h5>
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
                        );
                      }}
                      key={item?.depositAmount}
                    >
                      <div className="depo-amount cursor-pointer">
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
                        className="wallet-deposit-image-caraosel"
                        component="img"
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
              className="select-currency-wallet-dropdown"
              fullWidth
              startAdornment={
                <InputAdornment position="start">
                  <p className="text-white fs-5 mt-3"> $</p>
                </InputAdornment>
              }
              {...formik.getFieldProps('currencySelect')}
            >
              <MenuItem value="default">{t('Select currency')}</MenuItem>
              {Array.isArray(coinType) && coinType.length > 0
                ? coinType.map((coin: any, index) => {
                    return (
                      <MenuItem value={coin?.currency_name} key={index}>
                        {removeExtraSymbols(coin.currency_name)}
                      </MenuItem>
                    );
                  })
                : null}
            </Select>
          </Box>

          <Box>
            <CustomMuiOutlinedInput
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
            <FormErrorMessage
              error={formik.errors.currency}
              touched={formik.touched.currency}
            />
          </Box>

          {data?.result?.promotionPackage?.length ? (
            <div className="doNot_div mt-4">
              <span>
                <CustomMuiCheckbox
                  className="wallet-participate-checkbox"
                  checked={promotionCheck}
                  onChange={() => setPromotionCheck(!promotionCheck)}
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
            <CustomButton
              className="modal-btn-CPF mt-3 fw-semibold"
              type="submit"
            >
              {t('Deposit')}
            </CustomButton>
          </div>
        </div>
      </form>
    </>
  );
};

export default Wallet_DepositModal;
