import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  Link,
  Text,
  // IconButton,
} from '@chakra-ui/react'
// import { TextWithDivider } from '../ui/text-with-divider'
// import { GoogleIcon } from '@/assets/icons/google'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface LoginCredentials {
  email: string
  password: string
}

const Login = () => {
  const { signIn, isSigningIn } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  })

  const handleInputChange = (field: string, value: string) => {
    setCredentials((prev) => ({ ...prev, [field]: value }))
  }

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
        <Text fontSize={18}>Welcome back!</Text>
        <Text color="gray.500" fontSize={14} textAlign="center">
          Sign in to continue building your habits
        </Text>
      </Flex>
      <Flex direction="column" gap={1} w="full">
        <Flex direction="column" gap={1 / 2}>
          <Text color="gray.700" fontSize={14}>
            Email address
          </Text>
          <Input
            type="email"
            placeholder="Enter your email"
            size="md"
            onChange={(e) => {
              handleInputChange('email', e.target.value)
            }}
          />
        </Flex>
        <Flex direction="column" gap={1 / 2}>
          <Text color="gray.700" fontSize={14}>
            Password
          </Text>
          <InputGroup
            endElement={
              <Box
                cursor="pointer"
                onClick={() => {
                  setShowPassword((prev) => !prev)
                }}
              >
                {showPassword ? (
                  <EyeOff strokeWidth={1.5} color="gray" size={20} />
                ) : (
                  <Eye strokeWidth={1.5} color="gray" size={20} />
                )}
              </Box>
            }
          >
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              size="md"
              onChange={(e) => {
                handleInputChange('password', e.target.value)
              }}
            />
          </InputGroup>
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
        <Button
          loading={isSigningIn}
          disabled={
            isSigningIn ||
            credentials.email.trim() === '' ||
            credentials.password.trim() === ''
          }
          variant="primary"
          size="sm"
          mt={4}
          onClick={async () => {
            await signIn(credentials.email, credentials.password)
          }}
        >
          Sign in
        </Button>
        {/* <Flex mt={4}>
          <TextWithDivider text="Or continue with" />
        </Flex>
        <Flex gap={4} alignItems="center" my={2}>
          <IconButton
            variant="outline"
            p={2}
            flex={1}
            onClick={() => {
              const backendUrl = import.meta.env.VITE_API_URL
              const frontendUrl = encodeURIComponent(
                import.meta.env.VITE_FRONTEND_URL,
              )
              window.location.href = `${backendUrl}/auth/google/login?redirect_uri=${frontendUrl}`
            }}
          >
            <GoogleIcon />
            <Text color="gray.700" fontSize={12}>
              Google
            </Text>
          </IconButton>
        </Flex> */}
        <Flex alignSelf="center" alignItems="center" gap={1} mb={4}>
          <Text fontSize={14} color="gray.600">
            Don't have an account?
          </Text>
          <Link
            href="/sign-up"
            textDecoration="none"
            _focus={{ boxShadow: 'none' }}
            flexShrink={0}
            fontSize={14}
            color="gray.700"
            display="flex"
            alignSelf="end"
            fontWeight="semibold"
          >
            Sign up
          </Link>
        </Flex>
      </Flex>
    </Flex>
  )
}

export { Login }
