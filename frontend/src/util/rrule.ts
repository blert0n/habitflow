import { RRule, RRuleSet, rrulestr } from 'rrule'
import dayjs from 'dayjs'
import { weekdayMap } from './dates'
import type { Dayjs } from 'dayjs'
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
  exdates?: Array<Dayjs>
}

export const buildRRule = ({
  frequency = 'daily',
  days = [],
  startDate,
  time,
  exdates = [],
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

  let rule: RRule
  if (frequency === 'daily') {
    rule = new RRule({ freq: RRule.DAILY, dtstart })
  } else {
    rule = new RRule({
      freq: RRule.WEEKLY,
      byweekday: days.map((d) => weekdayMap[d].rule),
      dtstart,
    })
  }

  const ruleSet = new RRuleSet()

  ruleSet.rrule(rule)

  exdates.forEach((exdate) => {
    ruleSet.exdate(exdate.toDate())
  })

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
