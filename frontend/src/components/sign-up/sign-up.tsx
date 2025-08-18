import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  InputGroup,
  Link,
  Text,
} from '@chakra-ui/react'
import { useForm, useWatch } from 'react-hook-form'
import { useNavigate } from '@tanstack/react-router'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { TextWithDivider } from '../ui/text-with-divider'
import { PasswordWithValidator } from './password-with-validator'
import type { RegisterData } from './types'
import { GoogleIcon } from '@/assets/icons/google'
import { useAuth } from '@/hooks/useAuth'

const SignUp = () => {
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { isSigningUp, signUp } = useAuth()
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterData>({
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
    },
  })

  const navigate = useNavigate()

  const password = useWatch({ control, name: 'password' })

  const onSubmit = async (data: RegisterData) => {
    const success = await signUp(
      data.firstName,
      data.lastName,
      data.email,
      data.password,
    )
    if (success) {
      navigate({ to: '/sign-in' })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
              <Input
                type="text"
                placeholder="Enter your name"
                size="md"
                id="firstName"
                aria-invalid={errors.firstName ? 'true' : 'false'}
                {...register('firstName', { required: true, maxLength: 30 })}
              />
            </Flex>
            <Flex direction="column" gap={1 / 2} flex={1}>
              <Text color="gray.700" fontSize={14}>
                Last name
              </Text>
              <Input
                type="text"
                placeholder="Enter your last name"
                size="md"
                id="lastName"
                aria-invalid={errors.lastName ? 'true' : 'false'}
                {...register('lastName', { required: true, maxLength: 30 })}
              />
            </Flex>
          </Flex>
          <Flex direction="column" gap={1 / 2}>
            <Text color="gray.700" fontSize={14}>
              Email address
            </Text>
            <Input
              type="email"
              placeholder="Enter your email"
              size="md"
              id="email"
              aria-invalid={errors.email ? 'true' : 'false'}
              {...register('email', { required: true, maxLength: 30 })}
            />
          </Flex>
          <PasswordWithValidator
            password={password}
            register={register}
            errors={errors}
          />
          <Flex direction="column" gap={1 / 2}>
            <Text color="gray.700" fontSize={14}>
              Confirm password
            </Text>
            <InputGroup
              endElement={
                <Box
                  cursor="pointer"
                  onClick={() => {
                    setShowConfirmPassword((prev) => !prev)
                  }}
                >
                  {showConfirmPassword ? (
                    <EyeOff strokeWidth={1.5} color="gray" size={20} />
                  ) : (
                    <Eye strokeWidth={1.5} color="gray" size={20} />
                  )}
                </Box>
              }
            >
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm password"
                size="md"
                id="confirmPassword"
                aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) =>
                    value === password || 'Passwords do not match',
                })}
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
            variant="primary"
            size="sm"
            mt={4}
            type="submit"
            loading={isSigningUp}
            disabled={isSigningUp || !isValid}
          >
            Sign up
          </Button>
          <Flex mt={4}>
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
    </form>
  )
}

export { SignUp }
