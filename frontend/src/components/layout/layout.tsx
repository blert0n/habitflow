import { Flex } from '@chakra-ui/react/flex'
import { Box } from '@chakra-ui/react/box'
import { Header } from './header'
import { Sidebar } from './sidebar'

interface P {
  children: React.ReactNode
}

const Layout = ({ children }: P) => {
  return (
    <Flex direction="column" height="100vh" className="app full-width">
      <Header />
      <Flex flex="1" overflow="hidden">
        <Sidebar />
        <Box flex="1" overflowY="auto" height="full" className="full-width">
          {children}
        </Box>
      </Flex>
    </Flex>
  )
}

export { Layout }
