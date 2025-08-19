import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import dayjs from 'dayjs'
import { client } from '@/util/client'

interface HookOutput {
  isChecking: boolean
  checkingId: number
  onCheck: (id: number, check: boolean, date: dayjs.Dayjs) => void
  onCheckingIdChange: (id: number, date: dayjs.Dayjs) => void
}

export const useCompleteHabits = (): HookOutput => {
  const queryClient = useQueryClient()
  const [checkingId, setCheckingId] = useState(0)

  const markAsComplete = useMutation({
    mutationFn: (habitId: number) =>
      client('/logs/check', {
        method: 'POST',
        body: JSON.stringify({ id: habitId }),
      }),
    onSettled: () => {
      setCheckingId(0)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
    },
  })
  const markAsIncomplete = useMutation({
    mutationFn: (habitId: number) =>
      client('/logs/uncheck', {
        method: 'POST',
        body: JSON.stringify({ id: habitId }),
      }),
    onSettled: () => {
      setCheckingId(0)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
    },
  })

  const onCheck = (id: number, check: boolean, date: dayjs.Dayjs) => {
    if (date.isAfter(dayjs())) return

    !check ? markAsComplete.mutate(id) : markAsIncomplete.mutate(id)
  }

  const onCheckingIdChange = (id: number, date: dayjs.Dayjs) => {
    if (date.isAfter(dayjs())) return

    setCheckingId(id)
  }

  const isChecking = markAsComplete.isPending || markAsIncomplete.isPending

  return {
    isChecking,
    checkingId,
    onCheck,
    onCheckingIdChange,
  }
}
