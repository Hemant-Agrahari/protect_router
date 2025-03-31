// External dependencies
import { useState } from 'react';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { withZodSchema } from 'formik-validator-zod';
import { z } from 'zod';
import { Box, IconButton, InputAdornment, Typography } from '@mui/material';
import { Email, Https, Visibility, VisibilityOff } from '@mui/icons-material';
import RedeemIcon from '@mui/icons-material/Redeem';
import { CustomMuiOutlinedInput } from '@/component/common';
import { useAppDispatch } from '@/redux/hooks';
import { setUser } from '@/redux/user/userReducer';
import { CustomButton } from '@/component/common';
import { logError } from '@/utils';
import { useTranslation } from 'react-i18next';
import FormErrorMessage from '@/component/common/FormErrorMessage';
import { validationMsg } from '@/utils/validationMsg';
import { passwordRegex } from '@/utils/regex';
import CustomMuiCheckbox from '@/component/common/mui-component/CustomMuiCheckbox';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useSignUpMutation } from '@/redux/user/userSlice';
import CustomMuiTypography from '../common/mui-component/CustomMuiTypography';
import { v4 as uuidv4 } from 'uuid';

const SignIn = ({
  handleCloseLoginModal,
}: {
  handleCloseLoginModal: () => void;
}) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const searchParams = new URLSearchParams(document.location.search);
  const referralCode = searchParams?.get('referralcode');
  const { t } = useTranslation();
  const [loginService, { isLoading }] = useSignUpMutation();

  // Define validation schema using zod
  const validationSchema = z.object({
    username: z
      .string()
      .nonempty(t(validationMsg.username.require))
      .min(3, { message: t(validationMsg.username.min) }),
    email: z
      .string()
      .email(`${t(validationMsg.email.invalidEmail)}`)
      .nonempty(t(validationMsg.email.require)),
    password: z
      .string()
      .nonempty(t(validationMsg.password.require))
      .regex(passwordRegex, t(validationMsg.password.match))
      .min(6, { message: t(validationMsg.password.min) })
      .max(20, { message: t(validationMsg.password.max) }),
    referralCode: z.string().optional(),
    terms: z.boolean().refine((val) => val === true, {
      message: t(validationMsg.termsConditions.require),
    }),
  });

  type ValidationSchemaType = z.infer<typeof validationSchema>;
  const formik = useFormik<ValidationSchemaType>({
    initialValues: {
      username: '',
      email: '',
      password: '',
      referralCode: referralCode ? referralCode : '',
      terms: false,
    },
    validate: withZodSchema(validationSchema),
    onSubmit: async (values) => {
      try {
        const obj = {
          userName: values.username,
          email: values.email,
          password: values.password,
          referralCode: values.referralCode || '',
          isAcceptTNC: values.terms,
          deviceToken: uuidv4(),
        };
        const res = await loginService(obj).unwrap();

        if (res?.status === 'success') {
          handleCloseLoginModal();
          dispatch(setUser(res.data));
          toast.success(res.message);
          formik.resetForm();
        } else {
          toast.error(res?.message);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
          logError(error);
        }
      }
    },
  });

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  return (
    <form className="mt-5" onSubmit={formik.handleSubmit}>
      <div>
        <Box>
          <CustomMuiOutlinedInput
            placeholder={t('Username')}
            startAdornment={
              <InputAdornment position="start">
                <AccountCircleIcon className="text-white" />
              </InputAdornment>
            }
            autoComplete="off"
            fullWidth
            {...formik.getFieldProps('username')}
          />
          <FormErrorMessage
            error={formik.errors.username}
            touched={formik.touched.username}
          />
        </Box>
        <Box>
          <CustomMuiOutlinedInput
            className="mt-4"
            placeholder={t('E-mail')}
            startAdornment={
              <InputAdornment position="start">
                <Email className="text-white" />
              </InputAdornment>
            }
            autoComplete="off"
            fullWidth
            {...formik.getFieldProps('email')}
          />
          <FormErrorMessage
            error={formik.errors.email}
            touched={formik.touched.email}
          />
        </Box>
        <Box>
          <CustomMuiOutlinedInput
            className="mt-4"
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="off"
            placeholder={t('Password')}
            startAdornment={
              <InputAdornment position="start">
                <Https className="text-white" />
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="start">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword((show) => !show)}
                  onMouseDown={() => handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? (
                    <VisibilityOff className="text-white" />
                  ) : (
                    <Visibility className="text-white" />
                  )}
                </IconButton>
              </InputAdornment>
            }
            fullWidth
            {...formik.getFieldProps('password')}
          />
          <FormErrorMessage
            error={formik.errors.password}
            touched={formik.touched.password}
          />
        </Box>
        <Box>
          <CustomMuiOutlinedInput
            className="mt-4"
            id="input-with-icon-textfield"
            placeholder={t('Referral code (Optional)')}
            fullWidth
            readOnly={referralCode && referralCode.length > 0 ? true : false}
            disabled={
              formik.values.referralCode &&
              formik.values.referralCode.length > 0
                ? true
                : false
            }
            {...formik.getFieldProps('referralCode')}
            startAdornment={
              <InputAdornment position="start">
                <RedeemIcon className="text-white" />
              </InputAdornment>
            }
          />
          <FormErrorMessage
            error={formik.errors.referralCode}
            touched={formik.touched.referralCode}
          />
        </Box>
        <Box className="d-flex align-items-center mt-2">
          <CustomMuiCheckbox
            className="border-none signin-checkbox-icon"
            {...formik.getFieldProps('terms')}
          />
          <div>
            <Typography variant="body1" className="ml-1 login-forgot-text">
              {t('I am at least 18 years old and have read and agree to the')}
              &nbsp;
              <u
                className="text-white cursor-pointer"
                onClick={() => {
                  handleCloseLoginModal();
                  router.push('/privacy-policy?tab=0');
                }}
              >
                {t('Terms & Conditions')}
              </u>
              &nbsp;{t('and')} &nbsp;
              <u
                className="text-white cursor-pointer"
                onClick={() => {
                  handleCloseLoginModal();
                  router.push('/privacy-policy?tab=1');
                }}
              >
                {t('Privacy Policy')}
              </u>
            </Typography>
          </div>
        </Box>
        <FormErrorMessage
          error={formik.errors.terms}
          touched={formik.touched.terms}
        />
        <Box className="d-flex align-items-center mt-1">
          <CustomMuiCheckbox
            className="promotion-checkbox-icon"
            defaultChecked
            {...formik.getFieldProps('promotions')}
          />
          <div>
            <CustomMuiTypography
              title={t('Receive promotions by Email')}
              variant="body1"
              className="mt-1 login-forgot-text"
            />
          </div>
        </Box>
        <CustomButton
          type="submit"
          className="modal-btn-losign mt-3"
          isLoading={isLoading}
        >
          {t('Sign up')}
        </CustomButton>
      </div>
    </form>
  );
};

export default SignIn;
