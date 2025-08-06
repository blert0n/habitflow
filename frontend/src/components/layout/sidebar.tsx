import { useState } from 'react'
import { IconButton, Link, Text, useBreakpointValue } from '@chakra-ui/react'
import { Card } from '@chakra-ui/react/card'
import { Flex } from '@chakra-ui/react/flex'
import {
  Calendar,
  ChartNoAxesCombined,
  ChartSpline,
  ChevronLeft,
  List,
  Menu,
  NotebookPen,
  Trophy,
} from 'lucide-react'
import { useRouterState } from '@tanstack/react-router'
import { motion } from 'framer-motion'

const isActive = (href: string, pathname: string) => {
  if (href === '/') return pathname === '/'
  return pathname.startsWith(href)
}

const MotionCard = motion.create(Card.Root)

const sidebarLinks = [
  { href: '/', icon: ChartSpline, label: 'Dashboard' },
  { href: '/calendar', icon: Calendar, label: 'Calendar' },
  { href: '/habits', icon: List, label: 'All habits' },
  { href: '/notes', icon: NotebookPen, label: 'Notes' },
  { href: '/analytics', icon: ChartNoAxesCombined, label: 'Analytics' },
  { href: '/badges', icon: Trophy, label: 'Badges' },
]
const Sidebar = () => {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  const [isOpen, setIsOpen] = useState(true)

  const isMobile = useBreakpointValue({ base: true, midMd: false })

  return (
    <MotionCard
      initial={false}
      animate={
        !isMobile
          ? { width: isOpen ? 200 : 60, height: '100%' }
          : { width: '100%', height: '60px' }
      }
      transition={{ duration: 0.3 }}
      position={isMobile ? 'fixed' : 'relative'}
      bottom={isMobile ? 0 : 'auto'}
      left={0}
      right={0}
      zIndex={10}
      borderRadius="none"
      boxShadow="md"
      border="none"
      overflow="visible"
    >
      <Card.Body px={2} py={2} height="full">
        <Flex
          direction={isMobile ? 'row' : 'column'}
          align="center"
          justify={isMobile ? 'space-around' : 'flex-start'}
          height="full"
          gap={2}
        >
          {/* Show toggle only on desktop */}
          {!isMobile && (
            <Flex>
              <IconButton
                aria-label="Toggle sidebar"
                size="sm"
                variant="ghost"
                onClick={() => setIsOpen((prev) => !prev)}
              >
                {isOpen ? <ChevronLeft /> : <Menu />}
              </IconButton>
            </Flex>
          )}

          {sidebarLinks.map(({ href, icon: Icon, label }) => (
            <Link
              key={label}
              href={href}
              textDecoration="none"
              _focus={{ boxShadow: 'none' }}
              flexShrink={0}
              width={isMobile ? 'auto' : 'full'}
            >
              <Flex
                alignItems="center"
                gap={isOpen && !isMobile ? 3 : 0}
                p={2}
                pr={isMobile ? 2 : 4}
                borderRadius="md"
                backgroundColor={
                  isActive(href, pathname) ? 'bgDark' : 'transparent'
                }
                justifyContent={
                  isMobile ? 'center' : isOpen ? 'flex-start' : 'center'
                }
              >
                <Icon size={20} />
                {!isMobile && isOpen && (
                  <Text fontSize="14px" color="gray.800" whiteSpace="nowrap">
                    {label}
                  </Text>
                )}
              </Flex>
            </Link>
          ))}
        </Flex>
      </Card.Body>
    </MotionCard>
  )
}

export { Sidebar }
