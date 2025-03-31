import React from 'react'
import { Select, MenuItem } from '@mui/material'

/**
 * This CustomMuiSelectDropdown is a  component around the Material-UI `Select` dropdown component.
 * It provides a customizable dropdown list that can accept an array of options and an optional placeholder.
 * The component renders a list of options in a dropdown and allows for easy integration with other form elements.
 */

const CustomMuiSelectDropdown = ({ options, placeholder, ...props }: any) => {
  return (
    <Select {...props} displayEmpty>
      {placeholder && (
        <MenuItem value="" disabled>
          {placeholder}
        </MenuItem>
      )}

      {options.map((option: any) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  )
}

export default CustomMuiSelectDropdown;