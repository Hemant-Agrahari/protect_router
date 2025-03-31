import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * CustomButton is a reusable button component that supports optional loading states, 
 * click handling, and custom classes. It also integrates with the `react-i18next` library
 * to display translated text when in a loading state.
 * 
 * The button can be disabled while loading, preventing further clicks, and shows a "Loading..." message 
 * (translatable) instead of the button's normal content.
 * */

type CustomButtonProps = {
  isLoading?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
  children: ReactNode;
};

const CustomButton: React.FC<CustomButtonProps> = ({
  isLoading,
  onClick,
  className,
  type,
  children,
}) => {
  const { t } = useTranslation();
  return (
    <button
      className={`${className}`}
      type={type || 'button'}
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? t('Loading...') : children}
    </button>
  );
};

export default CustomButton;
