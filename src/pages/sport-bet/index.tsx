import { useAppSelector } from '@/redux/hooks'
import React, { useEffect, useState } from 'react'
import { PostMethod } from '@/services/fetchAPI'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { GetStaticProps } from 'next'
import { commonStaticProps } from '@/utils/translation'
import dynamic from 'next/dynamic'
import { getLocalStorageItem, logError } from '@/utils'
import { isMobile } from 'react-device-detect'
import Maintenance from '@/component/Homepage/maintenance'

export const getStaticProps: GetStaticProps = async (context) => {
  const { locale } = context
  return commonStaticProps(locale!)
}

const PokerGame: React.FC = () => {
  const [gameDetails, setGameDetails] = useState<{
    provider: string
    gameId: string
  }>({ provider: '', gameId: '' })
  const [isLoading, setLoading] = useState<boolean>(true)
  const [gameUrl, setGameUrl] = useState<string>('')
  const router = useRouter()
  const isMaintenance = useAppSelector((state) => state.games.isMaintenance)
  const gameType: string = 'SportsBet'
  const { t } = useTranslation()
  let user: any = getLocalStorageItem('auth')

  const fetchGameData = async () => {
    const params = { provider: 'DPGamesSports', type: gameType }
    try {
      setLoading(true)
      const res: any = await PostMethod('game', params)

      if (res.data.status !== 'success') {
        toast.error(res?.data.message)
        throw new Error(res?.data.message)
      }

      const gameId = res?.data?.result?.allGames[gameType]?.[0]?._id
      const provider = 'DPGamesSports'
      setGameDetails({ provider: provider, gameId: gameId })
    } catch (error) {
      logError(`Error fetching game data: ${error}`)
    }
  }

  const fetchGameUrl = () => {
    const params = {
      userId: user?._id,
      gameId: gameDetails.gameId,
      provider: gameDetails.provider,
    }
    setLoading(true)
    PostMethod('urlGameAction', params)
      .then((res: any) => {
        if (res.data.status !== 'success') {
          throw new Error(res.data.message || t('Something went wrong'))
        }

        if (
          res.data.result.gameUrl.web &&
          res.data.result.gameUrl.web.length > 0
        ) {
          if (isMobile) {
            setGameUrl(res.data.result.gameUrl.mobile)
          } else {
            setGameUrl(res.data.result.gameUrl.web)
          }
        } else {
          throw new Error(res.data.message || t('Something went wrong'))
        }
      })
      .catch((error: unknown) => {
        if (error instanceof Error) {
          router
            .push('/')
            .then(() => toast.error(error.message || t('Please login')))
          logError(error)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchGameData()
  }, [])

  useEffect(() => {
    if (!gameDetails.gameId || !gameDetails.provider) return
    fetchGameUrl()
  }, [gameDetails.gameId, gameDetails.provider, isMaintenance])

  if (isMaintenance) {
    return <Maintenance />
  }

  return (
    <div className="similarGames container-fluid px-1">
      {isLoading ? (
        <div className="loader-animate-division">
          <div className="loader"></div>
        </div>
      ) : (
        <iframe
          src={gameUrl}
          title="title"
          width="100%"
          height="3000px"
          allowFullScreen
        />
      )}
    </div>
  )
}

export default dynamic(() => Promise.resolve(PokerGame), {
  ssr: false,
})
