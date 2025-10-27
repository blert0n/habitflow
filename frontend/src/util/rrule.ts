import { RRule, RRuleSet, rrulestr } from 'rrule'
import dayjs from 'dayjs'
import { weekdayMap } from './dates'
import type { Options, Weekday } from 'rrule'
import type { WeekdayIndex } from './dates'

interface BuildRRuleInput {
  frequency: 'daily' | 'weekly'
  days: Array<WeekdayIndex>
  startDate?: dayjs.Dayjs
  time?: dayjs.Dayjs
}

interface BuildRRuleInput {
  frequency: 'daily' | 'weekly'
  days: Array<WeekdayIndex>
  startDate?: dayjs.Dayjs
  time?: dayjs.Dayjs
  endsOn?: 'Never' | 'On' | 'After'
  until?: dayjs.Dayjs | null
  count?: number | null
}

const normalizeRRuleWeekday = (rruleWeekday: number): number => {
  // rrule: 0 = Monday … 6 = Sunday
  // app:   0 = Sunday … 6 = Saturday
  return (rruleWeekday + 1) % 7
}

export const buildRRule = ({
  frequency = 'daily',
  days = [],
  startDate,
  time,
  endsOn = 'Never',
  until,
  count,
}: BuildRRuleInput) => {
  const defaultDate = dayjs()
  const defaultTime = dayjs().hour(9).minute(0).second(0).millisecond(0)

  const actualStartDate = startDate ?? defaultDate
  const actualTime = time ?? defaultTime

  const dtstart = actualStartDate
    .hour(actualTime.hour())
    .minute(actualTime.minute())
    .second(0)
    .millisecond(0)
    .toDate()

  const ruleOptions: Partial<Options> = { dtstart }

  if (frequency === 'daily') {
    ruleOptions.freq = RRule.DAILY
  } else {
    ruleOptions.freq = RRule.WEEKLY
    ruleOptions.byweekday = days
      .map((d) => weekdayMap.find((weekDay) => weekDay.index === d)!.rule)
      .filter(Boolean)
  }

  if (endsOn === 'On' && until) {
    const untilDayjs = dayjs(until)
    ruleOptions.until = untilDayjs.endOf('day').toDate()
  } else if (endsOn === 'After' && count) {
    ruleOptions.count = count
  }

  const rule = new RRule(ruleOptions)
  const ruleSet = new RRuleSet()
  ruleSet.rrule(rule)

  return ruleSet.toString()
}

/**
 * Checks if the given rrule string has frequency DAILY with no exceptions.
 * @param rruleString - The full rrule string including DTSTART and RRULE lines.
 * @returns true if freq is DAILY and no exdates or exrules; false otherwise.
 */
export function isDailyNoExceptions(rruleString: string): boolean {
  try {
    const rule = rrulestr(rruleString)

    if (rule.options.freq !== RRule.DAILY) {
      return false
    }

    // Handle RRuleSet case (which can have exdates/exrules)
    if (rule instanceof RRuleSet) {
      return rule.exdates().length === 0 && rule.exrules().length === 0
    }

    const hasExDates = rruleString.includes('EXDATE=')

    return !hasExDates
  } catch (error) {
    // Invalid rrule string
    console.error('Failed to parse RRule string:', error)
    return false
  }
}

/**
 * Extracts the days of the week from an RRule string.
 * @param rruleString - The full rrule string including DTSTART and RRULE lines.
 * @returns Array of weekdays as strings, e.g. ['MO', 'WE', 'FR']. Returns empty array if none.
 */
export function getWeekdaysFromRRule(rruleString: string): Array<WeekdayIndex> {
  try {
    const rule = rrulestr(rruleString)

    const weekdaysSet = new Set<number>()

    if (rule instanceof RRuleSet) {
      rule.rrules().forEach((r) => {
        r.options.byweekday.forEach((wd: Weekday | number) => {
          const day = typeof wd === 'number' ? wd : wd.weekday
          weekdaysSet.add(normalizeRRuleWeekday(day))
        })
      })
    } else {
      rule.options.byweekday.forEach((wd: Weekday | number) => {
        const day = typeof wd === 'number' ? wd : wd.weekday
        weekdaysSet.add(normalizeRRuleWeekday(day))
      })
    }

    return Array.from(weekdaysSet) as Array<WeekdayIndex>
  } catch (error) {
    return []
  }
}

/**
 * Extracts the start date from an RRule string as a dayjs object.
 * @param rruleString - The full RRule string including DTSTART and RRULE lines.
 * @returns dayjs object of the start date, or null if parsing fails.
 */
export const getStartDayjsFromRRule = (
  rruleString: string,
): dayjs.Dayjs | null => {
  try {
    const rule = rrulestr(rruleString)

    let dtstart: Date | undefined

    if (rule instanceof RRuleSet) {
      const rrules = rule.rrules()
      if (rrules.length > 0) {
        dtstart = rrules[0].options.dtstart
      }
    } else if (rule instanceof RRule) {
      dtstart = rule.options.dtstart
    }

    return dtstart ? dayjs(dtstart) : null
  } catch (error) {
    console.error('Failed to parse RRule string:', error)
    return null
  }
}

/**
 * Determines the "ends on" type of an RRule string.
 * - "Never" if no UNTIL or COUNT is specified
 * - "On" if UNTIL is specified
 * - "After" if COUNT is specified
 */
export function getEndsOnFromRRule(rruleString: string): {
  endsOn: 'Never' | 'On' | 'After'
  until?: Date
  count?: number
} {
  try {
    const rule = rrulestr(rruleString)

    let until: Date | undefined | null
    let count: number | undefined | null

    if (rule instanceof RRuleSet) {
      const rrules = rule.rrules()
      if (rrules.length > 0) {
        until = rrules[0].options.until
        count = rrules[0].options.count
      }
    } else if (rule instanceof RRule) {
      until = rule.options.until
      count = rule.options.count
    }

    if (until) {
      return { endsOn: 'On', until }
    }

    if (count) {
      return { endsOn: 'After', count }
    }

    return { endsOn: 'Never' }
  } catch (error) {
    console.error('Failed to parse RRule string:', error)
    return { endsOn: 'Never' }
  }
}
