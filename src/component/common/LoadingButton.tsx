import React, { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

type LoadingButtonProps = {
  isLoading?: boolean
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit' | 'reset' | undefined
  children: ReactNode
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  onClick,
  className,
  type,
  children,
}) => {
  const { t } = useTranslation()
  return (
    <button
      className={`${className}`}
      type={type || 'button'}
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? t('Loading...') : children}
    </button>
  )
}

export default LoadingButton
