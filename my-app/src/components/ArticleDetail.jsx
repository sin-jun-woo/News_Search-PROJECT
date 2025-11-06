import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import { setSelectedArticle } from "../features/articles/articlesSlice";

const ArticleDetail = () => {
  const dispatch = useDispatch();
  const { articleId } = useParams();
  const location = useLocation();

  const articles = useSelector((state) => state.articles.articles);
  const selectedArticle = useSelector(
    (state) => state.articles.selectedArticle
  );

  const listMatch = useMemo(() => {
    if (!articleId) {
      return null;
    }
    return articles.find(
      (item) => item.url && encodeURIComponent(item.url) === articleId
    );
  }, [articleId, articles]);

  const article =
    location.state?.article || selectedArticle || listMatch || null;

  useEffect(() => {
    if (location.state?.article) {
      dispatch(setSelectedArticle(location.state.article));
      try {
        sessionStorage.setItem(
          "selectedArticle",
          JSON.stringify(location.state.article)
        );
      } catch {}
      return;
    }

    if (article) {
      return;
    }

    try {
      const cached = sessionStorage.getItem("selectedArticle");
      if (!cached) {
        return;
      }

      const parsed = JSON.parse(cached);
      if (
        parsed?.url &&
        (!articleId || encodeURIComponent(parsed.url) === articleId)
      ) {
        dispatch(setSelectedArticle(parsed));
      }
    } catch {}
  }, [article, articleId, dispatch, location.state]);

  if (!article) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-4xl flex-col items-center justify-center gap-4 text-center">
        <p className="text-lg font-semibold text-slate-900">
          기사를 불러올 수 없습니다.
        </p>
        <p className="text-sm text-slate-500">
          목록에서 다시 기사를 선택하거나 새로운 검색을 시도해 주세요.
        </p>
        <Link
          to="/"
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          기사 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const publishedAt = article.publishedAt
    ? new Date(article.publishedAt).toLocaleString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "발행일 정보 없음";

  return (
    <article className="mx-auto flex min-h-[60vh] max-w-4xl flex-col gap-6 rounded-3xl border-2 border-slate-300 bg-white p-6 shadow-sm md:p-10">
      <div className="flex flex-col gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          ← 기사 목록으로
        </Link>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-slate-900">{article.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
            {article.author && <span>작성자 {article.author}</span>}
            <span>{publishedAt}</span>
            {article.source?.name && (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                {article.source.name}
              </span>
            )}
          </div>
        </div>
      </div>

      {article.urlToImage && (
        <div className="overflow-hidden rounded-2xl border border-slate-100">
          <img
            src={article.urlToImage}
            alt={article.title}
            className="h-auto w-full object-cover"
          />
        </div>
      )}

      <div className="flex flex-col gap-4 text-base leading-relaxed text-slate-700">
        {article.content ? (
          <p>{article.content}</p>
        ) : (
          <p>{article.description || "기사 전문을 불러올 수 없습니다."}</p>
        )}
      </div>

      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
      >
        원문으로 이동하기 ↗
      </a>
    </article>
  );
};

export default ArticleDetail;
