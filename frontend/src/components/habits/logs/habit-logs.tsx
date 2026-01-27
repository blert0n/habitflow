import { Box, Flex, IconButton, Separator, Stack, Text } from '@chakra-ui/react'
import { useNavigate, useParams } from '@tanstack/react-router'
import {
  Calendar,
  ChartSpline,
  CheckCheck,
  ChevronLeft,
  CircleQuestionMark,
  Flame,
  X,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useCallback, useEffect, useState } from 'react'
import { StatCard } from './stat-card'
import type { Dayjs } from 'dayjs'
import type { HabitLog, HabitStreak, OneHabit } from '@/types/habits'
import type { PaginatedNotesResponse } from '@/types/notes'
import { HeaderWithText } from '@/components/ui/header-with-text'
import { client } from '@/util/client'
import { AppSpinner } from '@/components/layout/app-spinner'
import { AppNotFound } from '@/components/ui/not-found'
import { useCategories } from '@/hooks/useCategories'
import { CalendarHabitLogs } from '@/components/calendar/calendar-habit-logs'
import { Pagination } from '@/components/ui/pagination'
import { NORMALIZED_FORMAT, formatFriendlyDate } from '@/util/dates'
import { previewNoteContent } from '@/util/notes'
import { AppEmptyState } from '@/components/ui/empty-state'
import { Note } from '@/components/notes/note'

const STATS = [
  {
    title: 'Streak',
    valueKey: 'streak',
    description: (val: number) => (val > 0 ? 'Keep it up' : 'No streak yet'),
    icon: <Flame strokeWidth={1.5} stroke="gray" />,
    format: (val: number) => `${val} days`,
  },
  {
    title: 'Completion rate',
    valueKey: 'completion_avg_rate',
    description: () => 'All time',
    icon: <ChartSpline strokeWidth={1.5} stroke="gray" />,
    format: (val: number) => `${(val * 100).toFixed(0)}%`,
  },
  {
    title: 'Total days',
    valueKey: 'total_day_since_start',
    description: () => 'Since start',
    icon: <Calendar strokeWidth={1.5} stroke="gray" />,
    format: (val: number) => val.toString(),
  },
]

interface RecentActivity {
  completed: boolean
  friendlyDate: string
  date: string
  isToday: boolean
}

