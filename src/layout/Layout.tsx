import { useEffect, useState } from 'react'
import { useAppDispatch } from '@/redux/hooks'
import { removeUser, setUser } from '@/redux/user/userReducer'
import { setMaintenance } from '@/redux/games/gamesReducer'
import { useRouter } from 'next/router'
import { getLocalStorageItem, logError, setLocalStorageItem } from '@/utils'
import socketService from '@/services/socketService'
import dynamic from 'next/dynamic'
import { PostMethod } from '@/services/fetchAPI'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

const Footer = dynamic(() => import('./Footer'), { ssr: false })
const Header = dynamic(() => import('./Header'), { ssr: false })
const Sidebar = dynamic(() => import('./Sidebar'), { ssr: false })

const Layout = ({ handleSearch, searchQuery, children }: any) => {
  const socket = socketService.getSocket()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [active, setActive] = useState(false)
  const { t } = useTranslation()

  const handleActive = () => {
    setActive(false)
  }

  const handleStatus = (res: { isMaintenance: boolean }) => {
    setLocalStorageItem('maintenance', res.isMaintenance)
    dispatch(setMaintenance(res.isMaintenance))
  }

  socket.on('maintenanceMode', handleStatus)

  const fetchRefreshToken = async (userId: Object) => {
    try {
      const res: any = await PostMethod('refreshToken', userId)

      if (res.data?.status !== 'success') {
        throw new Error(res.data.message || t('Something went wrong'))
      }

      if (
        res.data?.result &&
        res.data?.result.length > 0 &&
        res.data.result[0].role !== 'affiliate'
      ) {
        dispatch(setUser(res?.data?.result[0]))
      } else {
        throw new Error(res.data.message || t('Something went wrong'))
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        router.push('/').then(() => dispatch(removeUser()))
        // toast.error(error.message)
        logError(error)
      }
    }
  }

  const fetchData = async (userId: Object) => {
    try {
      const res: any = await PostMethod('getUserDetails', userId)

      if (res.data?.status !== 'success') {
        throw new Error(res.data.message || t('Something went wrong'))
      }

      if (
        res.data?.result &&
        res.data?.result.length > 0 &&
        res.data.result[0].role !== 'affiliate'
      ) {
        dispatch(setUser(res?.data?.result[0]))
      } else {
        throw new Error(res.data.message || t('Something went wrong'))
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        router.push('/').then(() => dispatch(removeUser()))
        // toast.error(error.message)
        logError(error)
      }
    }
  }

  useEffect(() => {
    const auth: any = getLocalStorageItem('auth')
    const maintenance = getLocalStorageItem('maintenance')
    dispatch(setMaintenance(maintenance))
    if (auth?.token) {
      fetchData({
        userId: auth?._id,
      })
    }

    // if (auth?.token && auth.expiriesAt) {
    //   const expireData = dayjs.utc(auth.expiriesAt)
    //   const currentData = dayjs().utc()
    //   const diff = expireData.diff(currentData, 'minute', true)
    //   if (diff < 10) {
    //     fetchRefreshToken({
    //       userId: auth?._id,
    //     })
    //   } else {
    //     fetchData({
    //       userId: auth?._id,
    //     })
    //   }
    // }

    return () => {
      if (socketService.isConnected()) {
        socket.off('maintenanceMode', handleStatus)
      }
    }
  }, [dispatch, router?.asPath])

  useEffect(() => {
    setActive(
      ['/poker-game', '/sport-bet', '/play-game'].includes(router?.asPath) &&
        false,
    )
  }, [router.asPath])

  if (router.pathname === '/poker-game') {
    return <>{children}</>
  }

  return (
    <>
      <Header
        setActive={setActive}
        active={active}
        handleSearch={handleSearch}
        searchQuery={searchQuery}
      />
      <Sidebar
        active={active}
        handleSearch={handleSearch}
        searchQuery={searchQuery}
        handleActive={handleActive}
      />

      <main
        className={active ? 'sideBarOpen' : ''}
        style={router.pathname === '/sport-bet' ? { marginBottom: '0px' } : {}}
      >
        {children}
      </main>
      <Footer active={active} />
    </>
  )
}

export default Layout
