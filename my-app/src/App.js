import { Navigate, Route, Routes } from "react-router-dom";
import ArticleDetail from "./components/ArticleDetail";
import HomePage from "./components/HomePage";

function App() {
  return (
    <div className="min-h-screen bg-slate-100">
      <main className="mx-auto w-full max-w-5xl px-4 py-8 md:py-12">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/article/:articleId" element={<ArticleDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <div className="mt-6 h-6 w-full border-t-2 border-slate-300 bg-slate-200" />
    </div>
  );
}

export default App;
