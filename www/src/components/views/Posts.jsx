import React from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Paper from '@mui/material/Paper'
import Container from '@mui/material/Container'

export default function Posts({ posts }) {
  return (
    <Container component='main' maxWidth='md'>
      <List dense={false}>
        {posts.map((post, idx) => (
          <Paper elevation={1} key={idx}>
            <ListItem
              style={{
                backgroundColor: '#f5f5f5',
                margin: '1rem 0',
                borderRadius: '5px',
              }}
            >
              <ListItemText
                primary={post.title}
                secondary={formatDate(post.createAt).toDateString()}
              />
            </ListItem>
          </Paper>
        ))}
      </List>
    </Container>
  )
}

const formatDate = (time) => {
  console.log('time', time)
  return new Date(time.seconds * 1000 + time.nanoseconds / 1000000)
}
