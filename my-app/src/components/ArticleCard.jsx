import { Link } from 'react-router-dom';

const ArticleCard = ({ article, onSelect }) => {
  const publishedAt = article.publishedAt
    ? new Date(article.publishedAt).toLocaleString('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '날짜 정보 없음';

  const articleId = article.url ? encodeURIComponent(article.url) : '';

  return (
    <article className="flex flex-col gap-3 rounded-2xl border-2 border-slate-300 bg-white p-5 shadow-sm transition hover:border-slate-900 hover:shadow-md">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">{article.title}</h2>
        <span className="whitespace-nowrap rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {publishedAt}
        </span>
      </div>
      <p className="text-sm text-slate-600">
        {article.description || '요약 정보가 제공되지 않았습니다.'}
      </p>
      <div className="flex flex-wrap items-center justify-between gap-3">
        {article.source?.name && (
          <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-500">
            {article.source.name}
          </span>
        )}
        <Link
          to={`/article/${articleId}`}
          state={{ article }}
          onClick={() => onSelect(article)}
          className="ml-auto text-sm font-semibold text-slate-900 underline decoration-2 underline-offset-4 hover:text-slate-700"
        >
          기사 자세히 보기 →
        </Link>
      </div>
    </article>
  );
};

export default ArticleCard;
