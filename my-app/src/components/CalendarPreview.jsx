import { useEffect, useMemo, useState } from 'react';

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

const parseToDate = (value) => {
  if (!value) {
    return null;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed;
};

const isSameDay = (a, b) => {
  if (!a || !b) {
    return false;
  }
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
};

const isWithinRange = (date, start, end) => {
  if (!start && !end) {
    return false;
  }
  const time = date.getTime();
  if (start && end) {
    return time >= start.getTime() && time <= end.getTime();
  }
  if (start) {
    return isSameDay(date, start);
  }
  if (end) {
    return isSameDay(date, end);
  }
  return false;
};

const createMonthMatrix = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const calendarStart = new Date(firstDay);
  calendarStart.setDate(firstDay.getDate() - firstDay.getDay());

  const weeks = [];
  const current = new Date(calendarStart);

  while (current <= lastDay || current.getDay() !== 0) {
    const week = [];
    for (let i = 0; i < 7; i += 1) {
      week.push({
        date: new Date(current),
        isCurrentMonth: current.getMonth() === month,
      });
      current.setDate(current.getDate() + 1);
    }
    weeks.push(week);
    if (weeks.length === 6) {
      break;
    }
  }

  return weeks;
};

const CalendarPreview = ({ from, to }) => {
  const fromDate = useMemo(() => parseToDate(from), [from]);
  const toDate = useMemo(() => parseToDate(to), [to]);

  const initialDate = useMemo(() => {
    if (fromDate) {
      return fromDate;
    }
    if (toDate) {
      return toDate;
    }
    return new Date();
  }, [fromDate, toDate]);

  const [currentDate, setCurrentDate] = useState(initialDate);

  useEffect(() => {
    setCurrentDate(initialDate);
  }, [initialDate]);

  const weeks = useMemo(
    () => createMonthMatrix(currentDate),
    [currentDate]
  );

  const monthLabel = useMemo(
    () =>
      currentDate.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
      }),
    [currentDate]
  );

  const handlePrevMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  return (
    <div className="flex flex-col gap-3 rounded-3xl border-2 border-slate-300 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-300 text-sm font-semibold text-slate-600 transition hover:border-slate-900 hover:text-slate-900"
          aria-label="이전 달"
        >
          ‹
        </button>
        <p className="text-sm font-semibold text-slate-900">{monthLabel}</p>
        <button
          type="button"
          onClick={handleNextMonth}
          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-300 text-sm font-semibold text-slate-600 transition hover:border-slate-900 hover:text-slate-900"
          aria-label="다음 달"
        >
          ›
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-500">
        {DAY_LABELS.map((label) => (
          <span key={label} className="py-1">
            {label}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-sm">
        {weeks.flat().map(({ date, isCurrentMonth }) => {
          const inRange = isWithinRange(date, fromDate, toDate);
          const isEdge =
            isSameDay(date, fromDate) || isSameDay(date, toDate);

          return (
            <span
              key={date.toISOString()}
              className={[
                'flex h-10 items-center justify-center rounded-xl border-2',
                isCurrentMonth ? 'border-slate-300 text-slate-700' : 'border-slate-200 text-slate-300',
                inRange ? 'bg-slate-900 text-white border-slate-900' : '',
                isEdge ? 'ring-2 ring-offset-2 ring-slate-400' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {date.getDate()}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarPreview;
