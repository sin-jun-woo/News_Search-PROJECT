import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearArticles,
  fetchArticles,
  setDateRange,
  setKeyword,
  setSelectedArticle,
} from "../features/articles/articlesSlice";
import SearchBar from "./SearchBar";
import DateRangeFilter from "./DateRangeFilter";
import ArticleList from "./ArticleList";
import InfiniteScrollTrigger from "./InfiniteScrollTrigger";
import CalendarPreview from "./CalendarPreview";

const HomePage = () => {
  const dispatch = useDispatch();
  const {
    keyword,
    from,
    to,
    articles,
    status,
    error,
    hasMore,
    page,
    totalResults,
  } = useSelector((state) => state.articles);

  const [searchValue, setSearchValue] = useState(keyword);

  useEffect(() => {
    setSearchValue(keyword);
  }, [keyword]);

  const handleSearchSubmit = useCallback(() => {
    const trimmed = searchValue.trim();
    if (!trimmed) {
      setSearchValue("");
      dispatch(setKeyword(""));
      dispatch(clearArticles());
      return;
    }

    dispatch(setKeyword(trimmed));
    dispatch(
      fetchArticles({
        keyword: trimmed,
        from,
        to,
        page: 1,
      })
    );
  }, [dispatch, from, searchValue, to]);

  const handleDateChange = useCallback(
    ({ from: nextFrom, to: nextTo }) => {
      dispatch(setDateRange({ from: nextFrom, to: nextTo }));

      if (!keyword.trim()) {
        return;
      }

      dispatch(
        fetchArticles({
          keyword,
          from: nextFrom,
          to: nextTo,
          page: 1,
        })
      );
    },
    [dispatch, keyword]
  );

  const handleLoadMore = useCallback(() => {
    if (status === "loading" || !hasMore) {
      return;
    }

    dispatch(
      fetchArticles({
        keyword,
        from,
        to,
        page: page + 1,
      })
    );
  }, [dispatch, from, hasMore, keyword, page, status, to]);

  const handleSelectArticle = useCallback(
    (article) => {
      dispatch(setSelectedArticle(article));
      try {
        sessionStorage.setItem("selectedArticle", JSON.stringify(article));
      } catch {}
    },
    [dispatch]
  );

  const metaSummary = useMemo(() => {
    if (!keyword.trim()) {
      return "상단 검색창에 회사명을 입력하면 관련 기사가 나타납니다.";
    }

    if (status === "succeeded" && totalResults) {
      return `총 ${totalResults.toLocaleString()}건의 기사를 찾았습니다.`;
    }

    if (status === "failed" && error) {
      return error;
    }

    return "최신 기사를 빠르게 확인해 보세요.";
  }, [error, keyword, status, totalResults]);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2 rounded-3xl border-2 border-slate-300 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">기업 뉴스 검색</h1>
        <p className="text-sm text-slate-600">{metaSummary}</p>
      </header>

      <section className="grid gap-6 md:grid-cols-[2fr,1fr]">
        <div className="rounded-3xl border-2 border-slate-300 bg-white p-6 shadow-sm">
          <SearchBar
            keyword={searchValue}
            onChange={setSearchValue}
            onSubmit={handleSearchSubmit}
            isLoading={status === "loading" && articles.length === 0}
          />
        </div>
        <div className="flex flex-col gap-4">
          <DateRangeFilter from={from} to={to} onChange={handleDateChange} />
          <CalendarPreview from={from} to={to} />
        </div>
      </section>

      <ArticleList
        articles={articles}
        status={status}
        error={error}
        onSelect={handleSelectArticle}
      />

      <InfiniteScrollTrigger
        disabled={!hasMore || status === "loading"}
        onIntersect={handleLoadMore}
      />
    </div>
  );
};

export default HomePage;
