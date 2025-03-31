import { Dialog } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import PromotionBanner_Modal from '@/component/HeaderModals/PromotionBanner_Modal'
import HomeGames from '@/component/Homepage/HomeGames'
import Login from '@/component/Login'
import { useRouter } from 'next/router'
import { NoGamesMessage } from '@/component/Homepage/NoGamesMessage'
import { GetStaticProps } from 'next'
import { commonStaticProps } from '@/utils/translation'
import { PostMethod } from '@/services/fetchAPI'
import Searchbar from '@/component/common/searchbar'
import dynamic from 'next/dynamic'
import { logError, removeExtraSymbols } from '@/utils'
import { useTranslation } from 'react-i18next'
import useDebounce from '@/utils/useDebounce'
import Maintenance from '@/component/Homepage/maintenance'
import { useAppSelector } from '@/redux/hooks'

const MenuSlider = dynamic(() => import('@/component/common/MenuSlider'), {
  ssr: false,
})

// Method is for language switch
export const getStaticProps: GetStaticProps = async (context) => {
  const { locale } = context
  return commonStaticProps(locale!)
}

function GameCategory({
  searchQuery,
  handleSearch,
}: {
  searchQuery: string
  handleSearch: (query: string) => void
}): React.JSX.Element {
  const router = useRouter()
  const [provider, setProvider] = useState('slotegrator')
  const [gamePost, setGamePost] = useState<any>([])
  const { mainType, subType } = router.query as any
  const [openLoginModal, setOpenLoginModal] = useState(false)
  const [isLoading, setLoading] = useState(true)
  const handleCloseLoginModal = () => setOpenLoginModal(false)
  const isMaintenance = useAppSelector((state) => state.games.isMaintenance)
  const [tabIndex, setTabIndex] = useState(0)
  const { t } = useTranslation()
  const gameLimits = useRef(0)
  const totalGames = useRef(0)

  const fetchGame = (limit: number, mainType?: string, subType?: string) => {
    const params = {
      search: searchQuery.trim(),
      type: mainType || '',
      provider: 'slotegrator',
      subType: subType || '',
      skip: limit,
      limit: 24,
    }

    PostMethod(`game`, params)
      .then((res: any) => {
        totalGames.current = res.data.result.totalGame
        const games: any = res.data.result.allGames[`${mainType}`]
        if (gameLimits.current === 0) {
          setGamePost(games)
        } else {
          setGamePost([...gamePost, ...games])
        }
      })
      .catch((error) => {
        logError(`Error fetching game data: ${error}`)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const debounce = useDebounce(fetchGame, 200)

  const handleGameLimit = (digit: number) => {
    gameLimits.current = gameLimits.current + digit
    fetchGame(gameLimits.current, mainType as string, subType as string)
  }

  useEffect(() => {
    setLoading(true)
    setGamePost([])
    gameLimits.current = 0
    debounce(0, mainType as string, subType as string)
  }, [searchQuery, mainType, subType, isMaintenance])

  if (isMaintenance) {
    return <Maintenance />
  }

  return (
    <>
      <div className="container-fluid">
        <div className="topmenu-slider">
          <MenuSlider isUpperSlider={true} />
        </div>

        <div
          className="topmenu-slider mt-5 subcate-slider"
          style={mainType === 'slots' ? { display: 'none' } : {}}
        >
          <MenuSlider isLowerSlider={true} />
        </div>

        {/* Search */}
        <div className="py-3">
          <Searchbar handleSearch={handleSearch} searchQuery={searchQuery} />
        </div>
        <div className="d-flex flex-row tab-title">
          <h4
            className="text-capitalize"
            style={{ color: '#fff', fontWeight: '700' }}
          >
            {subType
              ? `${t(mainType!)} / ${t(removeExtraSymbols(subType))}`
              : t(mainType)}
          </h4>
        </div>
        {isLoading ? (
          <div className="loader-animate-division">
            <div className="loader"></div>
          </div>
        ) : (
          <div className="row  p-md-3 pb-3 pt-2 px-0">
            <div className="col-12">
              <div>
                {gamePost && Object.keys(gamePost).length > 0 ? (
                  <HomeGames
                    key={`${provider}`}
                    provider={{
                      type: mainType,
                      subType: subType,
                    }}
                    games={gamePost}
                    handleGameLimit={handleGameLimit}
                    totalGames={totalGames.current}
                    gameLimits={gameLimits}
                  />
                ) : (
                  <NoGamesMessage
                    isShowHeading={false}
                    gameName={{
                      type: mainType as string,
                      subType: subType as string,
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>

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

      <PromotionBanner_Modal />
    </>
  )
}

export default dynamic(() => Promise.resolve(GameCategory), {
  ssr: false,
})
