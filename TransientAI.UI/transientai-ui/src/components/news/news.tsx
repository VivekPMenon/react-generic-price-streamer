'use client'

import { useEffect, useState } from "react";
import {NewsComponent} from "@/components/news/news-component";
import {NewsArticle, productBrowserDataService} from "@/services/product-browser-data";

export function News() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    productBrowserDataService.getBreakingNews()
        .then(articles => setNews(articles))
        .finally(() => setIsLoading(false));
  }, []);

  return (
      <NewsComponent
          heading={'Breaking News'}
          isLoading={isLoading}
          news={news}
      />
  );
}