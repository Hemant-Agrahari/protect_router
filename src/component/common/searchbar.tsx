import React from 'react'
import CustomOutlinedInput from './CustomOutlinedInput'
import { InputAdornment } from '@mui/material'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'

interface Props {
  searchQuery: string
  handleSearch: (value: string) => void
}

const Searchbar: React.FC<Props> = ({ searchQuery, handleSearch }) => {
  const { t } = useTranslation()

  return (
    <div className="d-md-none search-bar">
      <CustomOutlinedInput
        placeholder={t('Search games')}
        startAdornment={
          <InputAdornment position="start">
            <Image
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
