import { Box, InputAdornment } from '@mui/material';
import { FormikHelpers, useFormik } from 'formik';
import { useMutateData } from '@/services';
import { toast } from 'react-toastify';
import { CustomButton, CustomMuiOutlinedInput } from '@/component/common';
import CloseIcon from '@mui/icons-material/Close';
import { logError } from '@/utils';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { validationMsg } from '@/utils/validationMsg';
import { withZodSchema } from 'formik-validator-zod';
import FormErrorMessage from './common/FormErrorMessage';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { resetPasswordRegex } from '@/utils/regex';
const ResetPasswordPopup = ({
  handleCloseResetPassword,
}: {
  handleCloseResetPassword: () => void;
  setOpenResetPasswordModal: (value: boolean) => void;
}) => {
  const { mutateData, isMutating } = useMutateData();
  const { t } = useTranslation();

  const validationSchema = z.object({
    resetpassword: z
      .string()
      .min(1, { message: t(validationMsg.password.require) }) 
      .regex(resetPasswordRegex, t(validationMsg.password.match))
      .min(6, { message: t(validationMsg.password.min) })
      .max(15, { message: t(validationMsg.password.max) }),
  });

  type ValidationSchemaType = z.infer<typeof validationSchema>;

  const handleResetPasswordSubmit = (
    values: { resetPassword: string },
    formikHelpers: FormikHelpers<{ resetEmail: string }>,
  ) => {
    mutateData('resetPassword', {
      body: {
        email: values?.resetPassword,
      },
    })
      .then((res) => {
        console.log(res, 'res');

        if (res?.status !== 'success') {
          throw new Error(res?.message);
        }

        toast.success(res?.message);
        formikHelpers.resetForm();
        handleCloseResetPassword();
      })
      .catch((err) => {
        logError(err);
      });
  };

  const formik = useFormik<ValidationSchemaType>({
    initialValues: {
      resetpassword: '',
    },
    validate: withZodSchema(validationSchema),
    onSubmit: handleResetPasswordSubmit,
  });

  return (
    <div className="modal-content">
      <div className="modal_closebtn">
        <CustomButton
          type="button"
          className="close_form_btn m-1"
          data-bs-dismiss="modal"
          aria-label="Close"
          onClick={handleCloseResetPassword}
        >
          <CloseIcon className="text-white font-size-32" />
        </CustomButton>
      </div>
      <div className="modal-body">
        <div className="modal_form_signIn">
          <div>
            <h2 className="m-3 mb-4 text-center font-size-22 text-white">
              {t('Reset Password')}
            </h2>
            <Box>
              <form onSubmit={formik.handleSubmit}>
                <CustomMuiOutlinedInput
                  className="forgot-password-input"
                  id="input-with-icon-textfield"
                  placeholder={t('Reset Password')}
                  startAdornment={
                    <InputAdornment position="start">
                      <LockOpenIcon className="text-white" />
                    </InputAdornment>
                  }
                  fullWidth
                  {...formik.getFieldProps('resetpassword')}
                />
                <FormErrorMessage
                  touched={formik.touched?.resetpassword}
                  error={formik.errors?.resetpassword}
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
  );
};

export default ResetPasswordPopup;
