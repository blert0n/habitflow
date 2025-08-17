import {
  Box,
  Flex,
  Input,
  InputGroup,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import type { RegisterData } from './types'

const MotionBox = motion.create(Box)

const rules = [
  { label: 'At least 8 characters', test: (pw: string) => pw.length >= 8 },
  { label: 'One uppercase letter', test: (pw: string) => /[A-Z]/.test(pw) },
  { label: 'One number', test: (pw: string) => /\d/.test(pw) },
  {
    label: 'One special character',
    test: (pw: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pw),
  },
]

interface P {
  password: string
  register: UseFormRegister<RegisterData>
  errors: FieldErrors<RegisterData>
}

const PasswordWithValidator = ({ password, register, errors }: P) => {
  const [showPopover, setShowPopover] = useState(false)
  const [show, setShow] = useState(false)

  const popoverPosition = useBreakpointValue<'right' | 'top'>({
    base: 'top',
    md: 'right',
  })

  return (
    <Flex direction="column" gap={1 / 2} position="relative">
      <Text color="gray.700" fontSize={14}>
        Password
      </Text>
      <Box position="relative" width="100%">
        <InputGroup
          endElement={
            <Box
              cursor="pointer"
              onClick={() => {
                setShow((prev) => !prev)
              }}
            >
              {show ? (
                <EyeOff strokeWidth={1.5} color="gray" size={20} />
              ) : (
                <Eye strokeWidth={1.5} color="gray" size={20} />
              )}
            </Box>
          }
        >
          <Input
            type={show ? 'text' : 'password'}
            placeholder="Enter your password"
            size="md"
            width="100%"
            id="password"
            aria-invalid={errors.password ? 'true' : 'false'}
            {...register('password', {
              onChange: (e) => {
                const value = e.target.value
                setShowPopover(value.length > 0)
              },
              validate: rules.reduce(
                (acc: Record<string, (pw: string) => true | string>, rule) => {
                  acc[rule.label] = (pw: string) => rule.test(pw) || rule.label
                  return acc
                },
                {},
              ),
            })}
            onFocus={() => {
              setShowPopover(password.length > 0)
            }}
            onBlur={() => {
              setShowPopover(false)
            }}
          />
        </InputGroup>
        <AnimatePresence>
          {showPopover && (
            <MotionBox
              key="validator"
              position="absolute"
              top={popoverPosition === 'top' ? '100%' : 0}
              left={popoverPosition === 'right' ? '100%' : 0}
              mt={popoverPosition === 'top' ? 2 : 0}
              ml={popoverPosition === 'right' ? 2 : 0}
              w="full"
              maxW="300px"
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              p={3}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -5 }}
              zIndex={10}
            >
              <Text fontSize={13} color="gray.700" mb={1}>
                Password must contain:
              </Text>
              {rules.map((rule) => {
                const passed = rule.test(password)
                return (
                  <Text
                    key={rule.label}
                    fontSize={12}
                    color={passed ? 'green.500' : 'gray.500'}
                  >
                    • {rule.label}
                  </Text>
                )
              })}
            </MotionBox>
          )}
        </AnimatePresence>
      </Box>
    </Flex>
  )
}

export { PasswordWithValidator }
