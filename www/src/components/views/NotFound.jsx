
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import { Typography } from '@mui/material'
import { NavLink } from 'react-router-dom'
import background404 from '@/assets/404.svg'

export default function NotFound() {

  return (
    <Container
      style={{
        flex: '1 1 auto',
        display: 'flex',
        paddingTop: '25%',
      }}
    >
      <Grid
        container
        direction='column'
        spacing={2}
        justifyContent='center'
        alignContent='space-between'
        style={{
          backgroundImage: `url("${background404}")`,
          backgroundPosition: 'bottom',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          height: '100%',
        }}
      >
        <Grid item>
          <Typography variant='h1'>Error 404</Typography>
        </Grid>
        <Grid item>
          <Typography variant='h3'>
            Whoops!
            <br />
            You’re lost at sea
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant='body1'>
            The page you’re looking for doesn’t exist...
            <br />
            Use the button below to find your way home.
          </Typography>
        </Grid>
        <Grid
          item
          style={{
            marginTop: '24px',
          }}
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
