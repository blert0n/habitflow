import { Button, Flex, Input, Link, Text } from '@chakra-ui/react'
import { LockIcon } from '@/assets/icons/lock'

const ForgotPassword = () => {
  return (
    <Flex
      className="app-box-shadow"
      justifyContent="center"
      alignItems="center"
      height="fit-content"
      justifySelf="center"
      direction="column"
      paddingX={{ base: 4, sm: 8 }}
      gap={4}
      flex={1}
      padding={4}
      maxW={{ base: '100%', sm: '400px', md: '500px' }}
      minW={{ base: 'full', sm: '400px', md: '500px' }}
      bg="white"
      borderRadius="lg"
      borderWidth="1px"
      borderColor="gray.200"
    >
      <Flex
        direction="column"
        justifyContent="center"
        alignItems="center"
        w="full"
      >
        <LockIcon boxSize={128} />
      </Flex>
      <Flex
        mt={4}
        direction="column"
        gap={1}
        justifyContent="center"
        alignItems="center"
        w="full"
      >
        <Text fontSize={18}>Reset your password</Text>
        <Text color="gray.500" fontSize={14} textAlign="center">
          Enter your email and we'll send you a link to reset your password
        </Text>
      </Flex>
      <Flex direction="column" gap={1} w="full">
        <Flex direction="column" gap={1 / 2}>
          <Text color="gray.700" fontSize={14}>
            Email address
          </Text>
          <Input
            type="email"
            placeholder="Enter your email address"
            size="md"
          />
        </Flex>
        <Button variant="primary" size="sm" mt={4}>
          Send reset link
        </Button>
        <Flex alignSelf="center" alignItems="center" gap={1} my={4}>
          <Text fontSize={14} color="gray.600">
            Remember your password?
          </Text>
          <Link
            href="/sign-in"
            textDecoration="none"
            _focus={{ boxShadow: 'none' }}
            flexShrink={0}
            fontSize={14}
            color="gray.700"
            display="flex"
            alignSelf="end"
            fontWeight="semibold"
          >
            Sign in
          </Link>
        </Flex>
      </Flex>
    </Flex>
  )
}

export { ForgotPassword }
