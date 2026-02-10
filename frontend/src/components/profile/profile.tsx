import { Flex } from '@chakra-ui/react/flex'
import {
  Button,
  Field,
  Grid,
  GridItem,
  Input,
  Tag,
  Text,
} from '@chakra-ui/react'
import {
  ChevronRight,
  KeyRound,
  Save,
  ShieldCheck,
  Trash2,
  UserRoundPen,
} from 'lucide-react'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { HeaderWithText } from '../ui/header-with-text'
import { AvatarUpload } from './avatar-upload'
import { useAuth } from '@/hooks/useAuth'
import { useBadgeStatuses } from '@/hooks/useBadgeStatuses'

export const Profile = () => {
  const {
    user,
    updateProfile,
    changePassword,
    deleteAccount,
    isUpdatingProfile,
    isChangingPassword,
    isDeletingAccount,
  } = useAuth()
  const { bestStreak, progress, totalCompletions } = useBadgeStatuses()
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)

  const [firstName, setFirstName] = useState(user?.firstName ?? '')
  const [lastName, setLastName] = useState(user?.lastName ?? '')
  const [email, setEmail] = useState(user?.email ?? '')

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName ?? '')
      setLastName(user.lastName ?? '')
      setEmail(user.email ?? '')
    }
  }, [user])

  const handleSaveProfile = async () => {
    await updateProfile({
      firstName,
      lastName,
      email,
    })
  }

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      return
    }
    const success = await changePassword(oldPassword, newPassword)
    if (success) {
      setOldPassword('')
      setNewPassword('')
      setShowPasswordForm(false)
    }
  }

  const handleDeleteAccount = async () => {
    await deleteAccount()
  }

  return (
    <Flex direction="column" gap={4}>
      <Flex justify="space-between" align="center">
        <HeaderWithText
          title="Profile Settings"
          text="Manage your account and preferences"
        />
        <Button
          size="xs"
          borderRadius="2xl"
          variant="primary"
          onClick={handleSaveProfile}
          loading={isUpdatingProfile}
        >
          <Save strokeWidth={1.5} />
          Save Changes
        </Button>
      </Flex>
      <Grid
        templateColumns={{
          base: '1fr',
          sm: 'repeat(5, 1fr)',
          md: 'repeat(6, 1fr)',
        }}
        gap="6"
      >
        <GridItem colSpan={{ base: 1, sm: 2 }}>
          <Flex
            direction="column"
            gap={4}
            width="full"
            boxShadow="lg"
            borderRadius="2xl"
            p={4}
            bgColor="white"
          >
            <Flex
              direction="column"
              justifyContent="center"
              w="full"
              alignItems="center"
              gap={2}
            >
              <AvatarUpload />
              <Text fontSize="lg" fontWeight="600" color="gray.800">
                {user?.firstName && user.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : (user?.email ?? 'User')}
              </Text>
              {dayjs(user?.createdAt).isValid() && (
                <Text fontSize="sm" fontWeight="400" color="gray.500">
                  Member since {dayjs(user?.createdAt ?? '').format('MMM YYYY')}
                </Text>
              )}
              <Tag.Root size="sm" colorPalette="blue">
                <Tag.Label>{progress.earned} Badges</Tag.Label>
              </Tag.Root>
            </Flex>
            <Flex
              direction="column"
              gap={2}
              p={{ base: 2, md: 4 }}
              borderTop="1px"
              borderColor="gray.100"
            >
              <Text fontSize="sm" fontWeight="600" color="gray.700" mb={2}>
                Quick Stats
              </Text>

              <Flex justify="space-between" align="center">
                <Text fontSize="sm" color="gray.600">
                  Total Habits
                </Text>
                <Text fontSize="sm" fontWeight="600" color="blue.600">
                  {user?.totalHabits}
                </Text>
              </Flex>

              <Flex justify="space-between" align="center">
                <Text fontSize="sm" color="gray.600">
                  Completed Today
                </Text>
                <Text fontSize="sm" fontWeight="600" color="green.600">
                  {
                    (user?.habits ?? []).filter((habit) => habit.isCompleted)
                      .length
                  }
                  /{user?.habits?.length ?? 0}
                </Text>
              </Flex>

              <Flex justify="space-between" align="center">
                <Text fontSize="sm" color="gray.600">
                  Best Streak
                </Text>
                <Text fontSize="sm" fontWeight="600" color="orange.600">
                  {bestStreak} days
                </Text>
              </Flex>

              <Flex justify="space-between" align="center">
                <Text fontSize="sm" color="gray.600">
                  Total Completions
                </Text>
                <Text fontSize="sm" fontWeight="600" color="teal.600">
                  {totalCompletions}
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </GridItem>
        <GridItem colSpan={{ base: 1, sm: 3, md: 4 }}>
          <Flex direction="column" gap={2}>
            <Flex
              direction="column"
              gap={4}
              width="full"
              boxShadow="lg"
              borderRadius="2xl"
              px={6}
              py={4}
              bgColor="white"
            >
              <Flex gap={2} mb={2}>
                <UserRoundPen strokeWidth={1.5} color="#0369a1" />
                <Text fontSize="sm" fontWeight="600" color="gray.700">
                  Personal Information
                </Text>
              </Flex>

              <Flex direction="column" gap={4}>
                <Grid
                  templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
                  gap={4}
                >
                  <Field.Root>
                    <Field.Label
                      fontSize="sm"
                      fontWeight="500"
                      color="gray.700"
                    >
                      First Name
                    </Field.Label>
                    <Input
                      placeholder="Enter first name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      size="sm"
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label
                      fontSize="sm"
                      fontWeight="500"
                      color="gray.700"
                    >
                      Last Name
                    </Field.Label>
                    <Input
                      placeholder="Enter last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      size="sm"
                    />
                  </Field.Root>
                </Grid>
                <Grid
                  templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
                  gap={4}
                >
                  <Field.Root>
                    <Field.Label
                      fontSize="sm"
                      fontWeight="500"
                      color="gray.700"
                    >
                      Email
                    </Field.Label>
                    <Input
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      size="sm"
                    />
                  </Field.Root>
                </Grid>
              </Flex>
            </Flex>
            <Flex
              direction="column"
              gap={4}
              width="full"
              boxShadow="lg"
              borderRadius="2xl"
              px={6}
              py={4}
              bgColor="white"
            >
              <Flex gap={2} align="center" mb={1}>
                <ShieldCheck strokeWidth={1.5} color="#0369a1" />
                <Text fontSize="sm" fontWeight="600" color="gray.700">
                  Security
                </Text>
              </Flex>

              <Flex
                p={3}
                borderWidth="1px"
                borderColor="gray.200"
                borderRadius="lg"
                direction="column"
                gap={3}
                transition="all 0.2s"
              >
                {!showPasswordForm ? (
                  <Flex
                    align="center"
                    justify="space-between"
                    cursor="pointer"
                    _hover={{ opacity: 0.8 }}
                    onClick={() => setShowPasswordForm(true)}
                  >
                    <Flex gap={3} align="center">
                      <KeyRound strokeWidth={1.5} size={20} color="#4b5563" />
                      <Flex direction="column" gap={0.5}>
                        <Text fontSize="sm" fontWeight="600" color="gray.800">
                          Change password
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          Update your account password.
                        </Text>
                      </Flex>
                    </Flex>
                    <ChevronRight strokeWidth={1.5} size={20} color="#9ca3af" />
                  </Flex>
                ) : (
                  <Flex direction="column" gap={3}>
                    <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                      <Field.Root>
                        <Field.Label
                          fontSize="xs"
                          fontWeight="500"
                          color="gray.700"
                        >
                          Old Password
                        </Field.Label>
                        <Input
                          type="password"
                          placeholder="Current password"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          size="sm"
                        />
                      </Field.Root>
                      <Field.Root>
                        <Field.Label
                          fontSize="xs"
                          fontWeight="500"
                          color="gray.700"
                        >
                          New Password
                        </Field.Label>
                        <Input
                          type="password"
                          placeholder="New password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          size="sm"
                        />
                      </Field.Root>
                    </Grid>
                    <Flex gap={2} justify="flex-end">
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => setShowPasswordForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="xs"
                        variant="primary"
                        onClick={handleChangePassword}
                        loading={isChangingPassword}
                        disabled={!oldPassword || !newPassword}
                      >
                        Update
                      </Button>
                    </Flex>
                  </Flex>
                )}
              </Flex>

              <Flex
                p={3}
                borderWidth="1px"
                borderColor="red.200"
                borderRadius="lg"
                direction="column"
                gap={3}
                transition="all 0.2s"
              >
                {!showDeleteConfirmation ? (
                  <Flex
                    align="center"
                    justify="space-between"
                    cursor="pointer"
                    _hover={{ opacity: 0.8 }}
                    onClick={() => setShowDeleteConfirmation(true)}
                  >
                    <Flex gap={3} align="center">
                      <Trash2 strokeWidth={1.5} size={20} color="#dc2626" />
                      <Flex direction="column" gap={0.5}>
                        <Text fontSize="sm" fontWeight="600" color="red.600">
                          Delete account
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          Permanently delete your account and data.
                        </Text>
                      </Flex>
                    </Flex>
                    <ChevronRight strokeWidth={1.5} size={20} color="#fca5a5" />
                  </Flex>
                ) : (
                  <Flex direction="column" gap={3}>
                    <Flex gap={3} align="center">
                      <Trash2 strokeWidth={1.5} size={20} color="#dc2626" />
                      <Flex direction="column" gap={0.5}>
                        <Text fontSize="sm" fontWeight="600" color="red.600">
                          Are you sure?
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          This action cannot be undone.
                        </Text>
                      </Flex>
                    </Flex>
                    <Flex gap={2}>
                      <Button
                        size="xs"
                        colorPalette="red"
                        flex={1}
                        onClick={handleDeleteAccount}
                        loading={isDeletingAccount}
                      >
                        Delete
                      </Button>
                      <Button
                        size="xs"
                        variant="outline"
                        flex={1}
                        onClick={() => setShowDeleteConfirmation(false)}
                      >
                        Cancel
                      </Button>
                    </Flex>
                  </Flex>
                )}
              </Flex>
            </Flex>
          </Flex>
        </GridItem>
      </Grid>
    </Flex>
  )
}
