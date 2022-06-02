import React, { useState } from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Grid from '@mui/material/Grid'
import { useAuthState } from 'react-firebase-hooks/auth'

const options = ['Title', 'Date created', 'Rating']

export default function SortBy({ onChange, onOrderChange }) {
  const [anchorOrderEl, setAnchorOrderEl] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [order, setOrder] = useState('asc')

  const open = Boolean(anchorOrderEl)

  const handleClickListItem = (event) => {
    setAnchorOrderEl(event.currentTarget)
  }

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index)
    onChange(index)
    setAnchorOrderEl(null)
  }

  const handleOrderClose = () => {
    setAnchorOrderEl(null)
  }

  const handleOrderChange = (event, value) => {
    setOrder(value)
    onOrderChange(value)
  }

  return (
      <Grid container spacing={2} mr={2}>
        <Grid item xs={6}>
          <List
            component='nav'
            aria-label='Device settings'
            sx={{ bgcolor: 'background.paper' }}
          >
            <ListItem
              button
              dense={true}
              id='lock-button'
              aria-haspopup='listbox'
              aria-controls='lock-menu'
              aria-label='Sort by:'
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClickListItem}
              style={{
                // backgroundColor: '#eb1410',
                // color: '#FFF',
                border: '1px solid #e6e6e6',
                borderRadius: '4px',
              }}
            >
              <ListItemText primary={`Sort by: ${options[selectedIndex]}`} />
            </ListItem>
          </List>
          <Menu
            id='lock-menu'
            anchorEl={anchorOrderEl}
            open={open}
            onClose={handleOrderClose}
            MenuListProps={{
              'aria-labelledby': 'lock-button',
              role: 'listbox',
            }}
          >
            {options.map((option, index) => (
              <MenuItem
                key={option}
                selected={index === selectedIndex}
                onClick={(event) => handleMenuItemClick(event, index)}
              >
                {option}
              </MenuItem>
            ))}
          </Menu>
        </Grid>
        <Grid item xs={6} pt={4}>
          <ToggleButtonGroup
            color='primary'
            value={order}
            style={{
              marginTop: '0.5rem',
              height: '38px'
            }}
            exclusive
            onChange={handleOrderChange}
          >
            <ToggleButton value='asc'>Ascending</ToggleButton>
            <ToggleButton value='desc'>descending</ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>

  )
}
