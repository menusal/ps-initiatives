import React, { useState } from 'react'
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
} from '@mui/material'

export default function ModalCreateInitiative({
  open,
  onClose,
  onCreate,
  loading,
}) {
  const [title, setTitle] = useState('')

  const handleCreate = () => {
    onCreate(title)
    setTitle('')
  }

  return (
    <div>
      <Dialog open={open} fullWidth={true}>
        <DialogTitle>New Initiative</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please, be descriptive about your initiative.
          </DialogContentText>

          <TextField
            autoFocus
            multiline
            margin='dense'
            id='title'
            label='Title'
            type='text'
            fullWidth
            variant='standard'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant='outlined' onClick={handleCreate} disabled={loading}>
            {loading && <CircularProgress />}
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
