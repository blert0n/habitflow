'use client'

import { Avatar, AvatarGroup } from '@chakra-ui/react/avatar'
import { Card } from '@chakra-ui/react/card'
import { Flex } from '@chakra-ui/react/flex'
import { Image } from '@chakra-ui/react/image'
import { Link } from '@chakra-ui/react/link'
import { useBreakpointValue } from '@chakra-ui/react'

const Header = () => {
  const isMobile = useBreakpointValue({ base: true, sm: false })

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
          <Flex alignItems="center" gap="8px">
            <AvatarGroup>
              <Avatar.Root>
                <Avatar.Fallback />
                <Avatar.Image />
              </Avatar.Root>
            </AvatarGroup>
          </Flex>
        </Flex>
      </Card.Body>
    </Card.Root>
  )
}

export { Header }
