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
  const router = useRouter()
  const [gameDetails, setGameDetails] = useState<{
    provider: string
    gameId: string
  }>({ provider: '', gameId: '' })
  const [isLoading, setLoading] = useState<boolean>(true)
  const [gameUrl, setGameUrl] = useState<string>('')
  const isMaintenance = useAppSelector((state) => state.games.isMaintenance)
  const gameType: string = 'poker'
  const { t } = useTranslation()
  let user: any = getLocalStorageItem('auth')

  const fetchGameData = async () => {
    const params = { provider: 'AIS', type: gameType }
    try {
      setLoading(true)
      const res: any = await PostMethod('game', params)

      if (res.data.status !== 'success') {
        toast.error(res?.data.message)
        throw new Error(res?.data.message)
      }

      const gameId = res?.data?.result?.allGames[gameType]?.[0]?._id
      const provider = res?.data?.result?.allGames[gameType]?.[0]?.provider
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
    PostMethod('urlGameAction', params)
      .then((res: any) => {
        if (res.data.status !== 'success') {
          toast.error(res?.data.message)
          router.push('/')
        }
        setGameUrl(res.data.result.gameUrl)
      })
      .catch((error) => {
        logError(`Error fetching game data: ${error}`)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (user?._id) {
      fetchGameData()
    } else {
      router.push('/').then(() => toast.error(t('Please login')))
    }
  }, [])

  useEffect(() => {
    if (!gameDetails.gameId || !gameDetails.provider) return
    fetchGameUrl()
  }, [gameDetails.gameId, gameDetails.provider, isMaintenance])

  if (isMaintenance) {
    return <Maintenance />
  }

  return (
    <div>
      <div className="container-fluid px-1">
        {isLoading ? (
          <div className="loader-animate-division">
            <div className="loader"></div>
          </div>
        ) : (
          <iframe
            style={isMobile ? { height: '96dvh' } : { height: '100vh' }}
            src={gameUrl}
            title="title"
            width="100%"
            allowFullScreen
          />
        )}
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(PokerGame), {
  ssr: false,
})
