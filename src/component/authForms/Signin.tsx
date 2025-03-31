// External dependencies
import { useState } from 'react'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'

// Material-UI components
import {
  Box,
  Checkbox,
  IconButton,
  InputAdornment,
  Typography,
} from '@mui/material'
import { Email, Https, Visibility, VisibilityOff } from '@mui/icons-material'
import RedeemIcon from '@mui/icons-material/Redeem'
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined'

// Custom or local imports
import { CustomOutlinedInput } from '../common'
import { useAppDispatch } from '@/redux/hooks'
import { setUser } from '@/redux/user/userReducer'
import { useMutateData } from '@/services'
import { Button } from '../common'
import { logError } from '@/utils'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'

const SignIn = ({
  handleCloseLoginModal,
}: {
  handleCloseLoginModal: () => void
}) => {
  const router = useRouter()
  const { mutateData, isMutating } = useMutateData()
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const searchParams = new URLSearchParams(document.location.search)
  const referralCode = searchParams?.get('referralcode')
  const agentId = searchParams?.get('agentId')

  // Define validation schema using yup
  const validationSchema = yup.object({
    email: yup
      .string()
      .email(`${t('Invalid email address')}`)
      .required(`${t('Please Enter Your E-mail')}`)
      .matches(
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
        `${t('This is not a valid email format!')}`,
      ),
    password: yup
      .string()
      .required(`${t('Please enter a password')}`)
      .min(6, `${t('Password is too short - should be 6 chars minimum')}`)
      .max(20, `${t('Password is too long - should not more than 20 chars')}`)
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!%*?&])[A-Za-z\d@!%*?&]{6,20}$/,
        `${t('Password must include at least one uppercase letter, one lowercase letter, one number, and one special character')}`,
      ),
    inviteCode: yup.string().optional(),
    agentId: yup.string().optional(),
    terms: yup
      .bool()
      .oneOf([true], `${t('You need to accept the terms and conditions')}`),
    promotions: yup.boolean(),
  })

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      inviteCode: referralCode ? referralCode : '',
      agentId: agentId ? agentId : '',
      terms: false,
      promotions: true,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const obj = {
        email: values.email,
        password: values.password,
        invitationCode: values.inviteCode,
        recieveMail: values.promotions,
        agentId: values.agentId,
      }
      mutateData(`signUp`, {
        body: { ...obj },
      })
        .then((res) => {
          if (res?.status === 'success') {
            handleCloseLoginModal()
            dispatch(setUser(res.data?.[0]))
            toast.success(res.message)
            formik.resetForm()
          }
          toast.error(res.data.message)
          return
        })
        .catch((err) => {
          toast.error('Something Went Wrong')
          logError(err)
        })
    },
  })

  // ============ Password Function =======
  const [showPassword, setShowPassword] = useState(false)

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()
  }

  return (
    <form className="mt-5" onSubmit={formik.handleSubmit}>
      <div>
        <Box>
          <CustomOutlinedInput
            placeholder={t('E-mail')}
            startAdornment={
              <InputAdornment position="start">
                <Email sx={{ color: '#fff' }} />
              </InputAdornment>
            }
            autoComplete="off"
            fullWidth
            {...formik.getFieldProps('email')}
          />
          {formik.touched.email && formik.errors.email && (
            <div style={{ color: 'red', marginTop: '5px', fontWeight: 'bold' }}>
              {formik.errors.email}
            </div>
          )}
        </Box>
        <Box>
          <CustomOutlinedInput
            className="mt-4"
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="off"
            placeholder={t('Password')}
            startAdornment={
              <InputAdornment position="start">
                <Https sx={{ color: '#fff' }} />
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="start">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={() => handleMouseDownPassword}
                  edge="end"
                  sx={{ color: 'gray' }}
                >
                  {showPassword ? (
                    <VisibilityOff sx={{ color: '#fff' }} />
                  ) : (
                    <Visibility sx={{ color: '#fff' }} />
                  )}
                </IconButton>
              </InputAdornment>
            }
            fullWidth
            {...formik.getFieldProps('password')}
          />
          {formik.touched.password && formik.errors.password && (
            <div style={{ color: 'red', marginTop: '5px', fontWeight: 'bold' }}>
              {formik.errors.password}
            </div>
          )}
        </Box>
        <Box>
          <CustomOutlinedInput
            className="mt-4"
            id="input-with-icon-textfield"
            placeholder={t('Invitation Bonus Code (Optional)')}
            fullWidth
            readOnly={referralCode && referralCode.length > 0 ? true : false}
            disabled={
              formik.values.agentId && formik.values.agentId.length > 0
                ? true
                : false
            }
            {...formik.getFieldProps('inviteCode')}
            startAdornment={
              <InputAdornment position="start">
                <RedeemIcon sx={{ color: '#fff' }} />
              </InputAdornment>
            }
          />
          {formik.touched.inviteCode && formik.errors.inviteCode && (
            <div style={{ color: 'red' }}>{formik.errors.inviteCode}</div>
          )}
        </Box>
        <Box>
          <CustomOutlinedInput
            className="mt-4"
            id="input-with-icon-textfield"
            placeholder={t('Agent Id (Optional)')}
            fullWidth
            readOnly={agentId && agentId.length > 0 ? true : false}
            disabled={
              formik.values.inviteCode && formik.values.inviteCode.length > 0
                ? true
                : false
            }
            {...formik.getFieldProps('agentId')}
            startAdornment={
              <InputAdornment position="start">
                <SupportAgentOutlinedIcon sx={{ color: '#fff' }} />
              </InputAdornment>
            }
          />
          {formik.touched.agentId && formik.errors.agentId && (
            <div style={{ color: 'red' }}>{formik.errors.agentId}</div>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <Checkbox
            style={{ border: 'none' }}
            {...formik.getFieldProps('terms')}
            sx={{
              '& .MuiSvgIcon-root': {
                fontSize: 25,
                color: '#ffffff96',
                // color: 'var(#ffffff,  #5C2242)',
                background: ' var(--gray-400,  #420C29)',
              },
              '&.Mui-checked .MuiSvgIcon-root': {
                // background: '#FFF',
                color: '#fff',
              },
            }}
          />
          <div>
            <Typography variant="body1" sx={{ color: '#B5B5B5', ml: 1 }}>
              {t('I am at least 18 years old and have read and agree to the')}
              &nbsp;
              <u
                style={{ color: '#fff', cursor: 'pointer' }}
                onClick={() => {
                  handleCloseLoginModal()
                  router.push('/privacy-policy?tab=0')
                }}
              >
                {t('Terms & Conditions')}
              </u>{' '}
              {t('and')}{' '}
              <u
                style={{ color: '#fff', cursor: 'pointer' }}
                onClick={() => {
                  handleCloseLoginModal()
                  router.push('/privacy-policy?tab=1')
                }}
              >
                {t('Privacy Policy')}
              </u>
            </Typography>
          </div>
        </Box>
        {formik.touched.terms && formik.errors.terms && (
          <div
            style={{
              color: 'red',
              marginTop: '5px',
              padding: '4px',
              fontWeight: 'bold',
            }}
          >
            {formik.errors.terms}
          </div>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Checkbox
            defaultChecked
            {...formik.getFieldProps('promotions')}
            sx={{
              '& .MuiSvgIcon-root': {
                fontSize: 25,
                color: '#ffffff96',
                background: 'var(--gray-400, #420C29)',
              },
              '&.Mui-checked .MuiSvgIcon-root': {
                // background: '#FFF',
                color: '#fff',
              },
            }}
          />
          <div>
            <Typography variant="body1" sx={{ color: '#B5B5B5', ml: 1 }}>
              {t('Receive promotions by Email')}
            </Typography>
          </div>
        </Box>

        <Button
          type="submit"
          className="modal-btn-losign mt-3"
          isLoading={isMutating}
        >
          {t('Sign up')}
        </Button>
      </div>
    </form>
  )
}

export default SignIn
