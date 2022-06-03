import React, { useState, useEffect } from 'react'
import {
  Alert,
  AlertTitle,
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
  const [bacon, setBacon] = useState('')

  const getBacon = async () => {
    const res = await fetch(
      'https://us-central1-ps-initiatives.cloudfunctions.net/getBacon',
    )
    const json = await res.json()
    setBacon(json.result)
  }

  useEffect(() => {
    if (open)
      getBacon()
    else
      setBacon('')
  }, [open])

  const handleCreate = () => {
    onCreate(title)
    setTitle('')
  }

  return (
    <div>
      <Dialog open={open} fullWidth={true}>
        <DialogTitle>New Initiative</DialogTitle>
        <DialogContent>
          <Alert severity='info'>
            <AlertTitle>Looking for inspiration?</AlertTitle>
            {bacon !== '' ? bacon : <CircularProgress />}
          </Alert>
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
