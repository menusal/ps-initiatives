import React, { useState } from 'react'
import { auth, logout } from '../../lib/firebase'
import { useNavigate } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import AccountCircle from '@mui/icons-material/AccountCircle'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import { ReactComponent as Logo } from '../../assets/logo.svg'

export default function Header({ name }) {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <AppBar position='static' style={{ backgroundColor: '#eb1410' }}>
      <Toolbar>
        <Logo style={{ height: 40 }} />
        <Typography
          variant='body1'
          component='div'
          sx={{ flexGrow: 1 }}
          fontWeight={600}
          ml={1}
        >
          PS-Initiatives
        </Typography>
        {auth && (
          <div>
            <IconButton
              size='large'
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleMenu}
              color='inherit'
            >
              <Typography
                variant='body1'
                component='div'
                sx={{ flexGrow: 1 }}
                mr={1}
                fontWeight={600}
              >
                {name}
              </Typography>

              <AccountCircle />
            </IconButton>
            <Menu
              id='menu-appbar'
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        )}
      </Toolbar>
    </AppBar>
  )
}
