import {
  Box,
  CloseButton,
  Drawer,
  Flex,
  Portal,
  Separator,
  Text,
} from '@chakra-ui/react'
import { Avatar } from '@chakra-ui/react/avatar'
import { useRouter, useRouterState } from '@tanstack/react-router'
import { DiagramIcon } from '@/assets/icons/diagram'
import { CalendarIcon } from '@/assets/icons/calendar'
import { NotebookIcon } from '@/assets/icons/notebook'
import { ListIcon } from '@/assets/icons/list'
import { LogoutIcon } from '@/assets/icons/logout'
import { useAuth } from '@/hooks/useAuth'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

const isActive = (href: string, pathname: string) => {
  if (href === '/') return pathname === '/'
  return pathname.startsWith(href)
}

const sidebarLinks = [
  {
    href: '/',
    icon: DiagramIcon,
    label: 'Dashboard',
    color: '#2D7FF9',
    gradient:
      'linear-gradient(135deg, rgba(45, 127, 249, 0.12), rgba(45, 127, 249, 0.06))',
  },
  {
    href: '/calendar',
    icon: CalendarIcon,
    label: 'Calendar',
    color: '#8A2CF7',
    gradient:
      'linear-gradient(135deg, rgba(138, 44, 247, 0.12), rgba(138, 44, 247, 0.06))',
  },
  {
    href: '/habits',
    icon: ListIcon,
    label: 'All habits',
    color: '#FF6161',
    gradient:
      'linear-gradient(135deg, rgba(255, 97, 97, 0.12), rgba(255, 97, 97, 0.06))',
  },
  {
    href: '/notes',
    icon: NotebookIcon,
    label: 'Notes',
    color: '#F5B900',
    gradient:
      'linear-gradient(135deg, rgba(245, 185, 0, 0.12), rgba(245, 185, 0, 0.06))',
  },
]

export const MobileNav = ({ isOpen, onClose }: MobileNavProps) => {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const router = useRouter()
  const { user, signOut } = useAuth()

  return (
    <Drawer.Root open={isOpen} onOpenChange={({ open }) => !open && onClose()}>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content
            width="100vw"
            maxWidth="100vw"
            style={{
              transition: 'transform 0.15s ease-out',
            }}
          >
            <Drawer.Header>
              <Drawer.Title fontSize="18px" color="gray.800">
                Navigation
              </Drawer.Title>
              <Drawer.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Drawer.CloseTrigger>
            </Drawer.Header>
            <Drawer.Body>
              <Flex direction="column" height="100%" justify="space-between">
                {/* User Info Section */}
                <Box>
                  <Flex
                    alignItems="center"
                    gap={3}
                    p={3}
                    mb={4}
                    bg="gray.50"
                    borderRadius="md"
                  >
                    <Avatar.Root size="md">
                      <Avatar.Fallback bg="brand.500" color="white">
                        {user?.firstName?.[0]?.toUpperCase() || 'U'}
                        {user?.lastName?.[0]?.toUpperCase() || ''}
                      </Avatar.Fallback>
                    </Avatar.Root>
                    <Box>
                      <Text fontSize="16px" color="gray.500">
                        {user && user.firstName && user.lastName
                          ? `${user.firstName} ${user.lastName}`
                          : user?.email || 'User'}
                      </Text>
                      {user && user.email && user.firstName && (
                        <Text fontSize="14px" color="gray.300">
                          {user.email}
                        </Text>
                      )}
                    </Box>
                  </Flex>
                  {/* Navigation Links */}
                  <Flex direction="column" gap={2}>
                    {sidebarLinks.map(
                      ({ href, icon: Icon, label, color, gradient }) => (
                        <Flex
                          key={label}
                          alignItems="center"
                          gap={3}
                          p={3}
                          borderRadius="md"
                          background={
                            isActive(href, pathname) ? gradient : 'transparent'
                          }
                          _hover={{
                            bg: isActive(href, pathname)
                              ? gradient
                              : 'gray.100',
                          }}
                          cursor="pointer"
                          onClick={() => {
                            onClose()
                            setTimeout(() => {
                              router.navigate({ to: href })
                            }, 0)
                          }}
                        >
                          <Icon boxSize="20px" color={color} />
                          <Text
                            fontSize="16px"
                            color={
                              isActive(href, pathname) ? color : 'gray.600'
                            }
                            fontWeight={
                              isActive(href, pathname) ? 'semibold' : 'normal'
                            }
                          >
                            {label}
                          </Text>
                        </Flex>
                      ),
                    )}
                  </Flex>
                </Box>

                {/* Logout Section */}
                <Box>
                  <Separator mb={6} />
                  <Box
                    p={4}
                    bg="linear-gradient(135deg, rgba(255, 97, 97, 0.08), rgba(255, 97, 97, 0.04))"
                    borderRadius="lg"
                    border="1px solid"
                    borderColor="rgba(255, 97, 97, 0.2)"
                    mb={4}
                  >
                    <Flex
                      alignItems="center"
                      gap={3}
                      cursor="pointer"
                      p={2}
                      borderRadius="md"
                      transition="all 0.2s ease"
                      _hover={{
                        bg: 'rgba(255, 97, 97, 0.12)',
                        transform: 'translateY(-1px)',
                      }}
                      _active={{
                        transform: 'translateY(0px)',
                      }}
                      onClick={async () => {
                        onClose()
                        await signOut()
                      }}
                    >
                      <Box
                        p={2}
                        bg="rgba(255, 97, 97, 0.15)"
                        borderRadius="full"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <LogoutIcon boxSize="18px" color="#FF6161" />
                      </Box>
                      <Box flex={1}>
                        <Text
                          fontSize="16px"
                          fontWeight="semibold"
                          color="#FF6161"
                          mb={0.5}
                        >
                          Sign Out
                        </Text>
                        <Text fontSize="13px" color="gray.500">
                          End your session
                        </Text>
                      </Box>
                    </Flex>
                  </Box>
                </Box>
              </Flex>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  )
}
