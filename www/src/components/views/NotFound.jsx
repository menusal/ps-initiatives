import { Typography, Button, Container, Grid, Link } from '@mui/material'
import { NavLink } from 'react-router-dom'
import background404 from '@/assets/arana.webp'

export default function NotFound() {
  return (
    <Container
      style={{
        flex: '1 1 auto',
        display: 'flex',
        backgroundImage: `url("${background404}")`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        height: '100vh',
      }}
    >
      <Grid
        container
        direction='column'
        spacing={2}
        justifyContent='center'
        alignContent='center'
      >
        <Grid item>
          <Typography
            variant='h1'
            style={{
              fontSize: '362px',
              textShadow:
                '10px 0 0 #000, -10px 0 0 #000, 0 10px 0 #000, 0 -10px 0 #000, 10px 10px #000, -10px -10px 0 #000, 10px -10px 0 #000, -10px 10px 0 #000',
            }}
            color='#FFF'
          >
            404
          </Typography>
        </Grid>
        <Grid item>
          <Typography
            variant='h2'
            style={{
              textShadow:
                '3px 0 0 #000, -3px 0 0 #000, 0 3px 0 #000, 0 -3px 0 #000, 3px 3px #000, -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000',
            }}
            color='#FFF'
          >
            You are trapped
          </Typography>
        </Grid>

        <Grid
          item
        >
          <Link to='/' component={NavLink} underline='none'>
            <Button variant='contained' color='primary' size='large'>
              Take me home
            </Button>
          </Link>
        </Grid>
      </Grid>
    </Container>
  )
}
