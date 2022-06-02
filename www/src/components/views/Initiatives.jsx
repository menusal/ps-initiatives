import React, { useEffect, useState, useMemo } from 'react'
import { onSnapshot } from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../lib/firebase'
import {
  getInitiativesCollection,
  getProposalsCollection,
  createInitiative,
  createProposal,
  deleteInitiative,
  deleteProposal,
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
import Proposals from './Proposals'
import Header from './Header'
import ModalCreateInitiative from './ModalCreateInitiative'
import ModalCreateProposal from './ModalCreateProposal'
import Notification from './Notification'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'

const orderIndex = ['title', 'createAt', 'rating']
let unsubscribeInitiatives = null
let unsubscribeProposals = null

export default function Initiatives() {
  const [user, loading, error] = useAuthState(auth)
  const [name, setName] = useState('')
  const [proposals, setProposals] = useState([])
  const [initiatives, setInitiatives] = useState([])
  const [currentInitiative, setCurrentInitiative] = useState(null)
  const [openNotification, setOpenNotification] = useState(false)
  const [notification, setNotification] = useState('')
  const [openCreateInitiative, setOpenCreateInitiative] = useState(false)
  const [openCreateProposal, setOpenCreateProposal] = useState(false)
  const [loadingInitiatives, setLoadingInitiatives] = useState(false)
  const [loadingProposals, setLoadingProposals] = useState(false)
  const [orderBy, setOrderBy] = useState('asc')
  const [order, setOrder] = useState(orderIndex[0])
  const navigate = useNavigate()

  const getInitiatives = async (order, orderBy) => {
    console.log('getInitiatives')
    setLoadingInitiatives(true)
    const newInitiatives = await getInitiativesCollection(order, orderBy)
    setLoadingInitiatives(false)

    unsubscribeInitiatives = onSnapshot(newInitiatives.q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const showNotification =
          user && change.doc.id && change.doc.data().uid !== user.uid

        if (change.type === 'added') {
          setNotification(`Initiative added by ${change.doc.data().userName}`)
          showNotification && initiatives.length > 0 && setOpenNotification(true)
        }

        if (change.type === 'removed') {
          setNotification(`Initiative removed by ${change.doc.data().userName}`)
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

  const getProposals = async () => {
    setLoadingProposals(true)
    const newProposals = await getProposalsCollection()
    setLoadingProposals(false)

    unsubscribeProposals = onSnapshot(newProposals.q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const showNotification =
          user && change.doc.id && change.doc.data().uid !== user.uid

        if (change.type === 'added') {

            setNotification(`Proposal added by ${change.doc.data().userName}`)
            showNotification && setOpenNotification(true)

        }

        if (change.type === 'removed') {
          setNotification(`Proposal added by ${change.doc.data().userName}`)
          showNotification && setOpenNotification(true)

        }
      })
      const proposalsSnapshot = []
      snapshot.docs.forEach((doc) => {
        proposalsSnapshot.push({ ...doc.data(), id: doc.id })
      })
      setProposals(proposalsSnapshot)
    })
  }

  // componentDidMount
  useEffect(() => {
    if (!user) return navigate('/')
    initiatives.length === 0 && getInitiatives(order, orderBy)
    getProposals()
    return () => {
      typeof unsubscribeInitiatives === 'function' && unsubscribeInitiatives()
      typeof unsubscribeProposals === 'function' && unsubscribeProposals()
    }
  }, [])

  useEffect(() => {
    if (user) {
      setName(user.displayName || 'Guest')
    }
  }, [user])

  const handleOpenCreateInitiative = () => {
    setOpenCreateInitiative(true)
  }

  const handleCloseCreate = () => {
    setOpenCreateInitiative(false)
  }

  const handleCreateInitiative = async (title) => {
    const newInitiative = {
      createAt: new Date(),
      title,
      uid: user.uid,
      userName: user.displayName,
      rating: 0,
    }
    setLoadingInitiatives(true)
    await createInitiative(newInitiative)
    setLoadingInitiatives(false)
    setOpenCreateInitiative(false)
  }

  const handleOpenCreateProposal = (initiative) => {
    setCurrentInitiative(initiative)
    setOpenCreateProposal(true)
  }

  const handleCloseCreateProposal = () => {
    setOpenCreateProposal(false)
  }

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

    console.log('newProposal', newProposal)

    setLoadingProposals(true)
    await createProposal(newProposal)
    setLoadingProposals(false)
    getProposals()
    setOpenCreateProposal(false)
  }

  const handleVoteUp = (id) => {
    console.log('handleVoteUp', id)
  }

  const handleVoteDown = (id) => {
    console.log('handleVoteDown', id)
  }

  const handleCloseNotification = () => {
    setOpenNotification(false)
  }

  const handleDeleteInitiative = async (id) => {
    console.log('handleDeleteInitiative', id)
    await deleteInitiative(id, proposals)
  }

  const handleDeleteProposal = async (proposal) => {
    await deleteProposal(proposal)
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
          <Grid container spacing={2}>
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
                      {initiative.rating}
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

                {loadingProposals && <LinearProgress />}
                {user && proposals.length > 0 && (
                  <Proposals
                    proposals={proposals.filter(
                      (x) => x.initiativeId === initiative.id,
                    )}
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
