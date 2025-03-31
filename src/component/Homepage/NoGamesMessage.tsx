import { removeExtraSymbols } from '@/utils'
import { useTranslation } from 'react-i18next'

interface Props {
  isShowHeading?: boolean
  gameName?: {
    type: string
    subType: string
  }
}

export const NoGamesMessage: React.FC<Props> = ({
  isShowHeading = false,
  gameName,
}) => {
  const { t } = useTranslation()

  return (
    <>
      {isShowHeading ? (
        <div className="d-flex flex-row tab-title">
          <h4
            className="text-capitalize"
            style={{ color: '#fff', fontWeight: '700' }}
          >
            {gameName?.subType
              ? `${t(gameName.type)} / ${t(removeExtraSymbols(gameName.subType))}`
              : gameName && t(gameName.type)}
          </h4>
        </div>
      ) : null}

      <h3
        className="d-flex justify-content-center my-5 "
        style={{ color: '#fff' }}
      >
        {t('No Games Found')}!
      </h3>
    </>
  )
}
