package utils

import (
	"fmt"
	"strings"

	"github.com/teambition/rrule-go"
)

var dayMap = map[string]string{
	"SU": "Sunday",
	"MO": "Monday",
	"TU": "Tuesday",
	"WE": "Wednesday",
	"TH": "Thursday",
	"FR": "Friday",
	"SA": "Saturday",
}

func ParseRRule(rruleString string) (bool, []string) {
	fmt.Println(rruleString, "rruleString")
	if rruleString == "" {
		return false, []string{}
	}

	if !strings.Contains(rruleString, "\nRRULE") {
		rruleString = strings.Replace(rruleString, "RRULE", "\nRRULE", 1)
	}

	r, err := rrule.StrToRRule(rruleString)
	if err != nil {
		return false, []string{}
	}

	isDaily := r.OrigOptions.Freq == rrule.DAILY

	var days []string
	for _, wd := range r.OrigOptions.Byweekday {
		if longName, ok := dayMap[wd.String()]; ok {
			days = append(days, longName)
		}
	}

	return isDaily, days
}
