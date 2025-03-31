import React from 'react';
import { Typography, TypographyProps } from '@mui/material';

/**
 * CustomMuiTypography is a wrapper component around the Material-UI `Typography` component.
 * It simplifies rendering text with additional customization by allowing the usage of the `title` prop.
 * This component accepts all the same props as `Typography`, but ensures that a `title` string is always displayed.
 */

interface CustomMuiTypographyProps extends TypographyProps {
  title: string;
}

const CustomMuiTypography: React.FC<CustomMuiTypographyProps> = ({
  title,
  ...props
}) => {
  return <Typography {...props}>{title}</Typography>;
};

export default CustomMuiTypography;
