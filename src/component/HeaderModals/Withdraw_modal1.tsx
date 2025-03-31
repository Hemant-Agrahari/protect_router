import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setUserBalance } from '@/redux/user/userReducer';
import { PostMethod } from '@/services/fetchAPI';
import { logError } from '@/utils';
import { Box, InputAdornment } from '@mui/material';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { CustomButton, CustomMuiOutlinedInput } from '@/component/common';
import CustomImage from '@/component/common/CustomImage';
import FormErrorMessage from '../common/FormErrorMessage';
import CustomMuiSelectDropdown from '@/component/common/mui-component/CustomMuiSelectDropdown';
import { z } from 'zod';
import { validationMsg } from '@/utils/validationMsg';
import { withZodSchema } from 'formik-validator-zod';
import CustomMuiTypography from '../common/mui-component/CustomMuiTypography';

type Props = {
  handleCloseWalletModal: () => void;
};

const Withdraw_modal1: React.FC<Props> = ({ handleCloseWalletModal }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const user = useAppSelector((state) => state.user.user);

  const validationSchema = z.object({
    walletAmount: z
      .string()
      .nonempty(t(validationMsg.amount.require))
      .refine((val) => !val.startsWith('-'), {
        message: t(validationMsg.amount.positive),
      })
      .refine((val) => Number.isInteger(Number(val)), {
        message: t(validationMsg.amount.integer),
      }),
    currency: z.string().nonempty(t(validationMsg.currency.require)),
    walletAddress: z
      .string()
      .min(12, t(validationMsg.wallet.min))
      .max(60, t(validationMsg.wallet.max))
      .nonempty(t(validationMsg.wallet.require)),
  });

  type ValidationSchemaType = z.infer<typeof validationSchema>;

  const formik = useFormik<ValidationSchemaType>({
    initialValues: {
      walletAmount: '',
      currency: 'Tron',
      walletAddress: '',
    },
    validate: withZodSchema(validationSchema),
    onSubmit: (values) => {
      if (Number(values?.walletAmount) > Number(user?.chips)) {
        toast.error(t('Insufficient chips'));
        return;
      }

      const params = {
        userId: user?._id,
        currencyType: values.currency,
        amount: values.walletAmount,
        walletAddress: values.walletAddress,
      };

      setLoading(true);

      PostMethod('withdrawChips', params)
        .then((res: any) => {
          setLoading(false);
          if (res.data.status === 'success') {
            toast.success(res.data.message);
            const updatedBalance = res.data.result.chips;
            if (updatedBalance) {
              dispatch(setUserBalance(updatedBalance));
            }
            handleCloseWalletModal();
          } else {
            toast.error(res?.data?.message);
          }
        })
        .catch((err: any) => {
          toast.error(t('Something Went Wrong'));
          logError(err);
        });
    },
  });

  const currencyOptions = [
    { value: 'Tron', label: t('Tron') },
    { value: 'Trc20', label: t('Trc20') },
  ];

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="withdraw-first">
        <Box className="px-1">
          <CustomMuiTypography
            title={t('Withdraw Amount')}
            className="with-draw-amount-text text-white font-weight-500"
          />
        </Box>
        <div className="mb-2">
          <Box className="fillInThe mb-3">
            <CustomMuiOutlinedInput
              startAdornment={
                <InputAdornment position="start">
                  <CustomImage
                    src="/assets/images/coin.png"
                    alt={t('coin')}
                    width={23}
                    height={23}
                  />
                </InputAdornment>
              }
              fullWidth
              {...formik.getFieldProps('walletAmount')}
            />
          </Box>
          <FormErrorMessage
            error={formik.errors?.walletAmount}
            touched={formik.touched?.walletAmount}
          />
        </div>
        <Box className="px-1">
          <CustomMuiTypography title={t('Choose Currency')} className="with-draw-amount-text text-white font-weight-500"/>
        </Box>
        <Box className="fillInThe mb-3 white-input">
          <CustomMuiSelectDropdown
            value={formik.values.currency}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="currency"
            fullWidth
            className="select-with-text-left"
            options={currencyOptions}
          />
        </Box>
        <Box className="px-1">
          <CustomMuiTypography title={t('Wallet Address')} className="with-draw-amount-text text-white font-weight-500" />
        </Box>
        <div className="mb-2">
          <Box className="fillInThe mb-3">
            <CustomMuiOutlinedInput
              fullWidth
              {...formik.getFieldProps('walletAddress')}
            />
          </Box>
          <FormErrorMessage
            touched={formik.touched?.walletAddress}
            error={formik.errors?.walletAddress}
          />
        </div>

        <div className="depositBtn">
          <CustomButton type="submit" className="modal-btn-withdraw mt-4">
            {loading ? t('Loading...') : t('Withdraw')}
          </CustomButton>
        </div>
      </div>
    </form>
  );
};

export default Withdraw_modal1;
