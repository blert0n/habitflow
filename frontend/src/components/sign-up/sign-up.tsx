import { Button, Flex, IconButton, Input, Link, Text } from '@chakra-ui/react'
import { TextWithDivider } from '../ui/text-with-divider'
import { PasswordWithValidator } from './password-with-validator'
import { GoogleIcon } from '@/assets/icons/google'

const SignUp = () => {
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
        mt={4}
        direction="column"
        gap={1}
        justifyContent="center"
        alignItems="center"
        w="full"
      >
        <Text fontSize={18}>Create your account</Text>
        <Text color="gray.500" fontSize={14} textAlign="center">
          Start building better habits today!
        </Text>
      </Flex>
      <Flex direction="column" gap={1} w="full">
        <Flex gap={1} alignItems="center">
          <Flex direction="column" gap={1 / 2} flex={1}>
            <Text color="gray.700" fontSize={14}>
              First name
            </Text>
            <Input type="text" placeholder="Enter your name" size="md" />
          </Flex>
          <Flex direction="column" gap={1 / 2} flex={1}>
            <Text color="gray.700" fontSize={14}>
              Last name
            </Text>
            <Input type="text" placeholder="Enter your last name" size="md" />
          </Flex>
        </Flex>
        <Flex direction="column" gap={1 / 2}>
          <Text color="gray.700" fontSize={14}>
            Email address
          </Text>
          <Input type="email" placeholder="Enter your email" size="md" />
        </Flex>
        <PasswordWithValidator />
        <Flex direction="column" gap={1 / 2}>
          <Text color="gray.700" fontSize={14}>
            Confirm password
          </Text>
          <Input type="password" placeholder="Confirm password" size="md" />
        </Flex>
        <Flex direction="column" gap={1 / 2}>
          <Link
            href="/forgot-password"
            textDecoration="none"
            _focus={{ boxShadow: 'none' }}
            flexShrink={0}
            fontSize={12}
            color="gray.500"
            display="flex"
            alignSelf="end"
          >
            Forgot your password?
          </Link>
        </Flex>
        <Button variant="primary" size="sm" mt={4}>
          Sign up
        </Button>
        <Flex mt={4}>
          <TextWithDivider text="Or continue with" />
        </Flex>
        <Flex gap={4} alignItems="center" my={2}>
          <IconButton variant="outline" p={2} flex={1}>
            <GoogleIcon />
            <Text color="gray.700" fontSize={12}>
              Google
            </Text>
          </IconButton>
        </Flex>
        <Flex alignSelf="center" alignItems="center" gap={1}>
          <Text fontSize={14} color="gray.600">
            Already have an account?
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
            Log in
          </Link>
        </Flex>
      </Flex>
    </Flex>
  )
}

export { SignUp }
