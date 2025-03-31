import { PostMethod } from '@/services/fetchAPI'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { GetStaticProps } from 'next'
import { commonStaticProps } from '@/utils/translation'
import { useTranslation } from 'react-i18next'
import dynamic from 'next/dynamic'
import { logError } from '@/utils'
import { useAppSelector } from '@/redux/hooks'
import Maintenance from '@/component/Homepage/maintenance'

// Method is for language switch
export const getStaticProps: GetStaticProps = async (context) => {
  const { locale } = context
  return commonStaticProps(locale!)
}

const PlayGame = () => {
  const router = useRouter()
  const { gameId, provider } = router.query
  const [userId, setUserId] = useState<string | null>(null)
  const isMaintenance = useAppSelector((state) => state.games.isMaintenance)
  const [gameUrl, setGameUrl] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()

  useEffect(() => {
    try {
      const auth = localStorage.getItem('auth')
      if (!auth) {
        router.push('/').then(() => toast.error(t('Please login')))
      } else if (auth) {
        const user = JSON.parse(auth)
        setUserId(user?._id || null) // Safely access _id
      }
    } catch (error) {
      logError(`Error fetching game data: ${error}`)
    }
  }, [])

  const fetchGameUrl = () => {
    const params = {
      userId: userId,
      gameId: gameId,
      provider: provider,
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
    if (provider === 'DPGames') {
      router.push('/sport-bet')
    } else if (provider === 'AIS') {
      router.push('/poker-game')
    } else if (gameId && provider && userId) {
      fetchGameUrl()
    }
  }, [gameId, provider, userId, isMaintenance])

  if (isMaintenance) {
    return <Maintenance />
  }

  return (
    <div className="container-fluid px-1">
      {loading ? (
        <div className="loader-animate-division">
          <div className="loader"></div>
        </div>
      ) : (
        <iframe
          src={gameUrl}
          title="title"
          width="100%"
          height="700px"
          allowFullScreen
        />
      )}
    </div>
  )
}

export default dynamic(() => Promise.resolve(PlayGame), {
  ssr: false,
})
