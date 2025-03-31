import { Box, InputAdornment} from '@mui/material';
import { FormikHelpers, useFormik } from 'formik';
import { useMutateData } from '@/services';
import { toast } from 'react-toastify';
import { CustomButton, CustomMuiOutlinedInput } from '@/component/common';
import CloseIcon from '@mui/icons-material/Close';
import { logError } from '@/utils';
import { useTranslation } from 'react-i18next';
import { z } from 'zod'
import { validationMsg } from '@/utils/validationMsg';
import { withZodSchema } from 'formik-validator-zod';
import FormErrorMessage from './common/FormErrorMessage';
import CustomImage from './common/CustomImage';

const ForgetPasswordPopup = ({
  handleCloseForgetPassword,
}: {
  handleCloseForgetPassword: () => void
  setOpenForgetPasswordModal: (value: boolean) => void
}) => {
  const { mutateData, isMutating } = useMutateData()
  const { t } = useTranslation()

  const validationSchema = z.object({
    resetEmail: z
      .string()
      .email(`${t(validationMsg.email.invalidEmail)}`)
      .nonempty(t(validationMsg.email.require)),
  })
  type ValidationSchemaType = z.infer<typeof validationSchema>

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
        console.log(res,'res');
        
        if (res?.status !== 'success') {
          throw new Error(res?.message)
        }

        toast.success(res?.message)
        formikHelpers.resetForm()
        handleCloseForgetPassword()
      })
      .catch((err) => {
        logError(err)
      })
  }

  const formik = useFormik<ValidationSchemaType>({
    initialValues: {
      resetEmail: '',
    },
    validate: withZodSchema(validationSchema),
    onSubmit: handleLoginSubmit,
  })

  return (
    <div className="modal-content">
      <div className="modal_closebtn">
        <CustomButton
          type="button"
          className="close_form_btn m-1"
          data-bs-dismiss="modal"
          aria-label="Close"
          onClick={handleCloseForgetPassword}
        >
          <CloseIcon className="text-white font-size-32" />
        </CustomButton>
      </div>
      <div className="modal-body">
        <div className="modal_form_signIn">
          <div>
            <h2 className="m-3 mb-4 text-center font-size-22 text-white">
              {t('Forgot Password')}
            </h2>
            <Box>
              <form onSubmit={formik.handleSubmit}>
                <CustomMuiOutlinedInput
                  className="forgot-password-input"
                  id="input-with-icon-textfield"
                  placeholder={t('E-mail')}
                  startAdornment={
                    <InputAdornment position="start">
                      <CustomImage
                        src='/assets/images/msg_login_sign.png'
                        width={30}
                        height={30}
                        alt={t('Mail icon')}
                      />
                    </InputAdornment>
                  }
                  fullWidth
                  {...formik.getFieldProps('resetEmail')}
                />
                <FormErrorMessage
                  touched={formik.touched?.resetEmail}
                  error={formik.errors?.resetEmail}
                />
                <CustomButton
                  className="modal-btn-losign mt-3"
                  type="submit"
                  isLoading={isMutating}
                >
                  {t('Submit')}
                </CustomButton>
              </form>
            </Box>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgetPasswordPopup
