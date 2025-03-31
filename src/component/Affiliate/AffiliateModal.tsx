import React, { useEffect, useState } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { useFormik } from 'formik';
import { useMutateData } from '@/services';
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
import { CustomButton } from '../common';
import { useAppSelector } from '@/redux/hooks';
import { useTranslation } from 'react-i18next';
import { logError } from '@/utils';
import { CustomMuiOutlinedInput } from '@/component/common';
import CustomImage from '@/component/common/CustomImage';

interface Props {
  footer?: boolean
  fullTitle?: boolean
  isOpenAffiliate?: boolean
  handleCloseAffilatte?: () => void
}

const AffiliateModal: React.FC<Props> = ({
  fullTitle,
  isOpenAffiliate,
  handleCloseAffilatte,
}) => {
  const user = useAppSelector((state) => state.user.user)
  const [open, setOpen] = useState(isOpenAffiliate ? isOpenAffiliate : false)
  const { mutateData, isMutating } = useMutateData()
  const { t } = useTranslation()

  const fields = [
    { name: 'playerId', label: t('Player ID'), readOnly: true },
    {
      name: 'email',
      label: t('Email Address'),
      readOnly: user?.email ? true : false,
    },
    {
      name: 'description',
      label: t('Description'),
      multiline: true,
      rows: 3,
    },
  ]

  const formik = useFormik({
    initialValues: {
      playerId: user?.playerId || '',
      email: user?.email || '',
      description: '',
    },
    onSubmit: async (values: any) => {
      mutateData('becomeaffiliate', {
        body: {
          ...values,
        },
      })
        .then((res) => {
          if (res?.status !== 'success') {
            throw new Error(
              res?.message ? res?.message : t('Something went wrong'),
            )
          }
          toast.success(res?.message)
          setOpen(false)
        })
        .catch((err) => {
          logError(`Error fetching game data: ${err}`)
        })
    },
  })

  useEffect(() => {
    return () => {
      if (handleCloseAffilatte) handleCloseAffilatte()
    }
  })

  return (
    <>
      <Dialog
        open={open}
        className="affiliateModal"
        scroll="body"
        maxWidth="md"
      >
        <div className="affiliate-modal-dialog-text">
          <DialogTitle className="text-white text-center">
            {t('Become an Affiliate')}
          </DialogTitle>
          <IconButton
            className="close_form_btn m-1 close-icon"
            aria-label="Close"
            onClick={() => setOpen(false)}
          >
            <CloseIcon className="font-size-32 text-white" />
          </IconButton>
        </div>

        <div className="modal-content">
          <div className="modal-body affiliate-modal-container">
            <div className="modal_form_signIn">
              <Box>
                <form onSubmit={formik.handleSubmit}>
                  {fields.map((field) => (
                    <div key={field.name} className="mb-3">
                      <CustomMuiOutlinedInput
                        className="form-field custom-input"
                        readOnly={field?.readOnly}
                        fullWidth
                        placeholder={field.label}
                        startAdornment={
                          field.name === 'email' ? (
                            <InputAdornment position="start">
                              <CustomImage
                                src="/assets/images/msg_login_sign.png"
                                width={30}
                                height={30}
                                alt={t('"Mail icon"')}
                              />
                            </InputAdornment>
                          ) : null
                        }
                        multiline={field.multiline}
                        rows={field.rows}
                        {...formik.getFieldProps(field.name)}
                      />
                    </div>
                  ))}
                  <div className="d-flex justify-content-center gap-3">
                    <CustomButton
                      type="submit"
                      className="modal-btn-losign mt-3 "
                      isLoading={isMutating}
                    >
                      {t('Submit')}
                    </CustomButton>
                    <CustomButton
                      onClick={() => setOpen(false)}
                      type="button"
                      className="modal-btn-losign mt-3"
                    >
                      {t('Cancel')}
                    </CustomButton>
                  </div>
                </form>
              </Box>
            </div>
          </div>
        </div>
      </Dialog>
      {fullTitle ? (
        <p
          onClick={() => setOpen(true)}
          className="side-bar-para cursor-pointer"
        >
          {t('Become an Affiliate')}
        </p>
      ) : (
        <span onClick={() => setOpen(true)} className="cursor-pointer">
          {t('Affiliate')}
        </span>
      )}
    </>
  )
}

export default AffiliateModal
