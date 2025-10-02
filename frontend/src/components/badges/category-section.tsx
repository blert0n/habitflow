import { Box, Flex, Grid, Text } from '@chakra-ui/react'
import type { ReactNode } from 'react'

interface CategorySectionProps {
  title: string
  icon: ReactNode
  iconColor: string
  iconBackground: string
  children: ReactNode
}

export const CategorySection = ({
  title,
  icon,
  iconColor,
  iconBackground,
  children,
}: CategorySectionProps) => {
  return (
    <Box mb={8}>
      {/* Category Header */}
      <Flex align="center" gap={2} mb={4}>
        <Flex
          align="center"
          justify="center"
          width={6}
          height={6}
          borderRadius="full"
          bg={iconBackground}
          color={iconColor}
        >
          {icon}
        </Flex>
        <Text fontSize="lg" fontWeight="600" color="gray.800">
          {title}
        </Text>
      </Flex>

      {/* Badges Grid */}
      <Grid
        templateColumns={{
          base: 'repeat(2, 1fr)',
          sm: 'repeat(auto-fill, minmax(220px, 1fr))',
        }}
        gap={6}
        width="100%"
        justifyItems="center"
      >
        {children}
      </Grid>
    </Box>
  )
}
