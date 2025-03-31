import { useAppSelector } from '@/redux/hooks'
import LevelDataType from '@/types/levelData'
import Image from 'next/image'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface LevelBadgeProps {
  level: number
  item: LevelDataType
}
const LevelBadge: React.FC<LevelBadgeProps> = ({ level, item }) => {
  const user = useAppSelector((state) => state.user.user)
  const { t } = useTranslation()
  const lvTextBackgroundColors: string[] = [
    '#37088D',
    '#750059',
    '#7C2F08',
    '#520B7F',
    '#71093D',
    '#0D1F76',
    '#740C45',
    '#0E5D3A',
    '#073463',
    '#4A0A68',
    'green',
  ]

  const getBadgeStyle = (level: number): React.CSSProperties => {
    let badgeStyle: React.CSSProperties = {}

    switch (level) {
      case 0:
        badgeStyle = {
          background: 'linear-gradient(135deg, #5F66FD, #0C1AFE)',
          border: '1px solid #3E77E5',
          borderRadius: '6px',
        }
        break
      case 1:
        badgeStyle = {
          background: 'linear-gradient(135deg, #5F66FD, #0C1AFE)',
          border: '1px solid #3E77E5',
          borderRadius: '6px',
        }
        break
      case 2:
        badgeStyle = {
          background: 'linear-gradient(135deg, #EC5AA2, #600D69)',
          border: '1px solid #3E77E5',
          borderRadius: '6px',
        }
      case 3:
        badgeStyle = {
          background: 'linear-gradient(135deg, #EF8335, #6F2108)',
          border: '1px solid #F49A59',
          borderRadius: '6px',
        }
        break
      case 4:
        badgeStyle = {
          background: 'linear-gradient(135deg, #6535EF, #6D086F)',
          border: '1px solid #8155EF',
          borderRadius: '6px',
        }
        break
      case 5:
        badgeStyle = {
          background: 'linear-gradient(135deg, #EF3535, #48086F)',
          border: '1px solid #F96F73',
          borderRadius: '6px',
        }
        break
      case 6:
        badgeStyle = {
          background: 'linear-gradient(135deg, #35D9EF, #2F086F)',
          border: '1px solid #4BDEF4',
          borderRadius: '6px',
        }
        break
      case 7:
        badgeStyle = {
          background: 'linear-gradient(135deg, #E19236, #6D086F)',
          border: '1px solid #F2A34F',
          borderRadius: '6px',
        }
        break
      case 8:
        badgeStyle = {
          background: 'linear-gradient(135deg, #00B86B,#0B7B3F)',
          border: '1px solid #7EE2B6',
          borderRadius: '6px',
        }
        break
      case 9:
        badgeStyle = {
          background: 'linear-gradient(135deg, #36AEE1, #082B6F)',
          border: '1px solid #5AC7F8',
          borderRadius: '6px',
        }
        break
      case 10:
        badgeStyle = {
          background: 'linear-gradient(135deg,green, #48086F)',
          border: '1px solid #E958ED',
          borderRadius: '6px',
        }
        break
      default:
        // Default styles
        break
    }
    return badgeStyle
  }

  return (
    <div style={getBadgeStyle(level)}>
      {item?.level <= (user?.level ?? 0) ? (
        <Image
          src={'/assets/images/openBox.png'}
          alt={`${t('Level')} ${level}`}
          width={100}
          height={60}
        />
      ) : (
        <Image
          src={'/assets/images/closeBox.png'}
          alt={`${t('Level')} ${level}`}
          width={100}
          height={60}
        />
      )}

      <p
        className="text-white mb-1 fw-bold"
        style={{
          fontSize: '11px',
        }}
      >
        <Image
          src={'/assets/images/coin.png'}
          alt={t('coin')}
          width={12}
          height={12}
        />{' '}
        {item?.rewardAmount}
      </p>
      <div
        style={{
          borderRadius: '5px',
          backgroundColor: lvTextBackgroundColors[level],
          fontSize: '10px',
          paddingTop: '4px',
          paddingBottom: '4px',
          color: '#FFC635',
          fontWeight: 'bold',
        }}
      >
        {t('Level')} {level}
      </div>
    </div>
  )
}

export default LevelBadge
