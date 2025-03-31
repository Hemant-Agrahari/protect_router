import React from 'react'
import { styled } from '@mui/material/styles'
import { Tooltip, tooltipClasses } from '@mui/material'

const BootstrapTooltip = styled(({ className, ...props }: any) => (
  <Tooltip
    className="customTooltip"
    {...props}
    arrow
    classes={{ popper: className }}
  />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: '#181E46',
    width: '20px',
    height: '14px',
    marginTop: '-16px !important',
    bottom: '-7px !important',
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#181E46',
    border: '1px solid #fff',
    fontWeight: '500',
    fontSize: '11px',
    lineHeight: '13px',
    padding: '10px',
  },
}))

export default BootstrapTooltip
