'use client'

import { Avatar, AvatarGroup } from '@chakra-ui/react/avatar'
import { Card } from '@chakra-ui/react/card'
import { Flex } from '@chakra-ui/react/flex'
import { Image } from '@chakra-ui/react/image'
import { Link } from '@chakra-ui/react/link'
import { Menu, Portal, useBreakpointValue } from '@chakra-ui/react'
import { useAuth } from '@/hooks/useAuth'

interface P {
  isLoggedIn?: boolean
}

const Header = ({ isLoggedIn = true }: P) => {
  const isMobile = useBreakpointValue({ base: true, sm: false })
  const { signOut } = useAuth()

  return (
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
            <Link href="/" textDecoration="none" _focus={{ boxShadow: 'none' }}>
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
              <Menu.Root>
                <Menu.Trigger asChild>
                  <AvatarGroup cursor="pointer">
                    <Avatar.Root>
                      <Avatar.Fallback />
                      <Avatar.Image />
                    </Avatar.Root>
                  </AvatarGroup>
                </Menu.Trigger>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content>
                      <Menu.Item
                        value="signOut"
                        color="fg.error"
                        _hover={{ bg: 'bg.error', color: 'fg.error' }}
                        onClick={() => {
                          signOut()
                        }}
                      >
                        Sign out
                      </Menu.Item>
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
            </Flex>
          )}
        </Flex>
      </Card.Body>
    </Card.Root>
  )
}

export { Header }
