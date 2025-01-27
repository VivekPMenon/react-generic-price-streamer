
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
  earning_updates?: string;
  market_news?: string;
}