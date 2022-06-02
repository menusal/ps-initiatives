import React, { useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

export default function ModalCreateProposal({
  open,
  onClose,
  onCreate,
  loading,
  initiative,
}) {
  const [proposal, setProposal] = useState('')

  const handleCreate = () => {
    onCreate(proposal)
    setProposal('')
  }

  return (
    <div>
      <Dialog open={open} fullWidth={true}>
        <DialogTitle>New Proposal</DialogTitle>
        <DialogContent>
          <Typography variant='h5' color='#666' mt={2}>
            Initiative
          </Typography>
          <Typography variant='body1' color='initial' mt={2}>
            {initiative.title}
          </Typography>
          <DialogContentText mt={2}>
            Please, be descriptive about your proposal.
          </DialogContentText>
          <TextField
            autoFocus
            multiline
            margin='dense'
            id='proposal'
            label='Proposal description'
            type='text'
            fullWidth
            variant='standard'
            value={proposal}
            onChange={(e) => setProposal(e.target.value)}
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
