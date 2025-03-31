import { useTranslation } from 'react-i18next'

interface Props {
  rootClass?: string
}

const Maintenance: React.FC<Props> = ({ rootClass }) => {
  const { t } = useTranslation()
  return (
    <h3
      className={`d-flex justify-content-center my-5 ${rootClass} `}
      style={{
        textAlign: 'center',
        height: '30vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#a6b0da',
      }}
    >
      {t('Games is temporarily under maintenance')}!
    </h3>
  )
}

export default Maintenance
