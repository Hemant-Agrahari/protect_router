import React, { useEffect, useState } from 'react'
import { Dialog } from '@mui/material'
import Login from '../Login'
import { useAppSelector } from '@/redux/hooks'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { logError, processGames } from '@/utils'
import { useTranslation } from 'react-i18next'

const HomePageGamesAllGames = ({ provider, games }: any) => {
  const base_url = process.env.NEXT_PUBLIC_IMAGE_URL
  const user = useAppSelector((state) => state.user.user)
  const { t } = useTranslation()
  const router = useRouter()
  const [openLoginModal, setOpenLoginModal] = useState(false)
  const [tabIndex, setTabIndex] = useState(0)
  const [displayedGames, setDisplayedGames] = useState<any>([])

  const callaa = async () => {
    try {
      let res = await processGames(games)
      setDisplayedGames(res)
      return res
    } catch (error) {
      logError(`Error fetching game data: ${error}`)
    }
  }

  const handleCloseLoginModal = (
    redirection?: boolean,
    gameId?: string,
    provider?: string,
  ) => {
    if (redirection && gameId && provider) {
      router
        .push({ pathname: '/play-game', query: { gameId, provider } })
        .then(() => setOpenLoginModal(false))
    } else {
      setOpenLoginModal(false)
    }
  }

  useEffect(() => {
    try {
      if (games && Array.isArray(games) && games.length > 0) {
        callaa()
      }
    } catch (error) {
      logError(`Error fetching game data: ${error}`)
    }
  }, [games])

  const handleGameInit = (
    event: React.MouseEvent<HTMLDivElement>,
    item: any,
  ) => {
    event.preventDefault()
    if (item?.KeyName === 'BetBy') {
      router.push('/sport-bet')
      return
    }

    if (user && user?._id) {
      handleCloseLoginModal(true, item?._id, item?.provider)
    } else {
      setOpenLoginModal(true)
    }
  }

  return (
    <div className="py-3">
      <div className="d-flex flex-row tab-title">
        <h4
          className="text-capitalize"
          style={{ color: '#fff', fontWeight: '700' }}
        >
          {t(provider)}
        </h4>
      </div>
      <div className="homeTab-content mt-3">
        <>
          {displayedGames && displayedGames.length > 0
            ? displayedGames.map((item: any, key: any) => (
                <div
                  className="homeTabContent-col"
                  key={item.BrandGameId}
                  onClick={(event) => handleGameInit(event, item)}
                >
                  <div className="gameImg">
                    <Image
                      src={
                        item?.customImage
                          ? `${base_url}${item.customImage}`
                          : item.isValidImageUrl
                            ? item.gameImageUrl
                            : provider.type === 'crash'
                              ? `${base_url}${item.gameImageUrl}`
                              : '/assets/images/gameImage.png'
                      }
                      alt={t('Game image')}
                      height={140}
                      width={200}
                      className="img-lazy"
                      unoptimized
                    />
                  </div>
                  <h6>
                    {item?.type === 'vivo' &&
                    item?.provider.type === 'live games'
                      ? item?.GameTypeName
                      : item.Name}
                  </h6>
                </div>
              ))
            : ''}
        </>
        <Dialog
          className="signUpModaluniversal"
          open={openLoginModal}
          onClose={() => handleCloseLoginModal(false)}
          scroll="body"
        >
          <Login
            handleCloseLoginModal={handleCloseLoginModal}
            setOpenLoginModal={setOpenLoginModal}
            tabIndex={tabIndex}
            setTabIndex={setTabIndex}
          />
        </Dialog>
      </div>
    </div>
  )
}

export default HomePageGamesAllGames
