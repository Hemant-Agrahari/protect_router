import { MouseEvent, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Logo from '../../public/assets/images/headerLogo.png'
import SidbarArrow from '../../public/assets/images/icon-sidebar.png'
import SidecrownImg from '../../public/assets/images/SidecrownImg.png'
import SidemoneyImg from '../../public/assets/images/SidemoneyImg.png'
import SidecontactImg from '../../public/assets/images/SidecontactImg.png'
import SidegameImgSide from '../../public/assets/images/SidegameImgSide.png'
import connectFB from '../../public/assets/images/connect_facebook.png'
import connectGoogle from '../../public/assets/images/connect_google.png'
import vip_banner from '../../public/assets/images/vip_banner.png'
import Link from 'next/link'
import Dialog from '@mui/material/Dialog'
import Login from '../component/Login'
import NotificationsIcon from '@mui/icons-material/Notifications'
import {
  Button,
  ClickAwayListener,
  Grow,
  LinearProgress,
  InputAdornment,
  Menu,
  MenuList,
  Paper,
  Popper,
  Typography,
} from '@mui/material'
import {
  KeyboardArrowDown,
  NotificationsNoneOutlined,
} from '@mui/icons-material'
import WalletPopup from '@/component/HeaderModals/WalletPopup'
import { userProfilePhoto } from '@/utils/data'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { toast } from 'react-toastify'
import { removeUser } from '@/redux/user/userReducer'
import { useMutateData } from '@/services'
import NotificationType from '@/types/notification'
import { logError } from '@/utils'
import { useRouter } from 'next/router'
import socketService from '@/services/socketService'
import { CustomOutlinedInput } from '@/component/common'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '@/component/common/LanguageSwitcher'
import { PostMethod } from '@/services/fetchAPI'

const Header = ({ handleSearch, searchQuery, setActive, active }: any) => {
  const { t } = useTranslation()
  const socket = socketService.getSocket()
  const router = useRouter()
  const user = useAppSelector((state) => state.user.user)
  const userBalance = useAppSelector((state) => state.user.userBalance)
  const dispatch = useAppDispatch()
  const userChips: any = user && user?.bonusChips + user?.chips

  const [openLoginModal, setOpenLoginModal] = useState(false)
  const handleCloseLoginModal = () => setOpenLoginModal(false)

  const [Wallet_Anchor, setWallet_Anchor] = useState(0)
  const [openWalletModal, setOpenWalletModal] = useState(false)
  const [currentBalance, setCurrentBalance] = useState(0)
  const handleCloseWalletModal = () => {
    setOpenWalletModal(false)
  }
  const [tabIndex, setTabIndex] = useState(0)
  const [openPopover, setOpenPopover] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { mutateData } = useMutateData()
  const [allNotifications, setAllNotifications] =
    useState<NotificationType | null>(null)
  const notificationsLength = allNotifications?.notification?.length ?? 0
  const [triggerRefetch, setTriggerRefetch] = useState<boolean>(false)
  const searchParams = new URLSearchParams(window.location.search)
  const referralCode = searchParams.get('referralcode')
  const agentId = searchParams.get('agentId')

  useEffect(() => {
    mutateData(`notification`, {
      body: {
        userId: user?._id,
      },
    })
      .then((response) => {
        setAllNotifications(response?.data)
      })
      .catch((err) => {
        logError(err)
      })
  }, [user?._id, openPopover, triggerRefetch])

  useEffect(() => {
    const handleCurrentBalance = (res: any) => {
      if (res?.result.userId === user?._id) {
        setCurrentBalance(res?.result.currentBalance)
      }
    }

    if (socketService.isConnected()) {
      socket.on('currentBalance', handleCurrentBalance)
    } else {
      console.log('socket disconnected')
    }

    return () => {
      if (socketService.isConnected()) {
        socket.off('currentBalance', handleCurrentBalance)
      }
    }
  }, [user?._id, socket])

  const handleMarkAsRead = (type: 'single' | 'many', id?: string) => {
    mutateData(`updateNotification`, {
      body:
        type === 'single'
          ? {
              type: type,
              notificationId: id,
            }
          : {
              type: type,
              userId: user?._id,
            },
    })
      .then((response) => {
        if (response?.status === 'success') {
          toast.success(response?.message)
          setTriggerRefetch(!triggerRefetch)
          type === 'many' && setOpenPopover(false)
          return
        }
        toast.error(response?.message)
      })
      .catch((err) => {
        logError(err)
      })
  }

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    setOpenPopover((previousOpen) => !previousOpen)
  }

  const handleLoginSignupTab = (id: any) => {
    setTabIndex(id)
    setOpenLoginModal(true)
  }

  const [open, setOpen] = useState(false)
  const anchorRef = useRef<any>(null)

  const handleToggle = () => {
    if (window.matchMedia('(max-width: 992px)').matches) {
      setActive(false)
    }
    setOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event: any) => {
    if (anchorRef?.current && anchorRef.current?.contains(event.target)) {
      return
    }
    setOpen(false)
  }

  function handleListKeyDown(event: any) {
    if (event.key === 'Tab') {
      event.preventDefault()
      setOpen(false)
    } else if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open)

  const handleLogout = async () => {
    if (socketService.isConnected()) {
      if (user?._id) {
        socket.emit('playerConnect', { playerId: user?._id, type: 'logout' })
      }
    }

    try {
      const response: any = await PostMethod('logout', {
        userId: user?._id,
      })

      if (response.data?.status !== 'success') {
        throw new Error(response.data.message || t('Something went wrong'))
      }

      if (response.data.result) {
        toast.success(response.data.message)
        dispatch(removeUser())
      } else {
        throw new Error(response.data.message || t('Something went wrong'))
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message.includes('404')) {
          router.push('/').then(() => {
            toast.error(t('Please login'))
            dispatch(removeUser())
          })
        }
        // toast.error(error.message)
        logError(error)
      }
    }
  }

  const copyId = async () => {
    await navigator.clipboard.writeText(`${user?.playerId}`)
    toast.success(t('ID Copied'))
  }

  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef && anchorRef?.current.focus()
    }

    prevOpen.current = open
  }, [open])

  useEffect(() => {
    if (referralCode || agentId) {
      setTabIndex(1) // Set tabIndex to 1 to open Sign Up tab
      setOpenLoginModal(true) // Open the login & signup modal
    }
  }, [referralCode, agentId])

  useEffect(() => {
    if (socketService.isConnected()) {
      if (user?._id) {
        socket.emit('playerConnect', { playerId: user?._id, type: 'login' })
      }
    }
  }, [user?._id])

  const depositPercentage = user?.vipLevelDetails?.depositPer
  const result =
    depositPercentage === undefined
      ? 0
      : depositPercentage >= 100
        ? 100
        : depositPercentage > 0
          ? parseFloat(depositPercentage.toFixed(2))
          : 0

  const betPercentage = user?.vipLevelDetails?.betPer

  const betResult =
    betPercentage === undefined
      ? 0
      : betPercentage >= 100
        ? 100
        : betPercentage > 0
          ? parseFloat(betPercentage.toFixed(2))
          : 0

  return (
    <>
      <header className={`header ${active ? '' : ''}`}>
        <div className="header_toggle">
          <Image
            src={SidbarArrow}
            width={50}
            height={50}
            alt={t('Picture of the author')}
            onClick={() => setActive(!active)}
            className={`sideBarArrow ${active ? 'sideBarArrowOper' : ''}`}
          />
          <Link href="/">
            <Image
              src={Logo}
              width={95}
              height={70}
              className="logo-img"
              alt="Casinobet"
            />
          </Link>
        </div>
        {user ? (
          <div className="afterLogin">
            <div className="search-input my-1 d-none d-md-block">
              <CustomOutlinedInput
                placeholder={t('Search games')}
                startAdornment={
                  <InputAdornment position="start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <g clip-path="url(#clip0_2816_7411)">
                        <path
                          d="M17.6596 16.2453C17.269 15.8548 16.6359 15.8548 16.2454 16.2453C15.8548 16.6358 15.8548 17.269 16.2453 17.6595L17.6596 16.2453ZM19.2929 20.7071C19.6834 21.0976 20.3166 21.0976 20.7071 20.7071C21.0976 20.3166 21.0976 19.6834 20.7071 19.2929L19.2929 20.7071ZM16.2453 17.6595L19.2929 20.7071L20.7071 19.2929L17.6596 16.2453L16.2453 17.6595ZM10.8572 16.7143C7.62233 16.7143 5 14.0919 5 10.8571H3C3 15.1965 6.51777 18.7143 10.8572 18.7143V16.7143ZM16.7143 10.8571C16.7143 14.0919 14.092 16.7143 10.8572 16.7143V18.7143C15.1965 18.7143 18.7143 15.1965 18.7143 10.8571H16.7143ZM10.8572 5C14.092 5 16.7143 7.62233 16.7143 10.8571H18.7143C18.7143 6.51775 15.1965 3 10.8572 3V5ZM10.8572 3C6.51777 3 3 6.51775 3 10.8571H5C5 7.62233 7.62233 5 10.8572 5V3Z"
                          fill="url(#paint0_linear_2816_7411)"
                        />
                      </g>
                      <defs>
                        <linearGradient
                          id="paint0_linear_2816_7411"
                          x1="4"
                          y1="12"
                          x2="19.7526"
                          y2="12"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#4473E9" />
                          <stop offset="1" stop-color="#7E43DE" />
                        </linearGradient>
                        <clipPath id="clip0_2816_7411">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </InputAdornment>
                }
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                fullWidth
              />
            </div>
            <div className="balance-deposit">
              <div className="balance ">
                <Image
                  src={'/assets/images/coin.png'}
                  alt={t('coin')}
                  width={22}
                  height={22}
                />
                <span>
                  {userBalance
                    ? userBalance?.toFixed(2)
                    : currentBalance
                      ? currentBalance
                      : userChips?.toFixed(2)}
                </span>
              </div>
              <button
                className="btn deposit-btn"
                onClick={() => setOpenWalletModal(true)}
              >
                <Image
                  src={'/assets/images/wallet.png'}
                  alt={t('coin')}
                  width={22}
                  height={22}
                />
                <span className="d-none d-md-block ">{t('Deposit')}</span>
              </button>
            </div>
            <div className="headerProfile">
              <Button
                disableRipple
                aria-controls={open ? 'headerProfile-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                className={`headerProfile-btn ${open ? 'active' : 'undefine'}`}
                variant="contained"
                disableElevation
                onClick={handleToggle}
                endIcon={<KeyboardArrowDown />}
                ref={anchorRef}
              >
                <span className="profile-img">
                  <Image
                    src={userProfilePhoto[Number(user?.avatar)]?.image}
                    alt={t('UserPhoto')}
                    key={userProfilePhoto[Number(user?.avatar)]?.id}
                    width={25}
                    height={25}
                  />
                </span>
                <span className="profile-name">
                  {t('VIP')} - {user?.level}
                </span>
              </Button>
              <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                placement="bottom-start"
                transition
                disablePortal
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin:
                        placement === 'bottom-start'
                          ? 'left top'
                          : 'left bottom',
                    }}
                  >
                    <Paper style={{ background: 'var(--gray-600, #420C29)' }}>
                      <ClickAwayListener onClickAway={handleClose}>
                        <MenuList
                          autoFocusItem={open}
                          id="composition-menu"
                          aria-labelledby="composition-button"
                          onKeyDown={handleListKeyDown}
                        >
                          <div className="hpMenu-top" onClick={handleClose}>
                            <div className="user-info">
                              <div className="user-img">
                                <Image
                                  src={
                                    userProfilePhoto[Number(user?.avatar)]
                                      ?.image
                                  }
                                  alt={t('UserPhoto')}
                                  key={
                                    userProfilePhoto[Number(user?.avatar)]?.id
                                  }
                                  width={25}
                                  height={25}
                                />
                              </div>
                              <div className="user-name">{user?.playerId}</div>
                              <button
                                className="btn userCopy-btn"
                                onClick={copyId}
                              ></button>
                            </div>
                            <div className="user-levelScore">
                              <div className="userLevel">
                                <div className="vipImg">
                                  <Image src={vip_banner} alt={t('VIP')} />
                                </div>
                                <div className="levalName">
                                  {t('VIP')} {user?.level}
                                </div>
                              </div>
                              <div className="userScore">
                                <div className="userScore-col deposit">
                                  <div className="title-value">
                                    <div className="title">{t('Deposit')}</div>
                                    <div className="amount">
                                      <Image
                                        src={'/assets/images/coin.png'}
                                        alt={t('coin')}
                                        width={14}
                                        height={14}
                                        className="coin-margin"
                                      />
                                      {user?.vipLevelDetails?.currenDeposit?.toFixed(
                                        2,
                                      )}
                                      /
                                      <span
                                        style={{
                                          color: '#FFC635',
                                        }}
                                      >
                                        <Image
                                          src={'/assets/images/coin.png'}
                                          alt={t('coin')}
                                          width={14}
                                          height={14}
                                          className="coin-margin ms-1"
                                        />
                                        {
                                          user?.vipLevelDetails
                                            ?.nextLevelDeposit
                                        }
                                      </span>
                                    </div>
                                  </div>
                                  <div className="process-score">
                                    <LinearProgress
                                      variant="determinate"
                                      value={result || 0}
                                      sx={{
                                        backgroundColor: '#000000 !important',
                                        '& .MuiLinearProgress-bar': {
                                          backgroundColor: '#FFC635 !important',
                                        },
                                      }}
                                    />
                                    <div className="progressValue">
                                      {' '}
                                      {result}%
                                    </div>
                                  </div>
                                </div>
                                <div className="userScore-col betAmount">
                                  <div className="title-value">
                                    <div className="title">
                                      {t('Bet Amount')}
                                    </div>
                                    <div className="amount">
                                      <Image
                                        src={'/assets/images/coin.png'}
                                        alt={t('coin')}
                                        width={14}
                                        height={14}
                                        className="coin-margin"
                                      />
                                      {user?.vipLevelDetails?.currentBet?.toFixed(
                                        2,
                                      )}
                                      /
                                      <span
                                        style={{
                                          color: '#9643FF',
                                        }}
                                      >
                                        <Image
                                          src={'/assets/images/coin.png'}
                                          alt={t('coin')}
                                          width={14}
                                          height={14}
                                          className="coin-margin ms-1"
                                        />
                                        {user?.vipLevelDetails?.nextLevelBet}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="bet-score">
                                    <LinearProgress
                                      variant="determinate"
                                      value={betResult}
                                      sx={{
                                        backgroundColor: '#000000 !important',
                                        '& .MuiLinearProgress-bar': {
                                          backgroundColor: '#9643FF !important',
                                        },
                                      }}
                                    />
                                    <div className="progressValue">
                                      {' '}
                                      {betResult}%
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div style={{ padding: '4px 8px' }}>
                            <div
                              className="hpMenu-botm"
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '15px 10px 0px',
                              }}
                            >
                              <ul className="profilePane-ul">
                                <li
                                  style={{ width: '160px' }}
                                  className="me-md-2"
                                  onClick={handleToggle}
                                >
                                  <Link href="/ranking-vip">
                                    <Image src={SidecrownImg} alt="" />
                                    {t('Vip Level')}
                                  </Link>
                                </li>
                              </ul>
                              <ul className="profilePane-ul">
                                <li
                                  style={{ width: '160px' }}
                                  onClick={handleToggle}
                                >
                                  <Link
                                    href="/referral"
                                    style={{
                                      backgroundImage:
                                        'linear-gradient(180deg, #E611DD 0%, #471883 100%)',
                                    }}
                                  >
                                    <Image src={SidemoneyImg} alt="" />
                                    {t('Referral')}
                                  </Link>
                                </li>
                              </ul>
                            </div>
                            <div
                              className="hpMenu-botm"
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '0px 10px 0px',
                              }}
                            >
                              <ul className="profilePane-ul">
                                <li
                                  style={{ width: '160px' }}
                                  className="me-md-2"
                                  onClick={handleToggle}
                                >
                                  <Link
                                    href="/personal-center"
                                    style={{
                                      backgroundImage:
                                        'linear-gradient(180deg, #E67711 0%, #831818 100%)',
                                    }}
                                  >
                                    <Image
                                      src={SidecontactImg}
                                      alt={t('Personal Center')}
                                    />
                                    {t('Personal Center')}
                                  </Link>
                                </li>
                              </ul>
                              <ul className="profilePane-ul">
                                <li
                                  style={{ width: '160px' }}
                                  onClick={handleToggle}
                                >
                                  <Link
                                    href="/game-history"
                                    style={{
                                      backgroundImage:
                                        'linear-gradient(180deg, #5428D2 0%, #7B1893 100%)',
                                    }}
                                  >
                                    <Image
                                      src={SidegameImgSide}
                                      alt={t('Game History')}
                                    />
                                    {t('Game History')}
                                  </Link>
                                </li>
                              </ul>
                            </div>
                            {user ? (
                              ''
                            ) : (
                              <>
                                {' '}
                                <Image
                                  src={connectFB}
                                  alt={t('Facebook logo')}
                                  style={{ height: '46px' }}
                                />
                                <Image
                                  src={connectGoogle}
                                  alt={t('Gmail logo')}
                                  style={{ height: '48px' }}
                                  className="mt-2"
                                />
                              </>
                            )}
                            <div
                              className="hpMenu-botm"
                              style={{ padding: '0' }}
                            >
                              <div className="profile-logout">
                                <Link href="/" onClick={() => handleLogout()}>
                                  {t('Log out')}
                                </Link>
                              </div>
                            </div>
                          </div>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </div>
            <div className="headerMsg">
              <div className="msgIcon" onClick={handleClick}>
                <NotificationsIcon style={{ color: '#b5b5b5' }} />
                {!allNotifications?.isRead && (
                  <span className="activeMsg"></span>
                )}
              </div>
              <Menu
                onClose={handleClick}
                open={openPopover}
                anchorEl={anchorEl}
                className="notificationList"
                sx={{
                  marginTop: '1.5rem',
                  '& .MuiPaper-root': {
                    backgroundColor: '#420C29',
                    color: '#B5B5B5',
                    borderRadius: '10px',
                    boxShadow: '0px 2px 8px rgba(0,0,0,0.32)',
                    maxWidth: '450px',
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                {!allNotifications?.isRead && notificationsLength > 0 && (
                  <div className="d-flex justify-content-end mx-3">
                    <Button
                      style={{
                        fontWeight: '600',
                        color: 'white',
                        backgroundColor: 'var(--gray-400, #580935)',
                        textTransform: 'none',
                      }}
                      onClick={() => handleMarkAsRead('many')}
                    >
                      {t('Mark all as read')}
                    </Button>
                  </div>
                )}
                {notificationsLength > 0 ? (
                  allNotifications?.notification?.map((notification, index) => (
                    <div
                      onClick={() =>
                        handleMarkAsRead('single', notification?._id)
                      }
                      key={notification?._id}
                      style={{
                        fontWeight: '600',
                        padding: '0px 20px',
                        fontSize: '18px',
                        color: '#B5B5B5',
                        margin: '15px 0px 8px 0px',
                        cursor: notification?.read ? '' : 'pointer',
                        background: notification?.read
                          ? ''
                          : 'var(--gray-400, #580935)',
                      }}
                    >
                      <div
                        className="d-flex  align-items-center"
                        style={{
                          padding: '10px',
                        }}
                      >
                        <div
                          className="p-2 rounded-circle"
                          style={{
                            backgroundColor: 'var(--gray-600, #A2246B)',
                          }}
                        >
                          <NotificationsNoneOutlined
                            style={{
                              fontSize: '30px',
                              color: '#B5B5B5',
                            }}
                          />
                        </div>
                        <div className="flex-grow-1 d-flex justify-content-between align-items-center ms-3">
                          <Typography variant="body1">
                            <strong
                              style={{
                                color: '#ffffff',
                                fontWeight: '600',
                                marginBottom: '0.5rem',
                              }}
                            >
                              {notification?.title}
                            </strong>{' '}
                            <br />
                            <p
                              style={{
                                color: '#B5B5B5',
                                fontWeight: '400',
                                fontSize: '14px',
                                marginBottom: '0px',
                              }}
                            >
                              {' '}
                              {notification?.content}
                            </p>
                          </Typography>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="d-flex justify-content-center p-3">
                    <Typography
                      variant="body1"
                      sx={{ color: 'white', ml: 1, fontWeight: '900' }}
                    >
                      {t('No notifications')}
                    </Typography>
                  </div>
                )}
              </Menu>
            </div>
            <div>
              <LanguageSwitcher />
            </div>
          </div>
        ) : (
          <div className="loginSignUp-btn">
            <div className="search-input my-1 d-none d-md-block">
              <CustomOutlinedInput
                placeholder={t('Search games')}
                className=""
                startAdornment={
                  <InputAdornment position="start">
                    {/* <SearchIcon sx={{ color: '#fff' }} /> */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <g clip-path="url(#clip0_2816_7411)">
                        <path
                          d="M17.6596 16.2453C17.269 15.8548 16.6359 15.8548 16.2454 16.2453C15.8548 16.6358 15.8548 17.269 16.2453 17.6595L17.6596 16.2453ZM19.2929 20.7071C19.6834 21.0976 20.3166 21.0976 20.7071 20.7071C21.0976 20.3166 21.0976 19.6834 20.7071 19.2929L19.2929 20.7071ZM16.2453 17.6595L19.2929 20.7071L20.7071 19.2929L17.6596 16.2453L16.2453 17.6595ZM10.8572 16.7143C7.62233 16.7143 5 14.0919 5 10.8571H3C3 15.1965 6.51777 18.7143 10.8572 18.7143V16.7143ZM16.7143 10.8571C16.7143 14.0919 14.092 16.7143 10.8572 16.7143V18.7143C15.1965 18.7143 18.7143 15.1965 18.7143 10.8571H16.7143ZM10.8572 5C14.092 5 16.7143 7.62233 16.7143 10.8571H18.7143C18.7143 6.51775 15.1965 3 10.8572 3V5ZM10.8572 3C6.51777 3 3 6.51775 3 10.8571H5C5 7.62233 7.62233 5 10.8572 5V3Z"
                          fill="url(#paint0_linear_2816_7411)"
                        />
                      </g>
                      <defs>
                        <linearGradient
                          id="paint0_linear_2816_7411"
                          x1="4"
                          y1="12"
                          x2="19.7526"
                          y2="12"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#4473E9" />
                          <stop offset="1" stop-color="#7E43DE" />
                        </linearGradient>
                        <clipPath id="clip0_2816_7411">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </InputAdornment>
                }
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                fullWidth
              />
            </div>

            <button
              type="button"
              className="btn login-btn"
              onClick={() => handleLoginSignupTab(0)}
            >
              {t('Log in')}
            </button>
            <button
              type="button"
              className="btn signUp-btn  btn-gradient"
              onClick={() => handleLoginSignupTab(1)}
            >
              {t('Register')}
            </button>
            <div>
              <LanguageSwitcher />
            </div>
          </div>
        )}
      </header>

      {/*===== Login Popup ===*/}
      <Dialog
        className="signUpModaluniversal"
        open={openLoginModal}
        onClose={handleCloseLoginModal}
        scroll="body"
      >
        <Login
          handleCloseLoginModal={handleCloseLoginModal}
          setOpenLoginModal={setOpenLoginModal}
          tabIndex={tabIndex}
          setTabIndex={setTabIndex}
        />
      </Dialog>

      {/* ===== Wallet Popup ===== */}
      <Dialog
        className="WalletModaluniversal"
        open={openWalletModal}
        onClose={handleCloseWalletModal}
        scroll="body"
      >
        <WalletPopup
          handleCloseWalletModal={handleCloseWalletModal}
          Wallet_Anchor={Wallet_Anchor}
          setWallet_Anchor={setWallet_Anchor}
        />
      </Dialog>
    </>
  )
}

export default Header
