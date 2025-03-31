import { useAppSelector } from '@/redux/hooks';
import LevelDataType from '@/types/levelData';
import React from 'react';
import { useTranslation } from 'react-i18next';
import CustomImage from '../common/CustomImage';

interface LevelBadgeProps {
  level: number;
  item: LevelDataType;
}
const LevelBadge: React.FC<LevelBadgeProps> = ({ level, item }) => {
  const user = useAppSelector((state) => state.user.user);
  const { t } = useTranslation();
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
  ];

  const getBadgeStyle = (level: number): React.CSSProperties => {
    let badgeStyle: React.CSSProperties = {};

    switch (level) {
      case 0:
        badgeStyle = {
          background:
            'linear-gradient(135deg, var(--soft-blue), var(--blue-royal-2))',
          border: '1px solid var(--blue-royal-1)',
          borderRadius: '6px',
        };
        break;
      case 1:
        badgeStyle = {
          background:
            'linear-gradient(135deg, var(--soft-blue), var(--blue-royal-2))',
          border: '1px solid var(--blue-royal-1)',
          borderRadius: '6px',
        };
        break;
      case 2:
        badgeStyle = {
          background:
            'linear-gradient(135deg, var(--hot-pin), var(--dark-orchid))',
          border: '1px solid var(--blue-royal-1)',
          borderRadius: '6px',
        };
      case 3:
        badgeStyle = {
          background:
            'linear-gradient(135deg, var(--golden-yellow), var(--burgundy))',
          border: '1px solid var(--golden-yellow)',
          borderRadius: '6px',
        };
        break;
      case 4:
        badgeStyle = {
          background:
            'linear-gradient(135deg, var(--bold-purple), var(--purple-heart))',
          border: '1px solid var(--light-purple)',
          borderRadius: '6px',
        };
        break;
      case 5:
        badgeStyle = {
          background:
            'linear-gradient(135deg, var(--crimson-2), var(--purple-heart))',
          border: '1px solid var(--deep-pink)',
          borderRadius: '6px',
        };
        break;
      case 6:
        badgeStyle = {
          background:
            'linear-gradient(135deg, var(--sky-blue-3), var(--midnight-blue))',
          border: '1px solid var(--sky-blue-3)',
          borderRadius: '6px',
        };
        break;
      case 7:
        badgeStyle = {
          background:
            'linear-gradient(135deg, var(--orange), var(--midnight-blue-1))',
          border: '1px solid var(--orange)',
          borderRadius: '6px',
        };
        break;
      case 8:
        badgeStyle = {
          background: 'linear-gradient(135deg,var(--green),var(--burgundy))',
          border: '1px solid var(--periwinkle-1)',
          borderRadius: '6px',
        };
        break;
      case 9:
        badgeStyle = {
          background:
            'linear-gradient(135deg, var(--periwinkle-1), var(--midnight-blue))',
          border: '1px solid var(--periwinkle-1)',
          borderRadius: '6px',
        };
        break;
      case 10:
        badgeStyle = {
          background: 'linear-gradient(135deg,green, var(--midnight-blue-1))',
          border: '1px solid var(--hot-pink-1)',
          borderRadius: '6px',
        };
        break;
      default:
        // Default styles
        break;
    }
    return badgeStyle;
  };

  return (
    <div style={getBadgeStyle(level)}>
      {item?.level <= (user?.level ?? 0) ? (
        <CustomImage
          src="/assets/images/openBox.png"
          alt={`${t('Level')} ${level}`}
          width={100}
          height={60}
        />
      ) : (
        <CustomImage
          src="/assets/images/closeBox.png"
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
        <CustomImage
          src="/assets/images/coin.png"
          alt={t('coin')}
          width={12}
          height={12}
        />
        {item?.rewardAmount}
      </p>
      <div
        style={{
          borderRadius: '5px',
          backgroundColor: lvTextBackgroundColors[level],
          fontSize: '10px',
          paddingTop: '4px',
          paddingBottom: '4px',
          color: 'var(--yellow-vivid)',
          fontWeight: 'bold',
        }}
      >
        {t('Level')} {level}
      </div>
    </div>
  );
};

export default LevelBadge;
