import React from 'react'
import { Tooltip } from '@mui/material';

/**
 * CustomMuiTooltip is a wrapper around the Material-UI `Tooltip` component that provides additional styling and 
 * It allows you to easily display extra information when hovering over an element in a consistent, customizable way.
 * 
 * This component passes all standard props to the `Tooltip` component, including text content, positioning, and styling.
 * */

const CustomMuiTooltip = (props: any) => (
  <Tooltip
    className="customTooltip"
    {...props}
    arrow
  />
);

export default CustomMuiTooltip;
