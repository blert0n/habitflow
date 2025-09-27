'use client'

import { useState } from 'react'
import { Avatar, AvatarGroup } from '@chakra-ui/react/avatar'
import { Card } from '@chakra-ui/react/card'
import { Flex } from '@chakra-ui/react/flex'
import { Image } from '@chakra-ui/react/image'
import { Link } from '@chakra-ui/react/link'
import {
  Box,
  IconButton,
  Menu,
  Portal,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react'
import { MobileNav } from './mobile-nav'
import { useAuth } from '@/hooks/useAuth'
import { MenuIcon } from '@/assets/icons/menu'
import { LogoutIcon } from '@/assets/icons/logout'

interface P {
  isLoggedIn?: boolean
}

const Header = ({ isLoggedIn = true }: P) => {
  const isMobile = useBreakpointValue({ base: true, sm: false })
  const shouldShowMobileNav = useBreakpointValue({ base: true, midMd: false })
  const { signOut, user } = useAuth()
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  return (
    <>
      <Card.Root
        borderRadius="none"
        boxShadow="none"
        border="none"
        borderBottom="1px solid"
        borderColor="gray.200"
        position={isMobile ? 'sticky' : 'static'}
        top={isMobile ? 0 : undefined}
        zIndex={isMobile ? 1000 : undefined}
        bg="white"
      >
        <Card.Body>
          <Flex justifyContent="space-between" alignItems="center">
            <Flex alignItems="center" gap="8px">
              <Link
                href="/"
                textDecoration="none"
                _focus={{ boxShadow: 'none' }}
              >
                <Image
                  src="/images/habitflow.png"
                  boxSize="40px"
                  borderRadius="full"
                  fit="cover"
                  alt="HabitFlow"
                />
                <div>HabitFlow</div>
              </Link>
            </Flex>
            {isLoggedIn && (
              <Flex alignItems="center" gap="8px">
                {!shouldShowMobileNav && (
                  <Menu.Root>
                    <Menu.Trigger asChild>
                      <AvatarGroup cursor="pointer">
                        <Avatar.Root>
                          <Avatar.Fallback bg="brand.500" color="white">
                            {user?.firstName?.[0]?.toUpperCase() || 'U'}
                            {user?.lastName?.[0]?.toUpperCase() || ''}
                          </Avatar.Fallback>
                          <Avatar.Image />
                        </Avatar.Root>
                      </AvatarGroup>
                    </Menu.Trigger>
                    <Portal>
                      <Menu.Positioner>
                        <Menu.Content
                          minWidth="280px"
                          p={0}
                          borderRadius="xl"
                          shadow="xl"
                          border="1px solid"
                          borderColor="gray.200"
                        >
                          {/* User Info Header */}
                          <Box
                            p={4}
                            pb={3}
                            borderBottom="1px solid"
                            borderColor="gray.100"
                          >
                            <Flex alignItems="center" gap={3}>
                              <Avatar.Root size="md">
                                <Avatar.Fallback bg="brand.500" color="white">
                                  {user?.firstName?.[0]?.toUpperCase() || 'U'}
                                  {user?.lastName?.[0]?.toUpperCase() || ''}
                                </Avatar.Fallback>
                              </Avatar.Root>
                              <Box>
                                <Text
                                  fontSize="16px"
                                  fontWeight="semibold"
                                  color="gray.600"
                                >
                                  {user && user.firstName && user.lastName
                                    ? `${user.firstName} ${user.lastName}`
                                    : user?.email || 'User'}
                                </Text>
                                {user && user.email && user.firstName && (
                                  <Text fontSize="14px" color="gray.500">
                                    {user.email}
                                  </Text>
                                )}
                              </Box>
                            </Flex>
                          </Box>

                          {/* Sign Out Item */}
                          <Box p={2}>
                            <Menu.Item
                              value="signOut"
                              p={3}
                              borderRadius="lg"
                              bg="linear-gradient(135deg, rgba(255, 97, 97, 0.08), rgba(255, 97, 97, 0.04))"
                              border="1px solid"
                              borderColor="rgba(255, 97, 97, 0.2)"
                              _hover={{
                                bg: 'linear-gradient(135deg, rgba(255, 97, 97, 0.12), rgba(255, 97, 97, 0.06))',
                                transform: 'translateY(-1px)',
                                shadow: 'md',
                              }}
                              transition="all 0.2s ease"
                              onClick={() => {
                                signOut()
                              }}
                            >
                              <Flex alignItems="center" gap={3}>
                                <Box
                                  p={2}
                                  bg="rgba(255, 97, 97, 0.15)"
                                  borderRadius="full"
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="center"
                                >
                                  <LogoutIcon boxSize="16px" color="#FF6161" />
                                </Box>
                                <Box>
                                  <Text
                                    fontSize="15px"
                                    fontWeight="semibold"
                                    color="#FF6161"
                                    mb={0.5}
                                  >
                                    Sign Out
                                  </Text>
                                  <Text fontSize="12px" color="gray.500">
                                    End your session
                                  </Text>
                                </Box>
                              </Flex>
                            </Menu.Item>
                          </Box>
                        </Menu.Content>
                      </Menu.Positioner>
                    </Portal>
                  </Menu.Root>
                )}
                {shouldShowMobileNav && (
                  <IconButton
                    aria-label="Open navigation menu"
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsMobileNavOpen(true)}
                  >
                    <MenuIcon boxSize="16px" color="brand.primary" />
                  </IconButton>
                )}
              </Flex>
            )}
          </Flex>
        </Card.Body>
      </Card.Root>

      {/* Mobile Navigation */}
      {shouldShowMobileNav && isLoggedIn && (
        <MobileNav
          isOpen={isMobileNavOpen}
          onClose={() => setIsMobileNavOpen(false)}
        />
      )}
    </>
  )
}

export { Header }
