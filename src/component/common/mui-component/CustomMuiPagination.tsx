import React from 'react'
import Pagination from '@mui/material/Pagination'

/**
 * This CustomMuiPagination  is a reusable  component around the Material-UI `Pagination` component.
 * It provides a customizable pagination UI with support for different variants, shapes, 
 * and the ability to handle page changes. This component makes it easy to implement pagination
 * in your application while allowing for a variety of configuration options.
 */


interface CustomPaginationProps {
  pageSkip: number
  className: string
  onChange: (event: React.ChangeEvent<unknown>, page: number) => void
  variant?: 'outlined' | 'text'
  shape?: 'rounded' | 'circular'
  totalCount: number
  pageLimit: number
}

const CustomMuiPagination: React.FC<CustomPaginationProps> = ({
  pageSkip,
  onChange,
  className,
  variant = 'outlined',
  shape = 'rounded',
  totalCount,
  pageLimit,
}) => {
  const count = Math.ceil((Number(totalCount ?? 0) || 1) / Number(pageLimit))
  return (
    <Pagination
      className={className}
      page={pageSkip / 10 + 1}
      count={count}
      onChange={onChange}
      variant={variant}
      shape={shape}
    />
  )
}

export default CustomMuiPagination