const HabitLogs = () => {
  const { habitId } = useParams({ from: '/app-layout/habits/logs/$habitId' })
  const navigate = useNavigate()
  const { getCategory } = useCategories()
  const [notesPage, setNotesPage] = useState(1)
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs())

  const handleCurrentDateChange = useCallback((date: Dayjs) => {
    setCurrentDate(date)
  }, [])

  const today = dayjs()

  const {
    data: habit,
    isLoading: isLoadingHabit,
    error,
  } = useQuery<OneHabit>({
    queryKey: ['oneHabit', habitId],
    queryFn: () => client(`/habits/one?id=${habitId}`),
    retry: false,
  })

  const { data: habitStreak } = useQuery<HabitStreak>({
    queryKey: ['habitStreak', habitId],
    queryFn: () =>
      client(
        `/habits/one/streak?id=${habitId}&date=${today.format(NORMALIZED_FORMAT)}`,
      ),
    retry: false,
  })

  const { data: notes, isLoading: isLoadingNotes } =
    useQuery<PaginatedNotesResponse>({
      queryKey: ['listNotes', notesPage, habitId],
      queryFn: () =>
        client(`/notes/list?page=${notesPage}&habit_id=${habitId}`),
    })

  const calendarDate = currentDate.format(NORMALIZED_FORMAT)

  const {
    data: completionLogs,
    isLoading: isLoadingLogs,
    refetch: refetchLogs,
  } = useQuery<Record<string, HabitLog>>({
    queryKey: [`logs-${habitId}`, habitId, calendarDate],
    queryFn: () =>
      client(
        `/habits/one/monthly-logs?habitId=${habitId}&date=${calendarDate}`,
      ),
    enabled: !!Number.parseInt(habitId),
  })

  const [recentActivity, setRecentActivity] = useState<Array<RecentActivity>>(
    [],
  )

  useEffect(() => {
    if (completionLogs && recentActivity.length === 0) {
      const initialActivity = Object.keys(completionLogs)
        .filter((date) => dayjs(date).isSameOrBefore(today))
        .sort((a, b) => dayjs(b).diff(dayjs(a)))
        .slice(0, 5)

      if (!initialActivity.length) return

      setRecentActivity(
        initialActivity.map((date) => {
          const completed = completionLogs[date].completed
          const time = completionLogs[date].time
          const isToday = date === today.format('YYYY-MM-DD')
          const formattedDate = dayjs(`${date} ${time}`, 'YYYY-MM-DD HH:mm:ss')
          const friendlyDate = formatFriendlyDate(formattedDate)

          return {
            completed,
            friendlyDate,
            isToday,
            date,
          }
        }),
      )
    }
  }, [completionLogs, recentActivity.length])

  if (isLoadingHabit) return <AppSpinner />
  if (!habit && error)
    return (
      <AppNotFound
        onAction={() => {
          navigate({ to: '/habits' })
        }}
        title="Not found"
      />
    )

  const habitCategory = getCategory(habit?.categoryid ?? 0)

  return (
    <Flex direction="column" gap={2} paddingBottom="60px">
      <Flex gap={4} justifyContent="start">
        <IconButton
          size="xs"
          variant="outline"
          w="fit-content"
          p={2}
          onClick={() => {
            navigate({ to: '/habits' })
          }}
        >
          <ChevronLeft strokeWidth={1.5} />
        </IconButton>
        <Flex justify="space-between" alignItems="center" width="full">
          <Flex gap={2}>
            <IconButton
              borderRadius="lg"
              bg="linear-gradient(to left, #60A5FA, #3B82F6)"
            >
              {habitCategory?.icon}
            </IconButton>
            <Flex justify="space-between" height="full" wordBreak="break-all">
              <HeaderWithText
                title={habit?.name || 'Habit name'}
                text={habit?.description}
                titleFontSize="sm"
                textFontSize="12px"
              />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Flex
        direction={{ base: 'column', sm: 'row' }}
        gap={{ base: 4, sm: 2, md: 4 }}
        flex={1}
        justifyContent="space-between"
        mb={4}
      >
        {STATS.map((stat) => {
          const rawValue =
            habitStreak?.[stat.valueKey as keyof HabitStreak] ?? 0
          return (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.format(rawValue)}
              description={stat.description(rawValue)}
              icon={stat.icon}
            />
          )
        })}
      </Flex>
      <Flex gap={4} height="100%" direction={{ base: 'column', md: 'row' }}>
        <Flex
          flex={1}
          gap={2}
          minWidth={0}
          width="full"
          direction="column"
          mb={{ base: 4, md: 0 }}
          bg="white"
          borderRadius="lg"
          borderWidth="1px"
          borderColor="gray.200"
          p={3}
        >
          <HeaderWithText title="Logs" />
          <Separator height={1} />
          {isLoadingLogs && <AppSpinner />}
          {!recentActivity.length && !isLoadingLogs && (
            <AppEmptyState
              title="Nothing here yet!"
              description="Start by logging completions of your habit daily"
              circleSize={12}
              iconSize={24}
            />
          )}
          {recentActivity.length > 0 &&
            !isLoadingLogs &&
            recentActivity.map((activity) => {
              return (
                <Flex
                  key={activity.friendlyDate}
                  justifyContent="space-between"
                >
                  <Flex gap={2} align="center">
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      h={8}
                      w={8}
                      backgroundColor={
                        activity.completed ? 'brand.primary' : '#71717a'
                      }
                      rounded="full"
                    >
                      {activity.completed && (
                        <CheckCheck strokeWidth={1.5} color="white" size={16} />
                      )}
                      {!activity.completed && activity.isToday && (
                        <CircleQuestionMark
                          strokeWidth={1.5}
                          color="white"
                          size={20}
                        />
                      )}
                      {!activity.completed && !activity.isToday && (
                        <X strokeWidth={1.5} color="white" size={16} />
                      )}
                    </Box>
                    <Flex direction="column" justify="center">
                      <Text
                        color="gray.500"
                        fontWeight="semibold"
                        fontSize={14}
                      >
                        {activity.completed && <>Completed</>}
                        {!activity.completed && activity.isToday && <>Yet</>}
                        {!activity.completed && !activity.isToday && (
                          <>Missed</>
                        )}
                      </Text>
                      <Text color="gray.500" fontSize={10}>
                        {activity.completed
                          ? activity.friendlyDate
                          : activity.date}
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
              )
            })}
        </Flex>
        <Box
          flex={1}
          bg="white"
          borderRadius="lg"
          borderWidth="1px"
          borderColor="gray.200"
          p={3}
          display="flex"
          flexDirection="column"
          height="100%"
        >
          <CalendarHabitLogs
            onDateChange={handleCurrentDateChange}
            completionLogs={completionLogs}
            refetchLogs={() => {
              refetchLogs()
            }}
          />
          <Separator mb={2} />
          <Stack
            direction="row"
            w="full"
            justify="center"
            gap={4}
            textAlign="center"
          >
            <Box
              fontSize={12}
              backgroundColor="brand.primary"
              color="white"
              px={4}
              py={1}
              borderRadius="4xl"
            >
              Completed
            </Box>
            <Box
              fontSize={12}
              backgroundColor="gray.200"
              color="gray.700"
              px={4}
              py={1}
              borderRadius="2xl"
            >
              Missed
            </Box>
            <Box
              fontSize={12}
              backgroundColor="#BBDEFB"
              border="1px solid #e4e4e7"
              color="gray.700"
              px={4}
              py={1}
              borderRadius="2xl"
            >
              Scheduled
            </Box>
            <Box
              fontSize={12}
              backgroundColor="white"
              border="1px solid #e4e4e7"
              color="gray.700"
              px={4}
              py={1}
              borderRadius="2xl"
            >
              Not scheduled
            </Box>
          </Stack>
        </Box>
      </Flex>
      <Flex
        direction="column"
        flex={1}
        padding={{ base: 4, md: 2 }}
        gap={2}
        bg="white"
        borderRadius="lg"
        borderWidth="1px"
        borderColor="gray.200"
      >
        <Text color="gray.800" fontSize={16}>
          Quick Notes
        </Text>
        <Separator />
        <Flex direction="column" gap={2} pb="60px" position="relative">
          <Flex direction="column" gap={2}>
            {isLoadingNotes && <AppSpinner />}
            {!isLoadingNotes && !notes?.data.length && (
              <AppEmptyState
                iconSize={24}
                circleSize={12}
                description="You can add notes by going to the notes page"
              />
            )}
            {!isLoadingNotes &&
              notes?.data.map((note) => {
                const previewNote = previewNoteContent(note.content,200)
                return (
                  <Note
                    key={note.id}
                    title={note.title}
                    note={previewNote}
                    habit={note.habit_name}
                    date={formatFriendlyDate(dayjs(note.created_at))}
                  />
                )
              })}
          </Flex>

          <Box position="absolute" bottom={0} pb={1}>
            <Pagination
              page={notesPage}
              totalCount={notes?.totalCount ?? 0}
              hideNumbers
              onPageChange={(updatedNotesPage) =>
                setNotesPage(updatedNotesPage)
              }
              pageSize={5}
            />
          </Box>
        </Flex>
      </Flex>
    </Flex>
  )
}

export { HabitLogs }
