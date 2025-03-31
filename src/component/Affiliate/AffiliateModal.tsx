import React, { useEffect, useState } from 'react'
import {
  Box,
  Dialog,
  DialogTitle,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Typography,
} from '@mui/material'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useMutateData } from '@/services'
import { toast } from 'react-toastify'
import CloseIcon from '@mui/icons-material/Close'
import Image from 'next/image'
import { Button } from '../common'
import { useAppSelector } from '@/redux/hooks'
import { useTranslation } from 'react-i18next'
import { logError } from '@/utils'

interface Props {
  footer?: boolean
  fullTitle?: boolean
  isOpenAffiliate?: boolean
  handleCloseAffilatte?: () => void
}

const AffiliateModal: React.FC<Props> = ({
  footer,
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
  const initialValues = {
    playerId: user?.playerId || '',
    email: user?.email || '',
    description: '',
  }

  const affiliateValidation = Yup.object().shape({
    playerId: Yup.string().optional(),
    email: Yup.string()
      .required(t('Please enter your email address.'))
      .email(t('Invalid email format')),
    description: Yup.string().optional(),
  })

  const handleSubmit = (values: {
    playerId: string
    email: string
    description: string
  }) => {
    mutateData('becomeaffiliate', {
      body: {
        ...values,
      },
    })
      .then((res) => {
        if (res?.status === 'success') {
          toast.success(res?.message)
          setOpen(false)
          return
        }
        toast.error(res?.message ? res?.message : t('Something went wrong'))
        return
      })
      .catch((err) => {
        logError(`Error fetching game data: ${err}`)
      })
  }

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
        <div
          style={{
            backgroundColor: 'var(--gray-400, #31001B)',
            borderRadius: '10px 10px 0px 0px',
          }}
        >
          <DialogTitle align="center" className="text-white">
            {t('Become an Affiliate')}
          </DialogTitle>
          <IconButton
            sx={{
              position: 'absolute',
              right: 8,
              top: 0,
            }}
            className="close_form_btn m-1"
            aria-label="Close"
            onClick={() => setOpen(false)}
          >
            <CloseIcon style={{ color: 'white', fontSize: '32px' }} />
          </IconButton>
        </div>

        <div className="modal-content" style={{ padding: '15px 40px 30px' }}>
          <div className="modal-body">
            <div className="modal_form_signIn">
              <Box>
                <Formik
                  initialValues={initialValues}
                  validationSchema={affiliateValidation}
                  onSubmit={handleSubmit}
                >
                  <Form>
                    {fields.map((field) => (
                      <div key={field.name} className="mb-3">
                        <Field
                          style={{
                            background: 'var(--gray-400, #31001B)',
                          }}
                          readOnly={field?.readOnly}
                          as={OutlinedInput}
                          fullWidth
                          name={field.name}
                          placeholder={field.label}
                          startAdornment={
                            field.name === 'email' ? (
                              <InputAdornment position="start">
                                <Image
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
                          sx={{
                            '& .MuiOutlinedInput-input': {
                              color: '#fff',
                            },
                          }}
                        />
                        <ErrorMessage name={field.name}>
                          {(msg) => (
                            <Typography
                              variant="body2"
                              color="error"
                              className="m-2"
                            >
                              {msg}
                            </Typography>
                          )}
                        </ErrorMessage>
                      </div>
                    ))}
                    <div className="d-flex justify-content-center gap-3">
                      <Button
                        type="submit"
                        className="modal-btn-losign mt-3 "
                        isLoading={isMutating}
                      >
                        {t('Submit')}
                      </Button>
                      <button
                        onClick={() => setOpen(false)}
                        type="button"
                        className="modal-btn-losign mt-3"
                        style={{
                          backgroundColor: '#66324D',
                          border: '1px solid #66324D',
                        }}
                      >
                        {t('Cancel')}
                      </button>
                    </div>
                  </Form>
                </Formik>
              </Box>
            </div>
          </div>
        </div>
      </Dialog>
      {fullTitle ? (
        <p
          style={{ cursor: 'pointer' }}
          onClick={() => setOpen(true)}
          className="side-bar-para"
        >
          {t('Become an Affiliate')}
        </p>
      ) : (
        <span style={{ cursor: 'pointer' }} onClick={() => setOpen(true)}>
          {t('Affiliate')}
        </span>
      )}
    </>
  )
}

export default AffiliateModal
