import { Box } from '@material-ui/core'

export default function DefaultView({ children }) {
  return (
    <Box display='flex' style={{ flex: 1 }}>
      {children}
    </Box>
  )
}
