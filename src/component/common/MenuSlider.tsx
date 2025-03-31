import React, { Fragment, useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { GetMethod } from '@/services/fetchAPI'
import { logError } from '@/utils'
import { useTranslation } from 'react-i18next'

interface Props {
  isUpperSlider?: boolean
  isLowerSlider?: boolean
  slug?: string
}

type subGame = { image: string; name: string }

function MenuSlider({
  isLowerSlider = false,
  isUpperSlider = false,
  slug,
}: Props): React.JSX.Element {
  const router = useRouter()
  const { mainType, subType } = router.query
  const [otherTypeGames, setOtherTypeGames] = useState<Array<string>>([])
  const { t } = useTranslation()

  const fetchOtherTypeGames = async () => {
    try {
      const result: any = await GetMethod('othersTypeGames')

      if (result.data.status !== 'success') {
        throw new Error('othersTypeGames api is not working')
      }

      if (result.data.result && result.data.result.length > 0) {
        const otherGames =
          result.data.result.map((item: any) => ({
            image: '/assets/images/mines.svg',
            name: item,
            mainType: 'others',
          })) || []
        setOtherTypeGames(otherGames)
      }
    } catch (error) {
      logError(error)
    }
  }

  const upperMenu = [
    {
      title: 'Home',
      img: '/assets/images/home.svg',
      path: '/',
      value: 'allgames',
    },
    {
      title: 'online poker',
      img: '/assets/images/poker.svg',
      path: '/poker-game',
      value: 'allgames',
    },
    {
      title: 'sports betting',
      img: '/assets/images/sports-bet-icon.svg',
      path: '/sport-bet',
      value: 'allgames',
    },
    {
      title: 'slots',
      img: '/assets/images/slots.svg',
      path: '/games-category',
      value: 'slots',
    },
    {
      title: 'casino',
      img: '/assets/images/casino.svg',
      path: '/games-category',
      value: 'casino',
    },
    {
      title: 'card games',
      img: '/assets/images/card_games.png',
      path: '/games-category',
      value: 'card games',
    },
    {
      title: 'crash',
      img: '/assets/images/crash.png',
      path: '/games-category',
      value: 'crash',
    },
    {
      title: 'lottery',
      img: '/assets/images/lottery.png',
      path: '/games-category',
      value: 'lottery',
    },
    {
      title: 'mini games',
      img: '/assets/images/mini_games.png',
      path: '/games-category',
      value: 'mini games',
    },
    {
      title: 'table poker',
      img: '/assets/images/poker.svg',
      path: '/games-category',
      value: 'table poker',
    },
    {
      title: 'bet games',
      img: '/assets/images/bet_games.png',
      path: '/games-category',
      value: 'bet games',
    },
    {
      title: 'arcade',
      img: '/assets/images/arcade.png',
      path: '/games-category',
      value: 'arcade',
    },
    {
      title: 'live games',
      img: '/assets/images/live_games.png',
      path: '/games-category',
      value: 'live games',
    },
    {
      title: 'others',
      img: '/assets/images/candybonanza.svg',
      path: '/games-category',
      value: 'others',
    },
    {
      title: 'Promotions',
      img: '/assets/images/promotions.svg',
      path: '/promotion-center',
      value: 'allgames',
    },
    {
      title: 'Ranking VIP',
      img: '/assets/images/rankvip.svg',
      path: '/ranking-vip',
      value: 'allgames',
    },
    {
      title: 'Live Support',
      img: '/assets/images/livesupport.svg',
      path: '/contact-us',
      value: 'allgames',
    },
    {
      title: 'Telegram',
      img: '/assets/images/telegram.svg',
      path: '#',
      value: 'allgames',
    },
  ]

  const lowerMenu: Record<string, any[]> = {
    allgames: [
      {
        image: '/assets/images/bacarrat1.svg',
        name: 'blackjack',
        mainType: 'casino',
      },
      {
        image: '/assets/images/roulete.svg',
        name: 'roulette',
        mainType: 'casino',
      },
      {
        image: '/assets/images/bacarrat.svg',
        name: 'baccarat',
        mainType: 'casino',
      },
      { image: '/assets/images/table.svg', name: 'table', mainType: 'casino' },
      { image: '/assets/images/poker.svg', name: 'poker', mainType: 'casino' },
      {
        image: '/assets/images/videopoker.svg',
        name: 'video poker',
        mainType: 'casino',
      },
      {
        image: '/assets/images/bacarrat.svg',
        name: 'baccarat',
        mainType: 'card games',
      },
      {
        image: '/assets/images/blackjack.svg',
        name: 'blackjack',
        mainType: 'card games',
      },
      {
        image: '/assets/images/card.svg',
        name: 'card',
        mainType: 'card games',
      },
      {
        image: '/assets/images/aviator.svg',
        name: 'aviator',
        mainType: 'crash',
      },
      {
        image: '/assets/images/aviatormobile.svg',
        name: 'aviator mobile',
        mainType: 'crash',
      },
      { image: '/assets/images/crash.png', name: 'crash', mainType: 'crash' },
      {
        image: '/assets/images/scratchcard.svg',
        name: 'scratch card',
        mainType: 'lottery',
      },
      {
        image: '/assets/images/scratch.svg',
        name: 'scratch',
        mainType: 'lottery',
      },
      {
        image: '/assets/images/robinhood.svg',
        name: 'Robin Hood Mobile',
        mainType: 'mini games',
      },
      {
        image: '/assets/images/instant.svg',
        name: 'instant',
        mainType: 'mini games',
      },
      {
        image: '/assets/images/roulete.svg',
        name: 'mini games',
        mainType: 'mini games',
      },
      {
        image: '/assets/images/mini_games.png',
        name: 'minigame',
        mainType: 'mini games',
      },
      {
        image: '/assets/images/instantwin.svg',
        name: 'instant win',
        mainType: 'mini games',
      },
      {
        image: '/assets/images/instantgame.svg',
        name: 'instant game',
        mainType: 'mini games',
      },
      {
        image: '/assets/images/poker.svg',
        name: 'poker',
        mainType: 'table poker',
      },
      { image: '/assets/images/keno.svg', name: 'keno', mainType: 'bet games' },
      {
        image: '/assets/images/betting.svg',
        name: 'betting',
        mainType: 'bet games',
      },
      {
        image: '/assets/images/sicbo.svg',
        name: 'sic bo',
        mainType: 'bet games',
      },
      {
        image: '/assets/images/arcade.png',
        name: 'arcade',
        mainType: 'arcade',
      },
      {
        image: '/assets/images/mines.svg',
        name: 'mines',
        mainType: 'arcade',
      },
      {
        image: '/assets/images/live_games.png',
        name: 'live dealer',
        mainType: 'live games',
      },
      ...otherTypeGames,
    ],
    casino: [
      { image: '/assets/images/bacarrat1.svg', name: 'blackjack' },
      { image: '/assets/images/roulete.svg', name: 'roulette' },
      { image: '/assets/images/bacarrat.svg', name: 'baccarat' },
      { image: '/assets/images/table.svg', name: 'table' },
      { image: '/assets/images/poker.svg', name: 'poker' },
      { image: '/assets/images/videopoker.svg', name: 'video poker' },
    ],
    'card games': [
      { image: '/assets/images/bacarrat.svg', name: 'baccarat' },
      { image: '/assets/images/blackjack.svg', name: 'blackjack' },
      { image: '/assets/images/card.svg', name: 'card' },
    ],
    crash: [
      { image: '/assets/images/aviator.svg', name: 'aviator' },
      { image: '/assets/images/aviatormobile.svg', name: 'aviator Mobile' },
      { image: '/assets/images/crash.png', name: 'crash' },
    ],
    lottery: [
      { image: '/assets/images/scratchcard.svg', name: 'scratch card' },
      { image: '/assets/images/scratch.svg', name: 'scratch' },
    ],
    'mini games': [
      { image: '/assets/images/robinhood.svg', name: 'Robin Hood Mobile' },
      { image: '/assets/images/instant.svg', name: 'instant' },
      { image: '/assets/images/roulete.svg', name: 'mini games' },
      { image: '/assets/images/mini_games.png', name: 'minigame' },
      { image: '/assets/images/instantwin.svg', name: 'instant win' },
      { image: '/assets/images/instantgame.svg', name: 'instant game' },
    ],
    'table poker': [{ image: '/assets/images/poker.svg', name: 'poker' }],
    'bet games': [
      { image: '/assets/images/keno.svg', name: 'keno' },
      { image: '/assets/images/betting.svg', name: 'betting' },
      { image: '/assets/images/sicbo.svg', name: 'sic bo' },
    ],
    arcade: [
      { image: '/assets/images/arcade.png', name: 'arcade' },
      { image: '/assets/images/mines.svg', name: 'mines' },
    ],
    'live games': [
      { image: '/assets/images/live_games.png', name: 'live dealer' },
    ],
    others: [...otherTypeGames],
  }

  const handleSubmenuTypes = (key: string): subGame[] => {
    return lowerMenu[key] || lowerMenu['allgames']
  }

  const hanldeUpperMenu = (path: string | null, value: string) => {
    if (path === '/games-category') {
      router.push({ pathname: path, query: { mainType: value } })
    } else {
      router.push(path!)
    }
  }

  const hanldeLowerMenu = (mainType: string, value: any) => {
    if (mainType === 'sports betting') {
      router.push('/sport-bet')
    } else if (slug === 'allgames') {
      router.push({
        pathname: '/games-category',
        query: { mainType: value?.mainType, subType: value?.name },
      })
    } else {
      router.push({
        pathname: '/games-category',
        query: { mainType: mainType, subType: value?.name },
      })
    }
  }

  useEffect(() => {
    if (mainType === 'others' || slug === 'allgames') {
      if (otherTypeGames.length === 0) {
        fetchOtherTypeGames()
      }
    }
  }, [])

  return (
    <div className="mt-xl-5 mt-4 vip-slider" id="Game_Section">
      <div>
        {isUpperSlider ? (
          <div className="Game_Section">
            {upperMenu.map((item, index) => (
              <Fragment key={index}>
                <div
                  className={
                    mainType === item.value ||
                    (slug === item.value && router.pathname === item.path)
                      ? 'g_section_sub g_HignLight'
                      : 'g_section_sub'
                  }
                  onClick={() => hanldeUpperMenu(item.path, item.value)}
                >
                  <Image
                    src={item.img}
                    width={50}
                    height={50}
                    alt={t(item.value)}
                  />
                  <div className="title_template text-capitalize">
                    {t(item.title)}
                  </div>
                </div>
              </Fragment>
            ))}
          </div>
        ) : null}
      </div>

      <div>
        {mainType !== 'slots' ? (
          isLowerSlider && handleSubmenuTypes(`${mainType}`).length > 0 ? (
            <div className="Game_Section ">
              {handleSubmenuTypes(`${mainType}`)
                ?.flat(1)
                .map((item, index) => (
                  <Fragment key={index}>
                    <div
                      className={
                        subType === item.name
                          ? 'g_section_sub g_HignLight'
                          : 'g_section_sub'
                      }
                      onClick={() => hanldeLowerMenu(mainType as string, item)}
                    >
                      <Image
                        src={item.image}
                        width={50}
                        height={50}
                        alt={t(item.name)} // Changed from item.value to item.name
                      />
                      <div className="title_template text-capitalize">
                        {t(item.name)}
                      </div>
                    </div>
                  </Fragment>
                ))}
            </div>
          ) : null
        ) : null}
      </div>
    </div>
  )
}

export default MenuSlider
