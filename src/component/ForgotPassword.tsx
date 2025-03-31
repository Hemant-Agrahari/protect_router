import { Box, InputAdornment, OutlinedInput } from '@mui/material'
import * as Yup from 'yup'
import { Formik, Field, Form, ErrorMessage, FormikHelpers } from 'formik'
import { useMutateData } from '@/services'
import { toast } from 'react-toastify'
import { Button } from './common'
import CloseIcon from '@mui/icons-material/Close'
import Image from 'next/image'
import { logError } from '@/utils'
import { useTranslation } from 'react-i18next'

const ForgetPasswordPopup = ({
  handleCloseForgetPassword,
}: {
  handleCloseForgetPassword: () => void
  setOpenForgetPasswordModal: (value: boolean) => void
}) => {
  const { mutateData, isMutating } = useMutateData()
  const { t } = useTranslation()
  const initialValues = {
    resetEmail: '',
  }

  const passwordValidation = Yup.object().shape({
    resetEmail: Yup.string()
      .required(`${t('Please Enter Your E-mail')}`)
      .email(`${t('Invalid email format')}`),
  })

  const handleLoginSubmit = (
    values: { resetEmail: string },
    formikHelpers: FormikHelpers<{ resetEmail: string }>,
  ) => {
    mutateData('forgotPassword', {
      body: {
        email: values?.resetEmail,
      },
    })
      .then((res) => {
        if (res?.status !== 'success') {
          toast.error(res?.message)
          return
        }

        toast.success(res?.message)
        formikHelpers.resetForm()
        handleCloseForgetPassword()
      })
      .catch((err) => {
        logError(err)
      })
  }

  return (
    <div className="modal-content">
      <div className="modal_closebtn">
        <Button
          type="button"
          className="close_form_btn m-1"
          data-bs-dismiss="modal"
          aria-label="Close"
          onClick={handleCloseForgetPassword}
        >
          <CloseIcon style={{ color: 'white', fontSize: '32px' }} />
        </Button>
      </div>
      <div className="modal-body">
        <div className="modal_form_signIn">
          <div>
            <h2
              style={{ color: '#fff', fontSize: '22px' }}
              className="m-3 mb-4 text-center "
            >
              {t('Forgot Password')}
            </h2>
            <Box>
              <Formik
                initialValues={initialValues}
                validationSchema={passwordValidation}
                onSubmit={handleLoginSubmit}
              >
                <Form>
                  <Field
                    as={OutlinedInput}
                    sx={{
                      '& .MuiOutlinedInput-input': { color: '#fff' },
                      //   border: "1px solid gray",
                      background: 'var(--gray-500)',
                      borderRadius: 2,
                    }}
                    id="input-with-icon-textfield"
                    placeholder={t('E-mail')}
                    startAdornment={
                      <InputAdornment position="start">
                        <Image
                          src={'/assets/images/msg_login_sign.png'}
                          width={30}
                          height={30}
                          alt={t('Mail icon')}
                        />
                      </InputAdornment>
                    }
                    fullWidth
                    name="resetEmail"
                  />
                  <p
                    style={{ color: 'red', fontWeight: '700' }}
                    className="m-2"
                  >
                    <ErrorMessage name="resetEmail" />
                  </p>
                  <Button
                    className="modal-btn-losign mt-3"
                    type="submit"
                    isLoading={isMutating}
                  >
                    {t('Submit')}
                  </Button>
                </Form>
              </Formik>
            </Box>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgetPasswordPopup
