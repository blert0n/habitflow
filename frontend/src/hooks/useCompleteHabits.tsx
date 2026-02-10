import {
  useIsFetching,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { client } from '@/util/client'
import { useAuth } from '@/hooks/useAuth'

interface HookOutput {
  isChecking: boolean
  checkingId: number
  onCheck: (id: number, check: boolean, date: dayjs.Dayjs) => void
  onCheckingIdChange: (id: number, date: dayjs.Dayjs) => void
}

export const useCompleteHabits = (refetchLogs?: () => void): HookOutput => {
  const queryClient = useQueryClient()
  const { updateHabitCompletion } = useAuth()
  const [checkingId, setCheckingId] = useState(0)
  const [pendingReset, setPendingReset] = useState(false)
  const isRefetching = useIsFetching({ queryKey: ['habits'] }) > 0

  const markAsComplete = useMutation({
    mutationFn: (vars: { id: number; date: string }) =>
      client('/logs/check', {
        method: 'POST',
        body: JSON.stringify(vars),
      }),
    onSettled: () => setPendingReset(true),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
      queryClient.invalidateQueries({ queryKey: ['habitsMatrix'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      queryClient.invalidateQueries({ queryKey: ['habitStreak'] })
      updateHabitCompletion(variables.id, true)
      refetchLogs?.()
    },
  })

  const markAsIncomplete = useMutation({
    mutationFn: (vars: { id: number; date: string }) =>
      client('/logs/uncheck', {
        method: 'POST',
        body: JSON.stringify(vars),
      }),
    onSettled: () => setPendingReset(true),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
      queryClient.invalidateQueries({ queryKey: ['habitsMatrix'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      queryClient.invalidateQueries({ queryKey: ['habitStreak'] })
      updateHabitCompletion(variables.id, false)
      refetchLogs?.()
    },
  })

  useEffect(() => {
    if (!isRefetching && pendingReset) {
      setCheckingId(0)
      setPendingReset(false)
    }
  }, [isRefetching, pendingReset])

  const onCheck = (id: number, check: boolean, date: dayjs.Dayjs) => {
    if (date.isAfter(dayjs())) return
    const payload = {
      id,
      date: dayjs(date).format('YYYY-MM-DD'),
      time: dayjs().format('HH:mm:ss'),
    }

    setCheckingId(id)

    !check ? markAsComplete.mutate(payload) : markAsIncomplete.mutate(payload)
  }

  const onCheckingIdChange = (id: number, date: dayjs.Dayjs) => {
    if (date.isAfter(dayjs())) return

    setCheckingId(id)
  }

  const isChecking =
    (markAsComplete.isPending || markAsIncomplete.isPending || isRefetching) &&
    checkingId !== 0

  return {
    isChecking,
    checkingId,
    onCheck,
    onCheckingIdChange,
  }
}
