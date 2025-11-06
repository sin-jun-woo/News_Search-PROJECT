import ArticleCard from './ArticleCard';

const ArticleList = ({ articles, status, error, onSelect }) => {
  if (status === 'idle') {
    return (
      <div className="rounded-2xl border-2 border-dashed border-slate-400 bg-slate-50 p-10 text-center text-sm text-slate-500">
        검색창에 회사 이름을 입력해 최신 기사를 확인해 보세요.
      </div>
    );
  }

  if (status === 'loading' && articles.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-slate-300 bg-white p-10 text-sm text-slate-500">
        <span className="flex h-12 w-12 animate-spin items-center justify-center rounded-full border-4 border-slate-200 border-t-slate-900" />
        데이터를 불러오는 중입니다…
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="rounded-2xl border-2 border-red-300 bg-red-50 p-6 text-sm text-red-700">
        {error || '알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
        검색 결과가 없습니다. 다른 키워드로 다시 검색해 보세요.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {articles.map((article) => {
        const key = article.url || `${article.title}-${article.publishedAt}`;
        return (
          <ArticleCard key={key} article={article} onSelect={onSelect} />
        );
      })}
      {status === 'loading' && (
        <div className="flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-300 bg-white p-4 text-sm text-slate-500">
          <span className="flex h-6 w-6 animate-spin items-center justify-center rounded-full border-2 border-slate-200 border-t-slate-900" />
          다음 기사들을 불러오는 중입니다…
        </div>
      )}
    </div>
  );
};

export default ArticleList;
