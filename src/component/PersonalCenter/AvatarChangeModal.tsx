import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { Close, Settings } from '@mui/icons-material'
import { Dialog, IconButton } from '@mui/material'
import { useEffect, useState } from 'react'
import { Button } from '../common'
import { userProfilePhoto } from '@/utils/data'
import { useMutateData } from '@/services'
import { toast } from 'react-toastify'
import { updateUser } from '@/redux/user/userReducer'
import { logError } from '@/utils'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'

const AvatarChangeModal = () => {
  const user = useAppSelector((state) => state.user.user)
  const { mutateData, isMutating } = useMutateData()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [openUserDisplay, setOpenUserDisplay] = useState(false)

  const [activeElement, setActiveElement] = useState(user?.avatar)

  const handleUserProfile = (elementId: string) => {
    setActiveElement(elementId)
  }
  const [nickName, setNickName] = useState(user?.nickName)

  const handleUserProfileData = async () => {
    await mutateData('profileUpdate', {
      body: {
        nickName: nickName ? nickName : user?.nickName,
        avatar: activeElement ? activeElement : user?.avatar,
        userId: user?._id,
        email: user?.email,
      },
    })
      .then((response) => {
        dispatch(
          updateUser({
            ...user,
            avatar: response?.data?.[0]?.avatar,
          }),
        )
        toast.success(response?.data?.message)
        setOpenUserDisplay(false)
      })
      .catch((error) => {
        logError(error)
        toast.error(t('Failed to update user profile'))
      })
  }

  return (
    <>
      {' '}
      <Dialog
        className="signUpModaluniversal avatar-modal"
        open={openUserDisplay}
        onClose={() => setOpenUserDisplay(false)}
        scroll="body"
      >
        <div className="modal_closebtn">
          <IconButton
            type="button"
            className="close_form_btn"
            data-bs-dismiss="modal"
            aria-label="Close"
            onClick={() => {
              setOpenUserDisplay(false)
              setActiveElement('')
            }}
          >
            <Close className=" text-white" />
          </IconButton>
        </div>
        <h5
          style={{
            color: '#fff',
            textAlign: 'center',
            fontSize: '18px',
            fontWeight: '800',
            marginTop: '5px',
            marginBottom: '15px',
          }}
        >
          {t('Change Avatar')}
        </h5>
        <div className="">
          <div className="userimgName d-flex justify-content-center">
            <div className="MainUserLogo">
              <Image
                src={
                  user?.avatar && userProfilePhoto[Number(user.avatar)]?.image
                    ? userProfilePhoto[Number(user.avatar)]?.image
                    : ''
                }
                alt={t('User image')}
                width={100}
                height={70}
              />
            </div>
          </div>

          <div
            className="userDisplayPC mt-3"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              flexWrap: 'wrap',
            }}
          >
            {userProfilePhoto?.map((element) => {
              return (
                <div
                  key={element.id}
                  onClick={() => handleUserProfile(element.id)}
                  className={`MainUserLogo ${
                    element?.id === String(activeElement || user?.avatar)
                      ? 'normalActive'
                      : ''
                  }`}
                >
                  <Image
                    src={element.image}
                    alt={'User image'}
                    width={68}
                    height={68}
                  />
                </div>
              )
            })}
          </div>
          <div className="userDisplayButton mt-3">
            <button
              className="userLeaveButton"
              onClick={() => {
                setOpenUserDisplay(false)
                setActiveElement('')
              }}
            >
              {t('Leave')}
            </button>
            <Button
              className="userSaveButton mx-3"
              isLoading={isMutating}
              onClick={handleUserProfileData}
            >
              {t('Save')}
            </Button>
          </div>
        </div>
      </Dialog>{' '}
      <div className="icon-userInfo" onClick={() => setOpenUserDisplay(true)}>
        <Settings style={{ color: '#fff' }} />
      </div>
    </>
  )
}

export default AvatarChangeModal
