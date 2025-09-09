import { Flex } from '@chakra-ui/react/flex'
import { Text } from '@chakra-ui/react/text'
import { Box, Separator } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import dayjs from 'dayjs'
import { HeaderWithText } from '../components/ui/header-with-text'
import { StatCards } from '../components/dashboard/stat-cards'
import { Habit } from '../components/habits/habit'
import { CalendarSm } from '../components/calendar/calendar-sm'
import type { HabitsByDate } from '@/types/habits'
import type { PaginatedNotesResponse } from '@/types/notes'
import { client } from '@/util/client'
import { HabitSkeletonSm } from '@/components/habits/loading-habit-sm'
import { AppEmptyState } from '@/components/ui/empty-state'
import { Pagination } from '@/components/ui/pagination'
import { useCompleteHabits } from '@/hooks/useCompleteHabits'
import { formatFriendlyDate } from '@/util/dates'
import { Note } from '@/components/notes/note'
import { previewNoteContent } from '@/util/notes'
import { AppSpinner } from '@/components/layout/app-spinner'

function App() {
  const [habitsDate, setHabitsDate] = useState(dayjs())
  const [page, setPage] = useState(1)
  const [notesPage, setNotesPage] = useState(1)

  const { data: habits, isLoading } = useQuery<HabitsByDate, Error>({
    queryKey: ['habits', habitsDate, page],
    queryFn: () =>
      client(
        `/habits/by-date?date=${habitsDate.format('YYYY-MM-DD')}&page=${page}`,
      ),
    staleTime: 1000 * 60 * 5,
  })

  const { data: notes, isLoading: isLoadingNotes } =
    useQuery<PaginatedNotesResponse>({
      queryKey: ['listNotes', notesPage],
      queryFn: () => client(`/notes/list?page=${notesPage}`),
    })

  const { checkingId, isChecking, onCheck, onCheckingIdChange } =
    useCompleteHabits()

  return (
    <div className="full-width" style={{ paddingBottom: '60px' }}>
      <Flex direction="column" gap={4} flex={1} width="full">
        <HeaderWithText
          title="Hello!"
          text="Let's build some great habits today!"
        />
        <StatCards />
        <Flex direction={{ base: 'column', md: 'row' }} gap={2}>
          <Flex
            direction="column"
            flex={1}
            padding={{ base: 4, md: 2 }}
            gap={2}
            bg="white"
            borderRadius="lg"
            borderWidth="1px"
            borderColor="gray.200"
            height={{ base: 'auto', md: '415px' }}
            overflowY={{ base: 'visible', md: 'auto' }}
            position="relative"
          >
            <Text color="gray.800" fontSize={16}>
              {habitsDate.format('DD MMMM')}
            </Text>
            <Separator />
            <Flex direction="column" gap={2}>
              {isLoading && <HabitSkeletonSm count={4} />}
              {!isLoading && (
                <Flex gap={1} direction="column" pb="20px">
                  {(habits?.data?.length ?? 0) > 0 &&
                    habits?.data?.map((habit) => (
                      <Habit
                        key={habit.id}
                        title={habit.name}
                        description={habit.description}
                        checked={habit.isCompleted}
                        onCheck={() => {
                          console.log(
                            habitsDate.format('HH:mm:ss'),
                            'format time',
                          )
                          onCheckingIdChange(habit.id, habitsDate)
                          onCheck(habit.id, habit.isCompleted, habitsDate)
                        }}
                        isChecking={isChecking && checkingId === habit.id}
                      />
                    ))}
                  <Box position="absolute" bottom="0" left="0" right="0" pt={2}>
                    <Pagination
                      totalCount={habits?.totalCount ?? 0}
                      page={page}
                      pageSize={5}
                      hideNumbers
                      onPageChange={(newPage) => {
                        setPage(newPage)
                      }}
                    />
                  </Box>
                </Flex>
              )}
              {!isLoading && !habits?.data?.length && (
                <AppEmptyState
                  circleSize={12}
                  iconSize={24}
                  title="Nothing planned yet 😴"
                  description="Good day for a fresh start! Create a habit and take a step toward your goals."
                />
              )}
            </Flex>
          </Flex>
          <Flex
            direction="column"
            justifyContent="space-between"
            flex={1}
            width="full"
            height={{ base: 'auto', md: '415px' }}
            overflowY={{ base: 'visible', md: 'auto' }}
          >
            <CalendarSm
              selectedDate={habitsDate}
              onDateChange={(date) => {
                setHabitsDate(date)
              }}
            />
          </Flex>
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
              {!isLoadingNotes &&
                notes?.data.map((note) => {
                  const previewNote = previewNoteContent(note.content)
                  return (
                    <Note
                      key={note.id}
                      title={note.title}
                      note={previewNote}
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
    </div>
  )
}

export default App
