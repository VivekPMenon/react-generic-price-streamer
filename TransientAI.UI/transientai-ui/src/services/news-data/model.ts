
export interface Article {
  title?: string;
  description?: string;
  url?: string;
  urlToImage?: string;
}

export interface FinanceArticle {
  headline?: string;
  source?: string;
  summary?: string;
}

export interface ConsolidatedArticles {
  earnings_updates?: FinanceArticle[];
  market_news?: FinanceArticle[];
}