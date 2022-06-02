import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../../lib/firebase'
import { collection, getDocs } from 'firebase/firestore'
import {
  getInitiativesCollection,
  getProposalsCollection,
  createInitiative,
  createProposal,
} from '../../data/models/initiativesModel'
import { formatDate } from '../../utils/formatUtils'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Container from '@mui/material/Container'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Proposals from './Proposals'
import SortBy from './SortBy'
import Header from './Header'
import ModalCreateInitiative from './ModalCreateInitiative'
import ModalCreateProposal from './ModalCreateProposal'

const orderIndex = ['title', 'createAt', 'rating']

export default function Initiatives() {
  const [user, loading, error] = useAuthState(auth)
  const [name, setName] = useState('')
  const [proposals, setProposals] = useState([])
  const [initiatives, setInitiatives] = useState([])
  const [currentInitiative, setCurrentInitiative] = useState(null)
  const [openCreateInitiative, setOpenCreateInitiative] = useState(false)
  const [openCreateProposal, setOpenCreateProposal] = useState(false)
  const [loadingInitiatives, setLoadingInitiatives] = useState(false)
  const [loadingProposals, setLoadingProposals] = useState(false)
  const [orderBy, setOrderBy] = useState('asc')
  const [order, setOrder] = useState(orderIndex[0])

  const navigate = useNavigate()

  const getInitiatives = async (order, orderBy) => {
    setLoadingInitiatives(true)
    const initiatives = await getInitiativesCollection(order, orderBy)
    setLoadingInitiatives(false)
    setInitiatives(initiatives)
  }

  const getProposals = async () => {
    setLoadingProposals(true)
    const proposals = await getProposalsCollection()
    setLoadingProposals(false)
    setProposals(proposals)
  }

  useEffect(() => {
    if (!user && !loading) return navigate('/')
    if (user) {
      setName(user.displayName)
      getInitiatives(order, orderBy)
    }
  }, [user])

  useEffect(() => {
    order && orderBy && getInitiatives(order, orderBy)
  }, [order, orderBy])

  useEffect(() => {
    getProposals()
  }, [])

  const handleSortChange = (sortBy) => {
    console.log('sortBy', sortBy)
    setOrder(orderIndex[sortBy])
  }

  const handleOrderChange = (orderBy) => {
    console.log('orderBy', orderBy)
    setOrderBy(orderBy)
  }

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
    getInitiatives(order, orderBy)
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
            <Grid item xs={5}>
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
            <Grid item xs={7}>
              <SortBy
                onChange={handleSortChange}
                onOrderChange={handleOrderChange}
              />
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
                  <Grid item xs={11}>
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
                {proposals.length > 0 && (
                  <Proposals
                    proposals={proposals.filter(
                      (x) => x.initiativeId === initiative.id,
                    )}
                    onVoteUp={handleVoteUp}
                    onVoteDown={handleVoteDown}
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
    </div>
  )
}
