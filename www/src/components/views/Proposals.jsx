import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { formatDate } from '../../utils/formatUtils'
import { auth } from '../../lib/firebase'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp'
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown'
import Typography from '@mui/material/Typography'

export default function Proposals({ proposals, onVoteUp, onVoteDown }) {
  const [user] = useAuthState(auth)

  return (
    <Container component='main' maxWidth='md'>
      <List dense={false}>
        {proposals.map((proposal, idx) => (
          <div key={idx}>
            <Grid container spacing={2}>
              <Grid item xs={1} alignContent='center'>
                <Grid
                  container
                  spacing={0}
                  mt={2}
                  direction='column'
                  alignItems='center'
                  justifyContent='center'
                >
                  <Grid item>
                    <IconButton
                      disabled={
                        proposal.positiveVotes.includes(user.uid) ||
                        proposal.negativeVotes.includes(user.uid)
                      }
                      color='primary'
                      aria-label='vote up'
                      component='span'
                      onClick={() => onVoteUp(proposal.id)}
                    >
                      <ArrowCircleUpIcon fontSize='large' color='success' />
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <Typography
                      variant='h5'
                      color='textSecondary'
                      fontWeight={600}
                    >
                      {proposal.positiveVotes.length}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <IconButton
                      disabled={
                        proposal.positiveVotes.includes(user.uid) ||
                        proposal.negativeVotes.includes(user.uid)
                      }
                      color='primary'
                      aria-label='vote up'
                      component='span'
                      onClick={() => onVoteDown(proposal.id)}
                    >
                      <ArrowCircleDownIcon fontSize='large' color='error' />
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={11}>
                <ListItem
                  style={{
                    backgroundColor: '#f3f3f3',
                    border: '1px solid #eee',
                    margin: '1rem 0',
                    borderRadius: '2px',
                  }}
                >
                  <ListItemText primary={proposal.description} />
                </ListItem>
                <Typography variant='caption' color='textSecondary'>
                  {`${proposal.userName} - ${formatDate(
                    proposal.createAt,
                  ).toLocaleString('es-ES', { timeZone: 'UTC' })}. votes: ${
                    proposal.positiveVotes.length +
                    proposal.negativeVotes.length
                  }`}
                </Typography>
              </Grid>
            </Grid>
          </div>
        ))}
      </List>
    </Container>
  )
}