import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const PAGE_SIZE = 20;

export const fetchArticles = createAsyncThunk(
  'articles/fetchArticles',
  async ({ keyword, from, to, page = 1 }, { rejectWithValue }) => {
    const trimmedKeyword = keyword.trim();
    if (!trimmedKeyword) {
      return rejectWithValue('검색어를 입력해주세요.');
    }

    const apiKey = process.env.REACT_APP_NEWS_API_KEY;
    if (!apiKey) {
      return rejectWithValue(
        '환경 변수 REACT_APP_NEWS_API_KEY를 설정한 뒤 다시 시도해주세요.'
      );
    }

    const params = new URLSearchParams({
      q: trimmedKeyword,
      apiKey,
      pageSize: PAGE_SIZE.toString(),
      page: page.toString(),
      sortBy: 'publishedAt',
      language: 'en',
    });

    if (from) {
      params.append('from', from);
    }

    if (to) {
      params.append('to', to);
    }

    const response = await fetch(
      `https://newsapi.org/v2/everything?${params.toString()}`
    );

    if (!response.ok) {
      const message = `뉴스 API 호출에 실패했습니다. (status: ${response.status})`;
      return rejectWithValue(message);
    }

    const data = await response.json();

    if (data.status !== 'ok') {
      return rejectWithValue(data.message || '뉴스 데이터를 불러오지 못했습니다.');
    }

    return {
      articles: data.articles ?? [],
      totalResults: data.totalResults ?? 0,
      page,
    };
  }
);

const initialState = {
  keyword: '',
  from: '',
  to: '',
  articles: [],
  totalResults: 0,
  page: 1,
  status: 'idle',
  error: null,
  hasMore: false,
  selectedArticle: null,
};

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    setKeyword(state, action) {
      state.keyword = action.payload;
      state.page = 1;
    },
    setDateRange(state, action) {
      const { from = '', to = '' } = action.payload || {};
      state.from = from;
      state.to = to;
      state.page = 1;
    },
    clearArticles(state) {
      state.articles = [];
      state.totalResults = 0;
      state.page = 1;
      state.hasMore = false;
      state.status = 'idle';
      state.error = null;
    },
    setSelectedArticle(state, action) {
      state.selectedArticle = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state, action) => {
        state.status = 'loading';
        state.error = null;

        if (action.meta.arg.page === 1) {
          state.articles = [];
          state.hasMore = false;
        }
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        const { articles, totalResults, page } = action.payload;
        state.status = 'succeeded';
        state.totalResults = totalResults;
        state.page = page;

        const existingUrls = new Set(state.articles.map((article) => article.url));

        if (page === 1) {
          state.articles = articles;
        } else {
          const newArticles = articles.filter(
            (article) => article.url && !existingUrls.has(article.url)
          );
          state.articles = [...state.articles, ...newArticles];
        }

        state.hasMore =
          state.articles.length < totalResults && (articles?.length ?? 0) > 0;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export const {
  setKeyword,
  setDateRange,
  clearArticles,
  setSelectedArticle,
} = articlesSlice.actions;

export default articlesSlice.reducer;
