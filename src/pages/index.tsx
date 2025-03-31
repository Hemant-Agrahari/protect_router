import { Dialog } from '@mui/material'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import PromotionBanner_Modal from '@/component/HeaderModals/PromotionBanner_Modal'
import { PostMethod } from '@/services/fetchAPI'
import Login from '../component/Login'
import { NoGamesMessage } from '@/component/Homepage/NoGamesMessage'
import TopBanners from '@/component/Homepage/TopBanners'
import HomePageGamesAllGames from '@/component/Homepage/HomePageAllGames'
import { GetStaticProps } from 'next'
import { commonStaticProps } from '@/utils/translation'
import Searchbar from '@/component/common/searchbar'
import useDebounce from '@/utils/useDebounce'
import dynamic from 'next/dynamic'
import { logError } from '@/utils'
import { useAppSelector } from '@/redux/hooks'
import Maintenance from '@/component/Homepage/maintenance'

const MenuSlider = dynamic(() => import('@/component/common/MenuSlider'), {
  ssr: false,
})

// Method is for language switch
export const getStaticProps: GetStaticProps = async (context) => {
  const { locale } = context
  return commonStaticProps(locale!)
}
function Home({
  searchQuery,
  handleSearch,
}: {
  searchQuery: string
  handleSearch: (query: string) => void
}) {
  const [provider, setProvider] = useState('slotegrator')
  const [gamePost, setGamePost] = useState<any>([])
  const isMaintenance = useAppSelector((state) => state.games.isMaintenance)
  const [searchedGame, setSearchedGame] = useState<any>([])
  const [isLoading, setLoading] = useState(true)
  const [openLoginModal, setOpenLoginModal] = useState(false)
  const handleCloseLoginModal = () => setOpenLoginModal(false)
  const [tabIndex, setTabIndex] = useState(0)
  const [gameType, setGameType] = useState<{ type: string; subType: string }>({
    type: 'allgames',
    subType: '',
  })
  const gameLimits = useRef(0)
  const totalGames = useRef(0)

  const fetchGame = () => {
    setLoading(true)
    const params = {
      search: searchQuery.trim(),
      type: gameType.type,
      provider: 'slotegrator',
      subType: gameType.subType,
      skip: '',
      limit: '',
    }

    PostMethod(`game`, params)
      .then((res: any) => {
        totalGames.current = res.data.result.totalGame
        const games: any = res.data.result.allGames

        if (searchQuery && searchQuery.length > 0) {
          setSearchedGame(Object.entries(games))
          setGamePost([])
        } else if (gameType.type === 'allgames') {
          setGamePost(Object.entries(games))
        }
      })
      .catch((error) => {
        logError(`Error fetching game data: ${error}`)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const debounce = useDebounce(fetchGame, 150)

  const handleGameLimit = (digit: number) => {
    fetchGame()
  }

  useEffect(() => {
    debounce()
  }, [searchQuery, isMaintenance])

  if (isMaintenance) {
    return (
      <div className="container-fluid">
        <TopBanners />

        <Maintenance />
      </div>
    )
  }

  return (
    <div>
      <div className="container-fluid">
        {/* Silder */}
        <div className="topmenu-slider">
          <MenuSlider isUpperSlider={true} slug="allgames" />
        </div>
        <TopBanners />
        <div className="topmenu-slider mt-5 subcate-slider">
          <MenuSlider isLowerSlider={true} slug="allgames" />
        </div>

        {/* search */}
        <div className="mt-3">
          <Searchbar handleSearch={handleSearch} searchQuery={searchQuery} />
        </div>

        {/* =========== Types wise game mapping =============== */}
        {isLoading ? (
          <div className="loader-animate-division">
            <div className="loader"></div>
          </div>
        ) : (
          <div className="row  p-md-3 pb-3 pt-md-2 px-0">
            <div className="col-12">
              {searchQuery.length > 0 && searchedGame.length > 0 ? (
                <div>
                  {Array.isArray(searchedGame) && searchedGame.length > 0 ? (
                    searchedGame.map((item: any, index: number) =>
                      Array.isArray(item[1]) && item[1].length > 0 ? (
                        <Fragment key={index}>
                          <HomePageGamesAllGames
                            key={`${provider}`}
                            provider={item[0]}
                            games={item[1]}
                            handleGameLimit={handleGameLimit}
                            totalGames={totalGames.current}
                            gameLimits={gameLimits}
                          />
                        </Fragment>
                      ) : (
                        ''
                      ),
                    )
                  ) : (
                    <>
                      <NoGamesMessage />
                    </>
                  )}
                </div>
              ) : (
                <div className="row  p-md-3 pb-3 pt-md-2 px-0">
                  <div className="col-12">
                    <div>
                      {Array.isArray(gamePost) && gamePost.length > 0 ? (
                        gamePost.map((item: any, index: number) =>
                          Array.isArray(item[1]) && item[1].length > 0 ? (
                            <Fragment key={index}>
                              <HomePageGamesAllGames
                                key={`${provider}`}
                                provider={item[0]}
                                games={item[1]}
                                handleGameLimit={handleGameLimit}
                                totalGames={totalGames.current}
                                gameLimits={gameLimits}
                              />
                            </Fragment>
                          ) : (
                            ''
                          ),
                        )
                      ) : (
                        <NoGamesMessage />
                      )}
                    </div>
                  </div>
                </div>
              )}
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
    </div>
  )
}

export default dynamic(() => Promise.resolve(Home), {
  ssr: false,
})
