package utils

import (
	"time"

	"github.com/jackc/pgx/v5/pgtype"
)

func TextToString(t pgtype.Text) string {
	if t.Valid {
		return t.String
	}
	return ""
}

func Int4ToInt32(i pgtype.Int4) int32 {
	if i.Valid {
		return i.Int32
	}
	return 0
}

func TimestamptzToString(ts pgtype.Timestamptz) string {
	if ts.Valid {
		return ts.Time.Format(time.RFC3339)
	}
	return ""
}
