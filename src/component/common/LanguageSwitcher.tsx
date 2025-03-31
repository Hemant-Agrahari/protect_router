import React, { Fragment, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Image from 'next/image'
import { useRouter } from 'next/router'

interface Props {
  isSmallDevice?: boolean
}

export default function LanguageSwitcher({
  isSmallDevice = false,
}: Props): React.JSX.Element {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [showMenu, setShowMenu] = useState<boolean>(false)
  const [selectedLanguage, setSelectedLanguage] = useState<{
    flag: string
    value: string
    title: string
  }>({
    flag: '',
    value: '',
    title: '',
  })
  const open = Boolean(anchorEl)
  const router = useRouter()

  const handleSelect = (selectedLangu: {
    flag: string
    value: string
    title: string
  }) => {
    window.localStorage.setItem('userSelectedLanguage', selectedLangu.value)
    if (showMenu) {
      setShowMenu(false)
    }
    router
      .push(
        {
          pathname: router.pathname,
          query: router.query,
        },
        undefined,
        { locale: selectedLangu.value },
      )
      .then(() => setSelectedLanguage(selectedLangu))
  }

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const menuItem = [
    { flag: '/assets/images/ukFlag.svg', value: 'en', title: 'English' },
    { flag: '/assets/images/iranFlag.svg', value: 'fa', title: 'Persian' },
  ]

  const handleArrowClick = () => {
    setShowMenu(!showMenu)
  }

  useEffect(() => {
    const defaultLanguage = menuItem.filter(
      (item) => item.value === router.locale,
    )
    setSelectedLanguage(defaultLanguage[0])
  }, [router.locale])

  return selectedLanguage.value !== '' ? (
    <Fragment>
      <>
        <Box>
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <div
              style={
                open
                  ? {
                      border: '2px solid  var(--g-second)',
                      borderRadius: '50%',
                    }
                  : {}
              }
            >
              <Image
                src={selectedLanguage.flag}
                alt={selectedLanguage.title}
                width={38}
                height={38}
              />
            </div>
          </IconButton>
        </Box>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {menuItem.map((item, key) => {
            return (
              <React.Fragment key={key}>
                <MenuItem onClick={() => handleSelect(item)}>
                  <Image
                    src={item.flag}
                    alt={item.title}
                    width={32}
                    height={32}
                  />{' '}
                  {item.title}
                </MenuItem>
              </React.Fragment>
            )
          })}
        </Menu>
      </>
    </Fragment>
  ) : (
    <div style={{ height: '38px', width: '38px' }}></div>
  )
}
