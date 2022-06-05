import React, { useEffect, useState } from 'react'
import { onSnapshot } from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../lib/firebase'
import {
  getInitiativesCollection,
  createInitiative,
  createProposal,
  deleteInitiative,
  deleteProposal,
  updateRating,
} from '../../data/models/initiativesModel'
import { formatDate } from '../../utils/formatUtils'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Container from '@mui/material/Container'
import AddIcon from '@mui/icons-material/Add'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Alert from '@mui/material/Alert'
import Proposals from './Proposals'
import Header from './Header'
import ModalCreateInitiative from './ModalCreateInitiative'
import ModalCreateProposal from './ModalCreateProposal'
import Notification from './Notification'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'

const orderIndex = ['title', 'createAt', 'rating']
let unsubscribeInitiatives = null

export default function Initiatives() {
  const [user] = useAuthState(auth)
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [proposals] = useState([])
  const [initiatives, setInitiatives] = useState([])
  const [currentInitiative, setCurrentInitiative] = useState(null)
  const [openNotification, setOpenNotification] = useState(false)
  const [notification, setNotification] = useState('')
  const [openCreateInitiative, setOpenCreateInitiative] = useState(false)
  const [openCreateProposal, setOpenCreateProposal] = useState(false)
  const [loadingInitiatives, setLoadingInitiatives] = useState(false)
  const [loadingProposals, setLoadingProposals] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const [orderBy, setOrderBy] = useState('asc')
  // eslint-disable-next-line no-unused-vars
  const [order, setOrder] = useState(orderIndex[0])
  const navigate = useNavigate()

  /**
   * It gets the initiatives from the database and sets the state of the
   * initiatives.
   */
  const getInitiatives = async (order, orderBy) => {
    setLoadingInitiatives(true)
    const newInitiatives = await getInitiativesCollection(order, orderBy)
    setLoadingInitiatives(false)

    if (!newInitiatives.data) {
      setError(newInitiatives.message)
      setLoadingInitiatives(false)
      return
    }
    unsubscribeInitiatives = onSnapshot(newInitiatives.q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const showNotification =
          user && change.doc.id && change.doc.data().uid !== user.uid

        if (change.type === 'added') {
          setNotification(
            `Initiative added`,
          )
          showNotification &&
            initiatives.length > 0 &&
            setOpenNotification(true)
        }

        if (change.type === 'modified') {
          setNotification(`Initiative "${change.doc.data().title}" has changed`)
          showNotification && setOpenNotification(true)
        }

        if (change.type === 'removed') {
          setNotification(
            `Initiative removed`,
          )
          showNotification && setOpenNotification(true)
        }
      })
      const initiativesSnapshot = []
      snapshot.docs.forEach((doc) => {
        initiativesSnapshot.push({ ...doc.data(), id: doc.id })
      })
      setInitiatives(initiativesSnapshot)
    })
  }

  useEffect(() => {
    if (!user) return navigate('/')
    initiatives.length === 0 && getInitiatives(order, orderBy)
    return () => {
      typeof unsubscribeInitiatives === 'function' && unsubscribeInitiatives()
    }
  }, [])

  useEffect(() => {
    if (user) {
      setName(user.displayName || 'Guest')
    }
  }, [user])

  /**
   * When the user clicks the button, the function sets the state of the
   * openCreateInitiative variable to true
   */
  const handleOpenCreateInitiative = () => {
    setOpenCreateInitiative(true)
  }

  /**
   * It sets the state of the openCreateInitiative to false
   */
  const handleCloseCreate = () => {
    setOpenCreateInitiative(false)
  }

  /**
   * It creates a new initiative object, sets the loading state to true, creates
   * the initiative, sets the loading state to false, and closes the create
   * initiative modal
   */
  const handleCreateInitiative = async (title) => {
    const newInitiative = {
      createAt: new Date(),
      title,
      uid: user.uid,
      userName: user.displayName,
      rating: 0,
    }
    setLoadingInitiatives(true)
    const res = await createInitiative(newInitiative)
    if (!res.id) {
      setError(res.message)
      setLoadingInitiatives(false)
      return
    }
    setLoadingInitiatives(false)
    setOpenCreateInitiative(false)
  }

  /**
   * It sets the current initiative to the initiative that was clicked on, and then
   * sets the state of the modal to open
   */
  const handleOpenCreateProposal = (initiative) => {
    setCurrentInitiative(initiative)
    setOpenCreateProposal(true)
  }

  /**
   * It sets the state of the openCreateProposal variable to false
   */
  const handleCloseCreateProposal = () => {
    setOpenCreateProposal(false)
  }

  /**
   * It creates a new proposal object, then calls the createProposal function,
   * which is a function that uses the firebase API to create a new proposal in the
   * database
   */
  const handleCreateProposal = async (proposal) => {
    const newProposal = {
      createAt: new Date(),
      updateAt: new Date(),
      initiativeId: currentInitiative.id,
      negativeVotes: [],
      positiveVotes: [],
      description: proposal,
      uid: user.uid,
      userName: user.displayName,
    }

    setLoadingProposals(true)
    await createProposal(newProposal)
    setLoadingProposals(false)
    setOpenCreateProposal(false)
  }

  /**
   * It updates the rating of a proposal.
   */
  const handleVoteUp = (proposal, initiative) => {
    updateRating(proposal, 'up', user.uid, initiative.id)
  }

  /**
   * It takes a proposal object as an argument, and then calls the updateRating
   * function, passing in the proposal, the string 'down', and the user's uid
   */
  const handleVoteDown = (proposal, initiative) => {
    updateRating(proposal, 'down', user.uid, initiative.id)
  }

  /**
   * It sets the state of the openNotification variable to false
   */
  const handleCloseNotification = () => {
    setOpenNotification(false)
  }

  /**
   * It deletes an initiative.
   */
  const handleDeleteInitiative = async (id) => {
    await deleteInitiative(id, proposals)
  }

  /**
   * It's a function that takes a proposal as an argument and then calls the
   * deleteProposal function with that proposal as an argument
   */
  const handleDeleteProposal = async (proposal, initiative) => {
    await deleteProposal(proposal, initiative.id)
  }

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <Header name={name} />
        <Container component='main' maxWidth='md' style={{ marginTop: 24 }}>
          <Typography
            variant='h4'
            component='div'
            sx={{ flexGrow: 1 }}
            mt={1}
            mb={2}
          >
            Initiatives
          </Typography>
          {error !== '' && <Alert severity='error'>{error}</Alert>}
          <Grid container spacing={2} mb={4}>
            <Grid item xs={6}>
              <Button
                onClick={handleOpenCreateInitiative}
                aria-label='add'
                variant='outlined'
                size='small'
                style={{ marginTop: 14 }}
              >
                <AddIcon /> Add initiative
              </Button>
            </Grid>
          </Grid>
          {loadingInitiatives && <LinearProgress />}
          {initiatives.map((initiative, idx) => (
            <Accordion key={idx}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls='panel1a-content'
                id='panel1a-header'
              >
                <Grid container spacing={2}>
                  <Grid item xs={1}>
                    <Avatar sx={{ bgcolor: '#5a5858' }}>
                      {getPositiveVotes(initiative) -
                        getNegativeVotes(initiative)}
                    </Avatar>
                  </Grid>
                  <Grid item xs={10}>
                    <Typography pt={1}>{initiative.title}</Typography>
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <Typography variant='caption' color='#ccc'>
                      Created by:{' '}
                      {`${initiative.userName} - ${formatDate(
                        initiative.createAt,
                      ).toLocaleString('es-ES', { timeZone: 'UTC' })}`}
                    </Typography>
                    {user && initiative.uid === user.uid && (
                      <IconButton
                        color='secondary'
                        aria-label='upload picture'
                        component='span'
                        onClick={() => handleDeleteInitiative(initiative.id)}
                      >
                        <DeleteForeverIcon />
                      </IconButton>
                    )}
                  </Grid>
                  <Grid container xs={4} justifyContent='flex-end'>
                    <Button
                      variant='outlined'
                      size='small'
                      onClick={() => handleOpenCreateProposal(initiative)}
                    >
                      <AddIcon /> Add proposal
                    </Button>
                  </Grid>
                </Grid>
                {user &&
                  initiative.proposals &&
                  initiative.proposals.length > 0 && (
                    <Proposals
                      initiative={initiative}
                      proposals={initiative.proposals}
                      onVoteUp={handleVoteUp}
                      onVoteDown={handleVoteDown}
                      user={user}
                      onDelete={handleDeleteProposal}
                    />
                  )}
              </AccordionDetails>
            </Accordion>
          ))}
        </Container>
      </Box>

      <ModalCreateInitiative
        open={openCreateInitiative}
        onClose={handleCloseCreate}
        onCreate={handleCreateInitiative}
        loading={loadingInitiatives}
      />
      {currentInitiative && (
        <ModalCreateProposal
          open={openCreateProposal}
          onClose={handleCloseCreateProposal}
          onCreate={handleCreateProposal}
          loading={loadingProposals}
          initiative={currentInitiative}
        />
      )}
      <Notification
        open={openNotification}
        onCloseModal={handleCloseNotification}
        title={notification}
      />
    </div>
  )
}

const getPositiveVotes = (initiative) => {
  return (
    (initiative.proposals &&
      initiative.proposals.reduce(
        (acc, cur) => acc + cur.positiveVotes.length,
        0,
      )) ||
    0
  )
}

const getNegativeVotes = (initiative) => {
  return (
    (initiative.proposals &&
      initiative.proposals.reduce(
        (acc, cur) => acc + cur.negativeVotes.length,
        0,
      )) ||
    0
  )
}
