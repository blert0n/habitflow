import { Box, Flex } from '@chakra-ui/react'
import { Header } from './header'

const NonAuthenticated = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex direction="column" height="100vh" className="app full-width">
      <Header isLoggedIn={false} />
      <Flex flex="1" overflow="hidden">
        <Box flex="1" overflowY="auto" height="full" className="full-width">
          {children}
        </Box>
      </Flex>
    </Flex>
  )
}

export { NonAuthenticated }
