import { Box, Flex, Input, Text, useBreakpointValue } from '@chakra-ui/react'
import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

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

const isPasswordValid = (password: string) =>
  rules.every((rule) => rule.test(password))

const PasswordWithValidator = () => {
  const [password, setPassword] = useState('')
  const [showPopover, setShowPopover] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

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
        <Input
          type="password"
          placeholder="Enter your password"
          size="md"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            setShowPopover(e.target.value.length > 0)
          }}
          ref={inputRef}
          onFocus={() => {
            setShowPopover(password.length > 0)
          }}
          onBlur={() => {
            setShowPopover(false)
          }}
          width="100%"
        />

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
              {isPasswordValid(password) && (
                <Text fontSize={12} color="green.500" mt={2}>
                  Strong password
                </Text>
              )}
            </MotionBox>
          )}
        </AnimatePresence>
      </Box>
    </Flex>
  )
}

export { PasswordWithValidator }
