import React, { Fragment, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { AffiliateModal } from '@/component/Affiliate'
import { GetMethod } from '@/services/fetchAPI'
import { logError, removeExtraSymbols } from '@/utils'
import { Dialog, Tooltip } from '@mui/material'
import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import Login from '../component/Login'
import { setGameProvider } from '@/redux/games/gamesReducer'
import { useTranslation } from 'react-i18next'

const Sidebar = ({ active, handleActive }: any) => {
  const router = useRouter()
  const { mainType, subType } = router.query
  const user = useAppSelector((state) => state.user.user)
  const dispatch = useAppDispatch()

  const { t } = useTranslation()
  const [otherTypeGames, setOtherTypeGames] = useState<Array<string>>()
  const [openLoginModal, setOpenLoginModal] = useState(false)
  const [tabIndex, setTabIndex] = useState(0)
  const [isOpenAffiliate, setIsOpenAffiliate] = useState(false)
  const [showMenu, setShowMenu] = useState<string>('')
  const [promotions, setPromotions] = useState<any>([])

  const handleCloseLoginModal = () => setOpenLoginModal(false)

  const fetchOtherTypeGames = async () => {
    try {
      const result: any = await GetMethod('othersTypeGames')

      if (result.data.status !== 'success') {
        throw new Error('othersTypeGames api is not working')
      }

      if (result.data.result && result.data.result.length > 0) {
        setOtherTypeGames(result.data.result)
      }
    } catch (error) {
      logError(error)
    }
  }

  useEffect(() => {
    fetchOtherTypeGames()
    GetMethod(`promotionpackage`)
      .then((response: unknown) => {
        setPromotions((response as any)?.data.result.promotionData)
      })
      .catch((err) => {
        logError(err)
      })
  }, [active])

  const handleUserAuth = () => {
    if (user === null) {
      setOpenLoginModal(true)
    } else {
      router.push('/ranking-vip')
    }
  }

  const handleArrowClick = (
    e: React.MouseEvent<HTMLDivElement>,
    game: string,
    isCloseSidebar: boolean,
  ) => {
    e.stopPropagation()
    if (isCloseSidebar) {
      handleActive()
    }

    if (showMenu === game) {
      handleShowMenu('')
    } else {
      handleShowMenu(game)
    }
    router.push({ pathname: '/games-category', query: { mainType: game } })
  }

  const handleMainType = (
    e: React.MouseEvent<HTMLLIElement>,
    mainType: string,
  ) => {
    handleShowMenu(mainType)
    router.push({ pathname: '/games-category', query: { mainType } })
  }

  const handleSubType = (
    e: React.MouseEvent<HTMLLIElement>,
    mainType: string,
    subType: string,
  ) => {
    e.stopPropagation()
    handleActive()
    handleShowMenu(mainType)
    router.push({ pathname: '/games-category', query: { mainType, subType } })
  }

  const hanldeOpenAffilatte = () => {
    handleShowMenu('affilate')
    setIsOpenAffiliate(true)
  }

  const handleCloseAffilatte = () => {
    setIsOpenAffiliate(false)
  }

  const handleSportBetting = () => {
    handleShowMenu('sports betting')
    dispatch(setGameProvider('sports betting' as any))
    router.push({
      pathname: '/sport-bet',
      query: { mainType: 'sports betting' },
    })
  }

  const gameTypes = [
    {
      mainType: {
        image: '/assets/images/sports-bet-icon.svg',
        name: 'sports betting',
      },
      subType: [
        { image: '/assets/images/sports-bet-icon.svg', name: 'sports betting' },
      ],
    },
    {
      mainType: { image: '/assets/images/slots.svg', name: 'slots' },
      subType: [{ image: '/assets/images/slots.svg', name: 'slots' }],
    },
    {
      mainType: { image: '/assets/images/casino.svg', name: 'casino' },
      subType: [
        { image: '/assets/images/bacarrat1.svg', name: 'blackjack' },
        { image: '/assets/images/roulete.svg', name: 'roulette' },
        { image: '/assets/images/bacarrat.svg', name: 'baccarat' },
        { image: '/assets/images/table.svg', name: 'table' },
        { image: '/assets/images/poker.svg', name: 'poker' },
        { image: '/assets/images/videopoker.svg', name: 'video poker' },
      ],
    },
    {
      mainType: { image: '/assets/images/card_games.png', name: 'card games' },
      subType: [
        { image: '/assets/images/bacarrat.svg', name: 'baccarat' },
        { image: '/assets/images/blackjack.svg', name: 'blackjack' },
        { image: '/assets/images/card.svg', name: 'card' },
      ],
    },
    {
      mainType: { image: '/assets/images/crash.png', name: 'crash' },
      subType: [
        { image: '/assets/images/aviator.svg', name: 'aviator' },
        { image: '/assets/images/aviatormobile.svg', name: 'aviator mobile' },
        { image: '/assets/images/crash.png', name: 'crash' },
      ],
    },
    {
      mainType: { image: '/assets/images/lottery.png', name: 'lottery' },
      subType: [
        { image: '/assets/images/scratchcard.svg', name: 'scratch card' },
        { image: '/assets/images/scratch.svg', name: 'scratch' },
      ],
    },
    {
      mainType: { image: '/assets/images/mini_games.png', name: 'mini games' },
      subType: [
        { image: '/assets/images/robinhood.svg', name: 'Robin Hood Mobile' },
        { image: '/assets/images/instant.svg', name: 'instant' },
        { image: '/assets/images/roulete.svg', name: 'mini games' },
        { image: '/assets/images/mini_games.png', name: 'minigame' },
        { image: '/assets/images/instantwin.svg', name: 'instant win' },
        { image: '/assets/images/instantgame.svg', name: 'instant game' },
      ],
    },
    {
      mainType: { image: '/assets/images/poker.svg', name: 'table poker' },
      subType: [{ image: '/assets/images/poker.svg', name: 'poker' }],
    },
    {
      mainType: { image: '/assets/images/bet_games.png', name: 'bet games' },
      subType: [
        { image: '/assets/images/keno.svg', name: 'keno' },
        { image: '/assets/images/betting.svg', name: 'betting' },
        { image: '/assets/images/sicbo.svg', name: 'sic bo' },
      ],
    },
    {
      mainType: { image: '/assets/images/arcade.png', name: 'arcade' },
      subType: [
        { image: '/assets/images/arcade.png', name: 'arcade' },
        { image: '/assets/images/mines.svg', name: 'mines' },
      ],
    },
    {
      mainType: { image: '/assets/images/live_games.png', name: 'live games' },
      subType: [
        { image: '/assets/images/live_games.png', name: 'live dealer' },
      ],
    },
    {
      mainType: { image: '/assets/images/candybonanza.svg', name: 'others' },
      subType:
        otherTypeGames &&
        otherTypeGames.map((item: string) => {
          return { image: '/assets/images/casino.svg', name: item }
        }),
    },
  ]

  const menuItems = [
    {
      path: '/',
      imgSrc: '/assets/images/home.svg',
      imgAlt: 'Home',
      imgWidth: 24,
      imgHeight: 24,
      linkName: 'Home',
    },
    {
      path: '/promotion-center',
      imgSrc: '/assets/images/promotions.svg',
      imgAlt: 'Promotions',
      imgWidth: 24,
      imgHeight: 24,
      linkName: 'Promotions',
    },
    {
      path: '/ranking-vip',
      imgSrc: '/assets/images/rankvip.svg',
      imgAlt: 'Ranking VIP',
      imgWidth: 20,
      imgHeight: 20,
      linkName: 'Ranking VIP',
    },
    {
      path: '#',
      imgSrc: '/assets/images/affiliate.svg',
      imgAlt: 'Affiliate',
      imgWidth: 20,
      imgHeight: 20,
      linkName: 'Affiliate',
      component: <AffiliateModal />,
    },
    {
      path: '/contact-us',
      imgSrc: '/assets/images/livesupport.svg',
      imgAlt: 'Live Support',
      imgWidth: 20,
      imgHeight: 20,
      linkName: 'Live Support',
    },
    {
      path: '#',
      imgSrc: '/assets/images/telegram.svg',
      imgAlt: 'Telegram',
      imgWidth: 20,
      imgHeight: 20,
      linkName: 'Telegram',
    },
    {
      path: '/poker-game',
      imgSrc: '/assets/images/poker.svg',
      imgAlt: 'online poker',
      imgWidth: 24,
      imgHeight: 24,
      linkName: 'online poker',
    },
  ]

  const menuItemsWithTooltips = [
    {
      path: '/',
      imgSrc: '/assets/images/home.svg',
      imgAlt: 'Home',
      imgWidth: 24,
      imgHeight: 24,
      linkName: 'Home',
      tooltipContent: (
        <Image
          src={'/assets/images/home.svg'}
          alt={'Home'}
          width={24}
          height={24}
        />
      ),
    },
    {
      path: '/promotion-center',
      imgSrc: '/assets/images/promotions.svg',
      imgAlt: 'Promotions',
      imgWidth: 24,
      imgHeight: 24,
      linkName: 'Promotions',
      tooltipContent: (
        <Image
          src={'/assets/images/promotions.svg'}
          alt={'Promotions'}
          width={24}
          height={24}
        />
      ),
    },
    {
      path: '/ranking-vip',
      imgSrc: '/assets/images/rankvip.svg',
      imgAlt: 'Ranking VIP',
      imgWidth: 20,
      imgHeight: 20,
      linkName: 'Ranking VIP',
      tooltipContent: (
        <Image
          src={'/assets/images/rankvip.svg'}
          alt={'Ranking VIP'}
          width={20}
          height={20}
        />
      ),
    },
    {
      path: '#',
      imgSrc: '/assets/images/affiliate.svg',
      imgAlt: 'Affiliate',
      imgWidth: 20,
      imgHeight: 20,
      linkName: '',
      tooltipContent: (
        <>
          <Image
            src={'/assets/images/affiliate.svg'}
            alt={'Affiliate'}
            width={20}
            height={20}
          />
          <AffiliateModal />
        </>
      ),
      component: <AffiliateModal />,
    },
    {
      path: '/contact-us',
      imgSrc: '/assets/images/livesupport.svg',
      imgAlt: 'Live Support',
      imgWidth: 20,
      imgHeight: 20,
      linkName: 'Live Support',
      tooltipContent: (
        <Image
          src={'/assets/images/livesupport.svg'}
          alt={'Live Support'}
          width={20}
          height={20}
        />
      ),
    },
    {
      path: '#',
      imgSrc: '/assets/images/telegram.svg',
      imgAlt: 'Telegram',
      imgWidth: 20,
      imgHeight: 20,
      linkName: 'Telegram',
      tooltipContent: (
        <Image
          src={'/assets/images/telegram.svg'}
          alt={'Telegram'}
          width={20}
          height={20}
        />
      ),
    },
    {
      path: '/poker-game',
      imgSrc: '/assets/images/poker.svg',
      imgAlt: 'online poker',
      imgWidth: 24,
      imgHeight: 24,
      linkName: 'online poker',
      tooltipContent: (
        <Image
          src={'/assets/images/poker.svg'}
          alt={'online poker'}
          width={24}
          height={24}
        />
      ),
    },
  ]

  const handleShowMenu = (menuItem: string) => {
    setShowMenu(menuItem)
  }

  return (
    <div className="d-md-block d-none">
      {' '}
      <div className={` sidebar ${active ? ' sidebarOpen  ' : ' close'}`}>
        {active ? (
          <ul className="nav-links ">
            <li
              onClick={() => handleShowMenu(menuItemsWithTooltips[0].linkName)}
            >
              <Link
                href={menuItemsWithTooltips[0].path}
                className={
                  router.pathname === menuItemsWithTooltips[0].path
                    ? `${menuItemsWithTooltips[0].linkName.toLowerCase()} active`
                    : ``
                }
              >
                <div className="link_img">
                  <Image
                    src={menuItemsWithTooltips[0].imgSrc}
                    alt={t(menuItemsWithTooltips[0].imgAlt)}
                    width={menuItemsWithTooltips[0].imgWidth}
                    height={menuItemsWithTooltips[0].imgHeight}
                  />
                </div>
                <span className="link_name">
                  {menuItemsWithTooltips[0].component
                    ? menuItemsWithTooltips[0].component
                    : t(menuItemsWithTooltips[0].linkName)}
                </span>
              </Link>
              <ul className="sub-menu blank">
                <li>
                  <a className="link_name" href="#">
                    {menuItemsWithTooltips[0].component
                      ? menuItemsWithTooltips[0].component
                      : t(menuItemsWithTooltips[0].linkName)}
                  </a>
                </li>
              </ul>
            </li>

            <li
              onClick={() => handleShowMenu(menuItemsWithTooltips[6].linkName)}
            >
              <Link
                href={menuItemsWithTooltips[6].path}
                className={
                  router.pathname === menuItemsWithTooltips[6].path
                    ? `${menuItemsWithTooltips[6].linkName.toLowerCase()} active`
                    : ``
                }
              >
                <div className="link_img">
                  <Image
                    src={menuItemsWithTooltips[6].imgSrc}
                    alt={t(menuItemsWithTooltips[6].imgAlt)}
                    width={menuItemsWithTooltips[6].imgWidth}
                    height={menuItemsWithTooltips[6].imgHeight}
                  />
                </div>
                <span className="link_name">
                  {menuItemsWithTooltips[6].component
                    ? menuItemsWithTooltips[6].component
                    : t(menuItemsWithTooltips[6].linkName)}
                </span>
              </Link>
              <ul className="sub-menu blank">
                <li>
                  <a className="link_name" href="#">
                    {menuItemsWithTooltips[6].component
                      ? menuItemsWithTooltips[6].component
                      : t(menuItemsWithTooltips[6].linkName)}
                  </a>
                </li>
              </ul>
            </li>

            {gameTypes.map((item, index) => (
              <Fragment key={index}>
                <li
                  style={{ cursor: 'pointer' }}
                  className={` ${showMenu === item.mainType.name ? 'showMenu' : ''}`}
                >
                  <div
                    className={`icon-link ${mainType === item.mainType.name ? 'enable' : ''}`}
                    onClick={(e) =>
                      item.mainType.name === 'sports betting'
                        ? handleSportBetting()
                        : handleArrowClick(
                            e,
                            item.mainType.name,
                            item.subType && item.subType?.length === 1
                              ? true
                              : false,
                          )
                    }
                    style={
                      (item.subType && item.subType?.length == 1) ||
                      showMenu === ''
                        ? { borderRadius: '10px' }
                        : {}
                    }
                  >
                    <div className="menu-link">
                      <div className="link_img">
                        <Image
                          src={item.mainType.image}
                          alt={t(item.mainType.name)}
                          width={24}
                          height={24}
                        />
                      </div>
                      <span className="link_name">{t(item.mainType.name)}</span>
                    </div>

                    {item.subType && item.subType?.length > 1 && (
                      <svg
                        className={`arrow ${showMenu === item.mainType.name ? 'showMenu' : 'showMenu'}`}
                        stroke="currentColor"
                        fill="currentColor"
                        stroke-width="0"
                        viewBox="0 0 512 512"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill="none"
                          stroke-linecap="square"
                          stroke-miterlimit="10"
                          stroke-width="48"
                          d="m112 184 144 144 144-144"
                        ></path>
                      </svg>
                    )}
                  </div>
                  {item.subType && item.subType?.length > 1 && (
                    <ul className={`sub-menu`}>
                      {item?.subType &&
                        item?.subType?.length > 1 &&
                        item?.subType.map((subGames, index) => (
                          <Fragment key={index}>
                            {' '}
                            <li
                              onClick={(e) =>
                                handleSubType(
                                  e,
                                  item.mainType.name,
                                  subGames?.name,
                                )
                              }
                            >
                              <a
                                className={`active ${item.subType?.length === 1 ? 'py-0' : ''}`}
                                href="#"
                              >
                                <Image
                                  src={subGames?.image}
                                  alt={t(subGames?.name)}
                                  width={24}
                                  height={24}
                                />
                                <span
                                  className={
                                    subGames?.name === subType
                                      ? active
                                        ? 'subGameActive'
                                        : ''
                                      : ''
                                  }
                                >
                                  {t(removeExtraSymbols(subGames?.name))}
                                </span>
                              </a>
                            </li>
                          </Fragment>
                        ))}
                    </ul>
                  )}
                </li>
              </Fragment>
            ))}

            <div className="sidebar_divider" />

            <li
              onClick={() => handleShowMenu(menuItemsWithTooltips[1].linkName)}
            >
              <Link
                href={menuItems[1].path}
                className={
                  router.pathname === menuItems[1].path
                    ? `${menuItems[1].linkName.toLowerCase()} active`
                    : ``
                }
              >
                <div className="link_img">
                  <Image
                    src={menuItems[1].imgSrc}
                    alt={t(menuItems[1].imgAlt)}
                    width={menuItems[1].imgWidth}
                    height={menuItems[1].imgHeight}
                  />
                </div>
                <span className="link_name">
                  {menuItems[1].component
                    ? menuItems[1].component
                    : t(menuItems[1].linkName)}
                </span>
              </Link>
              <ul className="sub-menu blank">
                <li>
                  <a className="link_name" href="#">
                    {menuItems[1].component
                      ? menuItems[1].component
                      : t(menuItems[1].linkName)}
                  </a>
                </li>
              </ul>
            </li>

            <li
              onClick={() => handleShowMenu(menuItemsWithTooltips[2].linkName)}
            >
              <div
                className={
                  router.pathname === menuItems[2].path
                    ? `${menuItems[2].linkName.toLowerCase()} active`
                    : ``
                }
                onClick={handleUserAuth}
              >
                <div className="link_img">
                  <Image
                    src={menuItems[2].imgSrc}
                    alt={t(menuItems[2].imgAlt)}
                    width={menuItems[2].imgWidth}
                    height={menuItems[2].imgHeight}
                  />
                </div>
                <span className="link_name">
                  {menuItems[2].component
                    ? menuItems[2].component
                    : t(menuItems[2].linkName)}
                </span>
              </div>
              <ul className="sub-menu blank">
                <li>
                  <a className="link_name" href="#">
                    {menuItems[2].component
                      ? menuItems[2].component
                      : t(menuItems[2].linkName)}
                  </a>
                </li>
              </ul>
            </li>

            {user ? (
              <li
                onClick={() =>
                  handleShowMenu(menuItemsWithTooltips[3].linkName)
                }
              >
                <div
                  className={
                    router.pathname === menuItems[3].path
                      ? `${menuItems[3].linkName.toLowerCase()} active`
                      : ``
                  }
                  onClick={hanldeOpenAffilatte}
                >
                  <div className="link_img">
                    <Image
                      src={menuItems[3].imgSrc}
                      alt={t(menuItems[3].imgAlt)}
                      width={menuItems[3].imgWidth}
                      height={menuItems[3].imgHeight}
                    />
                  </div>
                  <span className="link_name">{t(menuItems[3].linkName)}</span>
                </div>
                <ul className="sub-menu blank">
                  <li>
                    <a className="link_name" href="#">
                      {t(menuItems[3].linkName)}
                    </a>
                  </li>
                </ul>
              </li>
            ) : null}

            <li
              onClick={() => handleShowMenu(menuItemsWithTooltips[4].linkName)}
            >
              <Link
                href={menuItems[4].path}
                className={
                  router.pathname === menuItems[4].path
                    ? `${menuItems[4].linkName.toLowerCase()} active`
                    : ``
                }
              >
                <div className="link_img">
                  <Image
                    src={menuItems[4].imgSrc}
                    alt={t(menuItems[4].imgAlt)}
                    width={menuItems[4].imgWidth}
                    height={menuItems[4].imgHeight}
                  />
                </div>
                <span className="link_name">
                  {menuItems[4].component
                    ? menuItems[4].component
                    : t(menuItems[4].linkName)}
                </span>
              </Link>
              <ul className="sub-menu blank">
                <li>
                  <a className="link_name" href="#">
                    {menuItems[4].component
                      ? menuItems[4].component
                      : t(menuItems[4].linkName)}
                  </a>
                </li>
              </ul>
            </li>

            <li
              onClick={() => handleShowMenu(menuItemsWithTooltips[5].linkName)}
            >
              <Link
                href={menuItems[5].path}
                className={
                  router.pathname === menuItems[5].path
                    ? `${menuItems[5].linkName.toLowerCase()} active`
                    : ``
                }
              >
                <div className="link_img">
                  <Image
                    src={menuItems[5].imgSrc}
                    alt={t(menuItems[5].imgAlt)}
                    width={menuItems[5].imgWidth}
                    height={menuItems[5].imgHeight}
                  />
                </div>
                <span className="link_name">
                  {menuItems[5].component
                    ? menuItems[5].component
                    : t(menuItems[5].linkName)}
                </span>
              </Link>
              <ul className="sub-menu blank">
                <li>
                  <a className="link_name" href="#">
                    {menuItems[5].component
                      ? menuItems[5].component
                      : t(menuItems[5].linkName)}
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        ) : (
          <ul className="nav-links">
            <li
              onClick={() => handleShowMenu(menuItemsWithTooltips[0].linkName)}
            >
              <Link
                href={menuItemsWithTooltips[0].path}
                className={
                  router.pathname === menuItemsWithTooltips[0].path
                    ? `${menuItemsWithTooltips[0].linkName.toLowerCase()} active`
                    : ``
                }
              >
                <Tooltip
                  placement="right-end"
                  arrow
                  title={
                    <div className="sidebar-mobile">
                      <div className="nav-links">
                        <ul className="ps-0 mb-0 list-unstyled sub-menu">
                          <li>
                            <div className="link_name px-0">
                              {menuItemsWithTooltips[0].tooltipContent}{' '}
                              {t(menuItemsWithTooltips[0].linkName)}
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  }
                >
                  <div className="link_img">
                    <Image
                      src={menuItemsWithTooltips[0].imgSrc}
                      alt={t(menuItemsWithTooltips[0].imgAlt)}
                      width={menuItemsWithTooltips[0].imgWidth}
                      height={menuItemsWithTooltips[0].imgHeight}
                    />
                  </div>
                </Tooltip>
                {menuItemsWithTooltips[0].component && (
                  <span className="link_name">
                    {menuItemsWithTooltips[0].component}
                  </span>
                )}
              </Link>
            </li>

            <li
              onClick={() => handleShowMenu(menuItemsWithTooltips[6].linkName)}
            >
              <Link
                href={menuItemsWithTooltips[6].path}
                className={
                  router.pathname === menuItemsWithTooltips[6].path
                    ? `${menuItemsWithTooltips[6].linkName.toLowerCase()} active`
                    : ``
                }
              >
                <Tooltip
                  placement="right-end"
                  arrow
                  title={
                    <div className="sidebar-mobile">
                      <div className="nav-links">
                        <ul className="ps-0 mb-0 list-unstyled sub-menu">
                          <li>
                            <div className="link_name px-0">
                              {menuItemsWithTooltips[6].tooltipContent}{' '}
                              {t(menuItemsWithTooltips[6].linkName)}
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  }
                >
                  <div className="link_img">
                    <Image
                      src={menuItemsWithTooltips[6].imgSrc}
                      alt={t(menuItemsWithTooltips[6].imgAlt)}
                      width={menuItemsWithTooltips[6].imgWidth}
                      height={menuItemsWithTooltips[6].imgHeight}
                    />
                  </div>
                </Tooltip>
                {menuItemsWithTooltips[6].component && (
                  <span className="link_name">
                    {menuItemsWithTooltips[6].component}
                  </span>
                )}
              </Link>
            </li>

            {gameTypes.map((item, index) => (
              <Fragment key={index}>
                <Tooltip
                  placement="right-start"
                  arrow
                  className="tooltip-sub-menu"
                  title={
                    <div className="sidebar-mobile">
                      <div className="nav-links">
                        <ul className={` ps-0 mb-0 list-unstyled sub-menu`}>
                          {item.subType && item.subType.length > 1 && (
                            <li
                              className="border-bottom py-1 text-capitalize"
                              style={{ fontSize: '13px' }}
                              onClick={(e) =>
                                item.mainType.name === 'sports betting'
                                  ? handleSportBetting()
                                  : handleMainType(e, item.mainType.name)
                              }
                            >
                              <Image
                                src={item.mainType.image}
                                alt={t(item.mainType.name)}
                                width={30}
                                height={30}
                              />
                              <span style={{ paddingLeft: '6px' }}>
                                {t(item.mainType.name)}
                              </span>
                            </li>
                          )}

                          {item?.subType &&
                            item?.subType?.length > 0 &&
                            item?.subType.map((subGames, index) => (
                              <Fragment key={index}>
                                {' '}
                                <li
                                  onClick={(e) =>
                                    item.mainType.name === 'sports betting'
                                      ? handleSportBetting()
                                      : handleSubType(
                                          e,
                                          item.mainType.name,
                                          subGames?.name,
                                        )
                                  }
                                >
                                  <div
                                    className={`active px-0 ${item.subType?.length === 1 ? 'py-0' : ''}`}
                                  >
                                    <Image
                                      src={subGames?.image}
                                      alt={t(subGames?.name)}
                                      width={24}
                                      height={24}
                                    />
                                    <span
                                      className={
                                        subGames?.name === subType
                                          ? active
                                            ? 'subGameActive'
                                            : ''
                                          : ''
                                      }
                                    >
                                      {t(removeExtraSymbols(subGames?.name))}
                                    </span>
                                  </div>
                                </li>
                              </Fragment>
                            ))}
                        </ul>
                      </div>
                    </div>
                  }
                >
                  <li
                    style={{ cursor: 'pointer' }}
                    className={` ${showMenu === item.mainType.name ? 'showMenu' : ''}`}
                    onClick={(e) =>
                      item.mainType.name === 'sports betting'
                        ? handleSportBetting()
                        : handleMainType(e, item.mainType.name)
                    }
                  >
                    <div
                      className={`icon-link ${mainType === item.mainType.name ? 'enable' : ''}`}
                    >
                      <div className="menu-link">
                        <div className="link_img">
                          <Image
                            src={item.mainType.image}
                            alt={t(item.mainType.image)}
                            width={24}
                            height={24}
                          />
                        </div>
                      </div>
                    </div>
                  </li>
                </Tooltip>
              </Fragment>
            ))}

            <div className="sidebar_divider" />

            {/* Menus */}
            <li
              onClick={() => handleShowMenu(menuItemsWithTooltips[1].linkName)}
            >
              <Link
                href={menuItemsWithTooltips[1].path}
                className={
                  router.pathname === menuItemsWithTooltips[1].path
                    ? `${menuItemsWithTooltips[1].linkName.toLowerCase()} active`
                    : ``
                }
              >
                <Tooltip
                  placement="right-end"
                  arrow
                  title={
                    <div className="sidebar-mobile">
                      <div className="nav-links">
                        <ul className="ps-0 mb-0 list-unstyled sub-menu">
                          <li>
                            <div className="link_name px-0">
                              {menuItemsWithTooltips[1].tooltipContent}{' '}
                              {t(menuItemsWithTooltips[1].linkName)}
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  }
                >
                  <div className="link_img">
                    <Image
                      src={menuItemsWithTooltips[1].imgSrc}
                      alt={t(menuItemsWithTooltips[1].imgAlt)}
                      width={menuItemsWithTooltips[1].imgWidth}
                      height={menuItemsWithTooltips[1].imgHeight}
                    />
                  </div>
                </Tooltip>
                {menuItemsWithTooltips[1].component && (
                  <span className="link_name">
                    {menuItemsWithTooltips[1].component}
                  </span>
                )}
              </Link>
            </li>

            <li
              onClick={() => handleShowMenu(menuItemsWithTooltips[2].linkName)}
            >
              <div
                className={
                  router.pathname === menuItemsWithTooltips[2].path
                    ? `${menuItemsWithTooltips[2].linkName.toLowerCase()} active`
                    : ``
                }
                onClick={handleUserAuth}
              >
                <Tooltip
                  placement="right-end"
                  arrow
                  title={
                    <div className="sidebar-mobile">
                      <div className="nav-links">
                        <ul className="ps-0 mb-0 list-unstyled sub-menu">
                          <li>
                            <div className="link_name px-0">
                              {menuItemsWithTooltips[2].tooltipContent}{' '}
                              {t(menuItemsWithTooltips[2].linkName)}
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  }
                >
                  <div className="link_img">
                    <Image
                      src={menuItemsWithTooltips[2].imgSrc}
                      alt={t(menuItemsWithTooltips[2].imgAlt)}
                      width={menuItemsWithTooltips[2].imgWidth}
                      height={menuItemsWithTooltips[2].imgHeight}
                    />
                  </div>
                </Tooltip>
                {menuItemsWithTooltips[2].component && (
                  <span className="link_name">
                    {menuItemsWithTooltips[2].component}
                  </span>
                )}
              </div>
            </li>

            {user ? (
              <li onClick={hanldeOpenAffilatte}>
                <div
                  className={
                    router.pathname === menuItemsWithTooltips[3].path
                      ? `${menuItemsWithTooltips[3].linkName.toLowerCase()} active`
                      : ``
                  }
                >
                  <Tooltip
                    placement="right-end"
                    arrow
                    title={
                      <div className="sidebar-mobile">
                        <div className="nav-links">
                          <ul className="ps-0 mb-0 list-unstyled sub-menu">
                            <li>
                              <div className="link_name px-0">
                                {menuItemsWithTooltips[3].tooltipContent}{' '}
                                {t(menuItemsWithTooltips[3].linkName)}
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    }
                  >
                    <div className="link_img">
                      <Image
                        src={menuItemsWithTooltips[3].imgSrc}
                        alt={t(menuItemsWithTooltips[3].imgAlt)}
                        width={menuItemsWithTooltips[3].imgWidth}
                        height={menuItemsWithTooltips[3].imgHeight}
                      />
                    </div>
                  </Tooltip>
                  {menuItemsWithTooltips[3].component && (
                    <span className="link_name">
                      {menuItemsWithTooltips[3].component}
                    </span>
                  )}
                </div>
              </li>
            ) : null}

            <li
              onClick={() => handleShowMenu(menuItemsWithTooltips[4].linkName)}
            >
              <Link
                href={menuItemsWithTooltips[4].path}
                className={
                  router.pathname === menuItemsWithTooltips[4].path
                    ? `${menuItemsWithTooltips[4].linkName.toLowerCase()} active`
                    : ``
                }
              >
                <Tooltip
                  placement="right-end"
                  arrow
                  title={
                    <div className="sidebar-mobile">
                      <div className="nav-links">
                        <ul className="ps-0 mb-0 list-unstyled sub-menu">
                          <li>
                            <div className="link_name px-0">
                              {menuItemsWithTooltips[4].tooltipContent}{' '}
                              {t(menuItemsWithTooltips[4].linkName)}
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  }
                >
                  <div className="link_img">
                    <Image
                      src={menuItemsWithTooltips[4].imgSrc}
                      alt={t(menuItemsWithTooltips[4].imgAlt)}
                      width={menuItemsWithTooltips[4].imgWidth}
                      height={menuItemsWithTooltips[4].imgHeight}
                    />
                  </div>
                </Tooltip>
                {menuItemsWithTooltips[4].component && (
                  <span className="link_name">
                    {menuItemsWithTooltips[4].component}
                  </span>
                )}
              </Link>
            </li>

            <li
              onClick={() => handleShowMenu(menuItemsWithTooltips[5].linkName)}
            >
              <Link
                href={menuItemsWithTooltips[5].path}
                className={
                  router.pathname === menuItemsWithTooltips[5].path
                    ? `${menuItemsWithTooltips[5].linkName.toLowerCase()} active`
                    : ``
                }
              >
                <Tooltip
                  placement="right-end"
                  arrow
                  title={
                    <div className="sidebar-mobile">
                      <div className="nav-links">
                        <ul className="ps-0 mb-0 list-unstyled sub-menu">
                          <li>
                            <div className="link_name px-0">
                              {menuItemsWithTooltips[5].tooltipContent}{' '}
                              {t(menuItemsWithTooltips[5].linkName)}
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  }
                >
                  <div className="link_img">
                    <Image
                      src={menuItemsWithTooltips[5].imgSrc}
                      alt={t(menuItemsWithTooltips[5].imgAlt)}
                      width={menuItemsWithTooltips[5].imgWidth}
                      height={menuItemsWithTooltips[5].imgHeight}
                    />
                  </div>
                </Tooltip>
                {menuItemsWithTooltips[5].component && (
                  <span className="link_name">
                    {menuItemsWithTooltips[5].component}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        )}
      </div>
      {isOpenAffiliate && (
        <AffiliateModal
          handleCloseAffilatte={handleCloseAffilatte}
          isOpenAffiliate={isOpenAffiliate}
        />
      )}
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
    </div>
  )
}

export default Sidebar
