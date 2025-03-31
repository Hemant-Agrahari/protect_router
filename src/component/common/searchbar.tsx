import React from 'react';
import {CustomMuiOutlinedInput} from '@/component/common';
import { InputAdornment } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CustomImage from './CustomImage';
/**
 * Searchbar is a responsive input component designed to allow users to search for games on mobile devices.
 * It integrates a custom `CustomMuiOutlinedInput` component, displaying a search icon within the input field.
 * The component utilizes `react-i18next` for localization and allows users to type in a search query, which is handled by the parent component through the `handleSearch` function.
 * 
 * */

interface Props {
  searchQuery: string
  handleSearch: (value: string) => void
}

const Searchbar: React.FC<Props> = ({ searchQuery, handleSearch }) => {
  const { t } = useTranslation()

  return (
    <div className="d-md-none search-bar">
      <CustomMuiOutlinedInput
        placeholder={t('Search games')}
        startAdornment={
          <InputAdornment position="start">
            <CustomImage
              src="/assets/images/search_icon.png"
              alt="search"
              width={30}
              height={30}
            />
          </InputAdornment>
        }
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        fullWidth
      />
    </div>
  )
}

export default Searchbar
