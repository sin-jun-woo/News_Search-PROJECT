import { useCallback } from 'react';

const SearchBar = ({ keyword, onChange, onSubmit, isLoading }) => {
  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      onSubmit();
    },
    [onSubmit]
  );

  return (
    <form onSubmit={handleSubmit} className="relative flex w-full">
      <span
        className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 text-lg text-slate-400"
        aria-hidden="true"
      >
        🔍
      </span>
      <input
        type="search"
        placeholder="회사명을 입력해 기사를 검색하세요 (예: 애플)"
        className="h-14 w-full rounded-full border-2 border-slate-400 bg-white pl-12 pr-32 text-base text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-200"
        value={keyword}
        onChange={(event) => onChange(event.target.value)}
      />
      <button
        type="submit"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-slate-900 px-6 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:bg-slate-300"
        disabled={isLoading}
      >
        {isLoading ? '검색 중…' : '검색'}
      </button>
    </form>
  );
};

export default SearchBar;
