import { RRule, RRuleSet, rrulestr } from 'rrule'
import dayjs from 'dayjs'
import { weekdayMap } from './dates'
import type { Options } from 'rrule'
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
    ruleOptions.byweekday = days.map((d) => weekdayMap[d].rule)
  }

  if (endsOn === 'On' && until) {
    ruleOptions.until = until.endOf('day').toDate()
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
export function getWeekdaysFromRRule(rruleString: string): Array<string> {
  try {
    const rule = rrulestr(rruleString)

    let weekdays: Array<number> = []

    if (rule instanceof RRuleSet) {
      rule.rrules().forEach((r) => {
        weekdays.push(...r.options.byweekday)
      })
    } else {
      weekdays = rule.options.byweekday
    }

    return weekdays.map((wd) => wd.toString())
  } catch (error) {
    console.log(rruleString, 'rruleStringFailed')
    console.error('Failed to parse RRule string:', error)
    return []
  }
}
