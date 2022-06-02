import * as React from 'react'
import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

export default function Notification({ open, onCloseModal, title }) {
  const action = (
    <React.Fragment>
      <IconButton
        size='small'
        aria-label='close'
        color='inherit'
        onClick={onCloseModal}
      >
        <CloseIcon fontSize='small' />
      </IconButton>
    </React.Fragment>
  )

  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={onCloseModal}
        message={title}
        action={action}
      />
    </div>
  )
}
