import { createContext, useContext, useEffect, useState } from 'react'
import { client } from '@/util/client'
import { toaster } from '@/components/ui/toaster'

interface User {
  id: number
  email?: string
  firstName?: string
  lastName?: string
  createdAt?: string
  totalHabits?: number
  habits?: Array<{
    id: number
    name: string
    color: string
    description: string
    isCompleted: boolean
  }>
}

interface AuthContextType {
  user: User | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) => Promise<boolean>
  signOut: () => Promise<void>
  updateProfile: (data: {
    firstName: string
    lastName: string
    email: string
  }) => Promise<boolean>
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>
  deleteAccount: () => Promise<boolean>
  updateHabitCompletion: (habitId: number, isCompleted: boolean) => void
  isLoading: boolean
  isSigningUp: boolean
  isSigningIn: boolean
  isUpdatingProfile: boolean
  isChangingPassword: boolean
  isDeletingAccount: boolean
  handleUserSignIn: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSigningUp, setIsSigningUp] = useState(false)
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true)
      try {
        const response = await client('/auth/me')
        const u = response?.data
        if (!u?.userId) return
        setUser({
          id: u.userId,
          email: u.email,
          firstName: u.firstName,
          lastName: u.lastName,
          createdAt: u.createdAt,
          totalHabits: u.totalHabits,
          habits: u.habits,
        })
      } catch (err: any) {
        console.error('Failed to check auth status:', err)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const signIn = async (email: string, password: string) => {
    setIsSigningIn(true)
    try {
      await client('/auth/sign-in', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })

      const data = await client('/auth/me')
      if (data && data.data) {
        const u = data.data
        setUser({
          id: u.userId,
          email: u.email,
          firstName: u.firstName,
          lastName: u.lastName,
          createdAt: u.createdAt,
          totalHabits: u.totalHabits,
          habits: u.habits,
        })
      }

      toaster.create({
        type: 'success',
        title: 'Logged in successfully',
      })
    } catch (err: any) {
      console.error('SignIn error:', err)
      toaster.create({
        type: 'error',
        title: err.message || 'Login failed',
      })
      setUser(null)
    } finally {
      setIsSigningIn(false)
    }
  }

  const signUp = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) => {
    setIsSigningUp(true)
    try {
      await client('/auth/sign-up', {
        method: 'POST',
        body: JSON.stringify({ firstName, lastName, email, password }),
      })

      toaster.create({
        type: 'success',
        title: 'Signed up successfully',
      })
      return true
    } catch (err: any) {
      console.error('SignUp error:', err)
      toaster.create({
        type: 'error',
        title: err.message || 'Sign up failed',
      })
      return false
    } finally {
      setIsSigningUp(false)
    }
  }

  const signOut = async () => {
    try {
      await client('/auth/sign-out')
      setUser(null)
      toaster.create({
        type: 'info',
        title: 'Logged out',
        description: 'You have successfully logged out',
      })
    } catch (err: any) {
      console.error('SignOut error:', err)
      toaster.create({
        type: 'error',
        title: err.message || 'Failed to log out',
      })
    }
  }

  const handleUserSignIn = (signedUser: User) => {
    setUser(signedUser)
  }

  const updateProfile = async (data: {
    firstName: string
    lastName: string
    email: string
  }) => {
    setIsUpdatingProfile(true)
    try {
      await client('/profile/update', {
        method: 'POST',
        body: JSON.stringify(data),
      })

      // Refresh user data
      const response = await client('/auth/me')
      const u = response?.data
      if (u?.userId) {
        setUser({
          id: u.userId,
          email: u.email,
          firstName: u.firstName,
          lastName: u.lastName,
          createdAt: u.createdAt,
          totalHabits: u.totalHabits,
          habits: u.habits,
        })
      }

      toaster.create({
        type: 'success',
        title: 'Profile updated successfully',
      })
      return true
    } catch (err: any) {
      console.error('Update profile error:', err)
      toaster.create({
        type: 'error',
        title: err.message || 'Failed to update profile',
      })
      return false
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  const changePassword = async (oldPassword: string, newPassword: string) => {
    setIsChangingPassword(true)
    try {
      await client('/profile/change-password', {
        method: 'POST',
        body: JSON.stringify({ oldPassword, newPassword }),
      })

      toaster.create({
        type: 'success',
        title: 'Password changed successfully',
      })
      return true
    } catch (err: any) {
      console.error('Change password error:', err)
      toaster.create({
        type: 'error',
        title: err.message || 'Failed to change password',
      })
      return false
    } finally {
      setIsChangingPassword(false)
    }
  }

  const deleteAccount = async () => {
    setIsDeletingAccount(true)
    try {
      await client('/profile/delete-account', {
        method: 'POST',
      })

      setUser(null)
      toaster.create({
        type: 'success',
        title: 'Account deleted successfully',
      })
      return true
    } catch (err: any) {
      console.error('Delete account error:', err)
      toaster.create({
        type: 'error',
        title: err.message || 'Failed to delete account',
      })
      return false
    } finally {
      setIsDeletingAccount(false)
    }
  }

  const updateHabitCompletion = (habitId: number, isCompleted: boolean) => {
    setUser((prevUser) => {
      if (!prevUser?.habits) return prevUser
      return {
        ...prevUser,
        habits: prevUser.habits.map((habit) =>
          habit.id === habitId ? { ...habit, isCompleted } : habit,
        ),
      }
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isUpdatingProfile,
        isChangingPassword,
        isDeletingAccount,
        signIn,
        signUp,
        signOut,
        updateProfile,
        changePassword,
        deleteAccount,
        updateHabitCompletion,
        isLoading,
        isSigningUp,
        isSigningIn,
        handleUserSignIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
