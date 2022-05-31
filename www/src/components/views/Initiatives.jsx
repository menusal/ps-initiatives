import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useNavigate } from 'react-router-dom'
import { auth, db, logout } from '../../lib/firebase'
import { query, collection, getDocs, where } from 'firebase/firestore'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import AccountCircle from '@mui/icons-material/AccountCircle'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import Posts from './Posts'

export default function Initiatives() {
  const [user, loading, error] = useAuthState(auth)
  const [name, setName] = useState('')
  const [posts, setPosts] = useState([])

  const navigate = useNavigate()
  const fetchUserName = async () => {
    try {
      const q = query(collection(db, 'users'), where('uid', '==', user?.uid))
      const doc = await getDocs(q)
      console.log('data', user, doc)
      const data = doc.docs[0].data()
      setName(data.name)
    } catch (err) {
      console.error(err)
      // alert("An error occured while fetching user data");
    }
  }
  useEffect(() => {
    if (!user) return navigate('/')
    if (!loading) {
      setTimeout(() => {
        fetchUserName()
      }, 500)
    }
  }, [user])

  useEffect(() => {
    // Hook to handle the initial fetching of posts
    const querySnapshot = getDocs(collection(db, 'posts')).then(
      (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        console.log('data', data)
        setPosts(data)
      },
    )
  }, [])

  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleChange = (event) => {}

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position='static' style={{ backgroundColor: '#eb1410' }}>
          <Toolbar>
            <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
              PS-INITIATIVES
            </Typography>
            {auth && (
              <div>
                <IconButton
                  size='large'
                  aria-label='account of current user'
                  aria-controls='menu-appbar'
                  aria-haspopup='true'
                  onClick={handleMenu}
                  color='inherit'
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id='menu-appbar'
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={logout}>Logout</MenuItem>
                </Menu>
              </div>
            )}
          </Toolbar>
        </AppBar>
        {<Posts posts={posts} />}
      </Box>
    </div>
  )
}
