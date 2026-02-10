import { useState } from 'react'
import {
  Box,
  IconButton,
  Link,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react'
import { Card } from '@chakra-ui/react/card'
import { Flex } from '@chakra-ui/react/flex'
import { useRouterState } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { CheckCheckIcon, X } from 'lucide-react'
import { DiagramIcon } from '@/assets/icons/diagram'
import { CalendarIcon } from '@/assets/icons/calendar'
import { NotebookIcon } from '@/assets/icons/notebook'
import { ListIcon } from '@/assets/icons/list'
import { LeftArrowIcon } from '@/assets/icons/back-arrow'
import { MenuIcon } from '@/assets/icons/menu'
import { TrophyIcon } from '@/assets/icons/trophy'
import { UserIcon } from '@/assets/icons/user'
import { useAuth } from '@/hooks/useAuth'

const isActive = (href: string, pathname: string) => {
  if (href === '/') return pathname === '/'
  return pathname.startsWith(href)
}

const MotionCard = motion.create(Card.Root)

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
  {
    href: '/badges',
    icon: TrophyIcon,
    label: 'Badges',
    color: '#FEB303',
    gradient:
      'linear-gradient(135deg, rgba(254, 179, 3, 0.12), rgba(254, 179, 3, 0.06))',
  },
  {
    href: '/profile',
    icon: UserIcon,
    label: 'Account',
    color: '#4294FF',
    gradient:
      'linear-gradient(135deg, rgba(66, 148, 255, 0.12), rgba(66, 148, 255, 0.06))',
  },
]
const Sidebar = () => {
  const { user } = useAuth()
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  const [isOpen, setIsOpen] = useState(true)
  const isMobile = useBreakpointValue({ base: true, midMd: false })

  if (isMobile) {
    return null
  }

  return (
    <MotionCard
      initial={false}
      animate={{ width: isOpen ? 200 : 60, height: '100%' }}
      transition={{ duration: 0.3 }}
      position="relative"
      zIndex={10}
      borderRadius="none"
      boxShadow="md"
      border="none"
      overflow="visible"
    >
      <Card.Body px={2} py={2} height="full">
        <Flex
          direction="column"
          align="center"
          justify="flex-start"
          height="full"
          gap={2}
        >
          <Flex>
            <IconButton
              aria-label="Toggle sidebar"
              size="sm"
              variant="ghost"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              {isOpen ? (
                <LeftArrowIcon boxSize="16px" />
              ) : (
                <MenuIcon boxSize="16px" color="brand.primary" />
              )}
            </IconButton>
          </Flex>

          {sidebarLinks.map(({ href, icon: Icon, label, color, gradient }) => (
            <Link
              key={label}
              href={href}
              textDecoration="none"
              _focus={{ boxShadow: 'none' }}
              flexShrink={0}
              width="full"
            >
              <Flex
                alignItems="center"
                gap={isOpen ? 3 : 0}
                p={2}
                pr={4}
                borderRadius="md"
                background={isActive(href, pathname) ? gradient : 'transparent'}
                justifyContent={isOpen ? 'flex-start' : 'center'}
                width="full"
              >
                <Icon boxSize="20px" color={color} />
                {isOpen && (
                  <Text
                    fontSize="14px"
                    color={isActive(href, pathname) ? color : 'gray.600'}
                    fontWeight={
                      isActive(href, pathname) ? 'semibold' : 'normal'
                    }
                    whiteSpace="nowrap"
                  >
                    {label}
                  </Text>
                )}
              </Flex>
            </Link>
          ))}
          {isOpen && (user?.habits?.length ?? 0) > 0 ? (
            <Flex alignSelf="start" direction="column" gap={3} mt={2}>
              <Text fontSize={14} color="gray.500" fontWeight="semibold">
                TODAY'S TO DO
              </Text>
              {user?.habits?.map((habit) => (
                <Flex
                  key={habit.id}
                  alignSelf="start"
                  direction="column"
                  gap={3}
                  paddingX={2}
                >
                  <Flex
                    gap={1}
                    justify="start"
                    alignItems="center"
                    cursor="pointer"
                  >
                    <Box w="10px" h="10px" bg={habit.color} rounded="full" />
                    <Text fontSize={14} color="gray.500">
                      {habit.name}
                    </Text>
                    {habit.isCompleted ? (
                      <CheckCheckIcon size={14} color="#22C55E" />
                    ) : (
                      <X size={14} color="#94A3B8" />
                    )}
                  </Flex>
                </Flex>
              ))}
            </Flex>
          ) : null}
        </Flex>
      </Card.Body>
    </MotionCard>
  )
}

export { Sidebar }
