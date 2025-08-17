import { Flex } from '@chakra-ui/react/flex'
import { Box } from '@chakra-ui/react/box'
import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Header } from './header'
import { Sidebar } from './sidebar'
import { AppSpinner } from './app-spinner'
import { useAuth } from '@/hooks/useAuth'

interface P {
  children: React.ReactNode
}

const Layout = ({ children }: P) => {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !user) {
      navigate({ to: '/sign-in' })
    }
  }, [user, isLoading, navigate])

  if (isLoading || !user) return <AppSpinner />

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
