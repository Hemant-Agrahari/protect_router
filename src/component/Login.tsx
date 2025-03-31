import { useState } from 'react'
import {
  IconButton,
  Box,
  Tab,
  Tabs,
  Typography,
  InputAdornment,
  Dialog,
} from '@mui/material'
import { VisibilityOff, Visibility, Email, Https } from '@mui/icons-material'
import CloseIcon from '@mui/icons-material/Close'
import { useAppDispatch } from '@/redux/hooks'
import { useFormik } from 'formik'
import * as yup from 'yup'
import SignIn from './authForms/Signin'
import { toast } from 'react-toastify'
import { setUser } from '@/redux/user/userReducer'
import { useRouter } from 'next/router'
import { Button, CustomOutlinedInput } from './common'
import ForgetPasswordPopup from './ForgotPassword'
import { useMutateData } from '@/services'
import { Dispatch, SetStateAction } from 'react'
import { logError } from '@/utils'
import { useTranslation } from 'react-i18next'

type LoginProps = {
  handleCloseLoginModal: (redirection?: boolean) => void
  setOpenLoginModal: Dispatch<SetStateAction<boolean>>
  tabIndex: number // Assuming tabIndex is of type number
  setTabIndex: Dispatch<SetStateAction<number>> // Assuming setTabIndex is a function to set a number state
}

const Login: React.FC<LoginProps> = ({
  handleCloseLoginModal,
  tabIndex,
  setTabIndex,
}: {
  handleCloseLoginModal: (redirection?: boolean) => void
  tabIndex: number
  setTabIndex: (index: number) => void
  setOpenLoginModal: Dispatch<SetStateAction<boolean>>
}) => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { mutateData, isMutating } = useMutateData()
  const { t } = useTranslation()
  const handleTabChange = (event: any, newTabIndex: any) => {
    setTabIndex(newTabIndex)
  }
  const [openForgetPasswordModal, setOpenForgetPasswordModal] = useState(false)
  const handleCloseForgetPassword = () => setOpenForgetPasswordModal(false)

  const handleForgetPassword = () => {
    setOpenForgetPasswordModal(true)
  }

  // ============ Password Function =======
  const [showPassword, setShowPassword] = useState(false)

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault()
  }

  const validationSchema = yup.object({
    email: yup
      .string()
      .required(`${t('Please Enter Your E-mail')}`)
      .matches(
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
        `${t('This is not a valid email format!')}`,
      ),
    password: yup
      .string()
      .required(`${t('Please enter a password')}`)
      .min(6, `${t('Password is too short - should be 6 chars minimum')}`),
  })

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const obj = {
        email: values.email,
        password: values.password,
      }
      mutateData('signIn', {
        body: {
          ...obj,
        },
      })
        .then((res) => {
          if (res.data.result === null) {
            toast.error(res.data.message)
            return
          }
          dispatch(setUser(res.data?.[0]))
          toast.success(res?.message)
          handleCloseLoginModal(true)
          formik.resetForm()
        })
        .catch((err) => {
          logError(err)
        })
    },
  })

  return (
    <div
      className="modal-content"
      style={{ display: openForgetPasswordModal ? 'none' : '' }}
    >
      <div className="modal_closebtn">
        <button
          type="button"
          className="close_form_btn"
          data-bs-dismiss="modal"
          aria-label="Close"
        >
          <CloseIcon
            onClick={() => handleCloseLoginModal()}
            style={{ color: '#fff' }}
          />
        </button>
      </div>
      <div className="modal-body">
        <Box className="TabLogin_Signup">
          <Tabs value={tabIndex} onChange={handleTabChange}>
            <Tab label={t('Log in')} disableRipple={true} />
            <Tab label={t('Sign up')} disableRipple={true} />
          </Tabs>
        </Box>
        <Box>
          {tabIndex === 0 && (
            <form
              className="modal_form_signIn mt-xxl-5 mt-lg-5 mt-3"
              onSubmit={formik.handleSubmit}
            >
              <div className="mb-2">
                <Box>
                  <CustomOutlinedInput
                    placeholder={t('E-mail')}
                    startAdornment={
                      <InputAdornment position="start">
                        <Email sx={{ color: '#fff' }} />
                      </InputAdornment>
                    }
                    fullWidth
                    {...formik.getFieldProps('email')}
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div className="text-danger mt-2 mx-2 fw-bold ">
                      {formik.errors.email}
                    </div>
                  ) : null}
                </Box>
                <Box>
                  <CustomOutlinedInput
                    className="mt-4"
                    id="outlined-adornment-password"
                    type={showPassword ? 'text' : 'password'}
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
                          onMouseDown={handleMouseDownPassword}
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
                  {formik.touched.password && formik.errors.password ? (
                    <div className="text-danger mt-2 mx-2 fw-bold ">
                      {formik.errors.password}
                    </div>
                  ) : null}
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: '600',
                      mt: 2,
                      color: '#B5B5B5',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      handleForgetPassword()
                    }}
                  >
                    {t('Forgot Password')}?
                  </Typography>
                </Box>
                <Button
                  type="submit"
                  className="modal-btn-losign mt-3"
                  isLoading={isMutating}
                >
                  {t('Log in')}
                </Button>
                <h6 className="mt-3">
                  <span className="f-16" style={{ color: '#BEBEBE' }}>
                    {t(
                      'To visit this site, please ensure that you are over 18 and agree to the',
                    )}
                    &nbsp;
                  </span>
                  <span
                    className="f-15"
                    style={{
                      color: '#fff',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      handleCloseLoginModal()
                      router.push('/privacy-policy?tab=0')
                    }}
                  >
                    <u>{t('Terms & Conditions')}</u>
                  </span>
                </h6>
              </div>
            </form>
          )}
          {tabIndex === 1 && (
            <SignIn handleCloseLoginModal={handleCloseLoginModal} />
          )}
        </Box>
        <Dialog
          className="signUpModaluniversal"
          open={openForgetPasswordModal}
          onClose={setOpenForgetPasswordModal}
          scroll="body"
        >
          <ForgetPasswordPopup
            handleCloseForgetPassword={handleCloseForgetPassword}
            setOpenForgetPasswordModal={setOpenForgetPasswordModal}
          />
        </Dialog>
      </div>
    </div>
  )
}
export default Login
