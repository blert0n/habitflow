import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { client } from '@/util/client'
import { AppSpinner } from '@/components/layout/app-spinner'
import { useAuth } from '@/hooks/useAuth'

export default function Demo() {
  const { signIn, handleUserSignIn } = useAuth()
  const { data, isFetching, isError } = useQuery({
    queryKey: ['demo-login'],
    queryFn: () => client('/auth/demo'),
    retry: false,
  })

  useEffect(() => {
    if (!data?.data) return
    const u = data.data
    handleUserSignIn(u)
  }, [data, signIn])

  if (isFetching) return <AppSpinner />
  if (isError) return <div>Error logging in demo user</div>

  return <div className="full-width" style={{ paddingBottom: '60px' }}></div>
}
