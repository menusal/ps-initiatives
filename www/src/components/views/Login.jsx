import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  auth,
  signInWithGoogle,
  signInWithEmailAndPassword,
  SUCCESS,
} from '../../lib/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import LinearProgress from '@mui/material/LinearProgress'
import Logo from '../../assets/logo_carto_positive_180.webp'
import Alert from '@mui/material/Alert'

export default function Login() {
  const [email, setEmail] = useState('')
  // const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [user, loading] = useAuthState(auth)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    user && setTimeout(() => navigate('/initiatives'), 0)
  }, [user])

  const logInWithEmailAndPassword = async (email, password) => {
    try {
      const login = await signInWithEmailAndPassword(auth, email, password)
      console.log(login)
    } catch (err) {
      let errorMessage = ''

      switch (err.code) {
        case 'auth/invalid-email':
          errorMessage = 'Your email address appears to be malformed.'
          break
        case 'auth/wrong-password':
          errorMessage = 'Your password is wrong.'
          break
        case 'auth/user-not-found':
          errorMessage = "User with this email doesn't exist."
          break
        default:
          errorMessage = err.code
      }
      setError(errorMessage)
    }
  }

  const handleSignInWithGoogle = async () => {
    const response = await signInWithGoogle()
    if (response !== SUCCESS) {
      setError(formatResponse(response))
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    logInWithEmailAndPassword(email, password)
  }

  return (
    <Container component='main' maxWidth='xs'>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {loading && !user ? (
          <LinearProgress />
        ) : (
          <div>
            <img src={Logo} alt='Logo' width={300} />
            <Typography component='h1' variant='h5'>
              PS - Initiatives
            </Typography>

            <Box component='form' sx={{ mt: 1 }} onSubmit={handleSubmit}>
              {error && <Alert severity='warning'>Warning: {error}</Alert>}

              <TextField
                margin='normal'
                required
                fullWidth
                id='email'
                label='Email Address'
                name='email'
                autoComplete='email'
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
              <TextField
                margin='normal'
                required
                fullWidth
                name='password'
                label='Password'
                type='password'
                id='password'
                autoComplete='current-password'
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button
                color='secondary'
                fullWidth
                variant='contained'
                sx={{ mt: 3, mb: 2 }}
                type='submit'
              >
                Sign In
              </Button>

              <Divider sx={{ m: 4 }} />
              <Button
                fullWidth
                variant='contained'
                sx={{ mt: 1, mb: 1 }}
                onClick={handleSignInWithGoogle}
              >
                Login with Google
              </Button>

              {loading && (
                <div>
                  <p>Initialising User...</p>
                </div>
              )}
            </Box>
          </div>
        )}
      </Box>
    </Container>
  )
}

function formatResponse(message) {
  return message.replace('auth/', '').replaceAll('-', ' ')
}
