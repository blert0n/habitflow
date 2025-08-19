'use client'

import {
  ButtonGroup,
  Pagination as ChakraPagination,
  IconButton,
  Stack,
} from '@chakra-ui/react'
import { useState } from 'react'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'

interface PaginationProps {
  totalCount: number
  pageSize?: number
  page?: number
  onPageChange?: (page: number) => void
  hideNumbers?: boolean
}

export const Pagination = ({
  totalCount,
  pageSize = 5,
  page: controlledPage,
  onPageChange,
  hideNumbers = false,
}: PaginationProps) => {
  const [page, setPage] = useState(1)
  const currentPage = controlledPage ?? page

  const handlePageChange = (newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage)
    } else {
      setPage(newPage)
    }
  }

  return (
    <Stack gap="4">
      <ChakraPagination.Root
        count={totalCount}
        pageSize={pageSize}
        page={currentPage}
        onPageChange={(e) => handlePageChange(e.page)}
      >
        <ButtonGroup variant="ghost" size="xs">
          <ChakraPagination.PrevTrigger asChild>
            <IconButton aria-label="Previous page" size="sm">
              <HiChevronLeft />
            </IconButton>
          </ChakraPagination.PrevTrigger>
          {!hideNumbers && (
            <ChakraPagination.Items
              render={(pageItem) => (
                <IconButton
                  key={pageItem.value}
                  variant={{ base: 'ghost', _selected: 'outline' }}
                >
                  {pageItem.value}
                </IconButton>
              )}
            />
          )}

          <ChakraPagination.NextTrigger asChild>
            <IconButton aria-label="Next page" disabled={totalCount === 0}>
              <HiChevronRight />
            </IconButton>
          </ChakraPagination.NextTrigger>
        </ButtonGroup>
      </ChakraPagination.Root>
    </Stack>
  )
}
