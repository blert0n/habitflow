import { Box, Flex } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Header } from './header'
import { AppSpinner } from './app-spinner'
import { useAuth } from '@/hooks/useAuth'

const NonAuthenticated = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && user) {
      navigate({ to: '/' })
    }
  }, [user, isLoading, navigate])

  if (isLoading || user) return <AppSpinner />

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
