import { createContext, useContext, useEffect, useState } from 'react'
import { client } from '@/util/client'
import { toaster } from '@/components/ui/toaster'

interface User {
  id: number
  email?: string
  firstName?: string
  lastName?: string
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
  isLoading: boolean
  isSigningUp: boolean
  isSigningIn: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSigningUp, setIsSigningUp] = useState(false)
  const [isSigningIn, setIsSigningIn] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true)
      try {
        const response = await client('/auth/me')
        const u = response.data
        setUser({
          id: u.userId,
          email: u.email,
          firstName: u.firstName,
          lastName: u.lastName,
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

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signUp,
        signOut,
        isLoading,
        isSigningUp,
        isSigningIn,
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
