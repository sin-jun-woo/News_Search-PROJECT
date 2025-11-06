import { useCallback } from 'react';

const DateRangeFilter = ({ from, to, onChange }) => {
  const handleFromChange = useCallback(
    (event) => {
      onChange({ from: event.target.value, to });
    },
    [onChange, to]
  );

  const handleToChange = useCallback(
    (event) => {
      onChange({ from, to: event.target.value });
    },
    [from, onChange]
  );

  const handleReset = useCallback(() => {
    onChange({ from: '', to: '' });
  }, [onChange]);

  return (
    <div className="flex flex-col gap-3 rounded-3xl border-2 border-slate-300 bg-white px-5 py-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold tracking-wide text-slate-500">
            시작일
          </span>
          <input
            type="date"
            value={from}
            onChange={handleFromChange}
            className="h-12 w-44 rounded-xl border-2 border-slate-300 px-3 text-sm text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-200"
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold tracking-wide text-slate-500">
            종료일
          </span>
          <input
            type="date"
            value={to}
            onChange={handleToChange}
            className="h-12 w-44 rounded-xl border-2 border-slate-300 px-3 text-sm text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-200"
          />
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="ml-auto rounded-full border-2 border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-900 hover:text-slate-900"
        >
          초기화
        </button>
      </div>
      <div className="flex items-center gap-3 text-xs text-slate-500">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border-2 border-slate-300">
          /
        </span>
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border-2 border-slate-300">
          /
        </span>
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border-2 border-slate-300">
          📅
        </span>
      </div>
    </div>
  );
};

export default DateRangeFilter;
