import { newsDataService } from "@/services/news-data";
import { Article, ConsolidatedArticles } from "@/services/news-data/model";
import { useEffect, useState } from "react";
import styles from './news.module.scss';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Spinner } from "@radix-ui/themes";

export interface NewsProps {
  onExpandCollapse: (state: boolean) => void;
}

export function News(props: NewsProps) {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [articles, setArticles] = useState<ConsolidatedArticles>({});

  useEffect(() => {
    const loadAsync = async () => {
      setIsLoading(true);

      const articles = await newsDataService.getBreakingNews();
      setArticles(articles);

      setIsLoading(false);
    };

    loadAsync();
  }, []);

  return (
    <div className={`${styles['news-articles']} scrollable-div widget`}>
      {
        isLoading ?
          <div className="flex justify-center items-center h-full">
            <Spinner size='3'className={styles['spinner']}></Spinner>
            Loading News... Please wait, it might take a minute
          </div>
          :
          <ReactMarkdown className='markdown'
            components={{
              a: ({ node, children, ...props }) => {
                if (props.href?.includes('http')) {
                  props.target = '_blank'
                  props.rel = 'noopener noreferrer'
                }
                return <a {...props}>{children}</a>
              },
            }}
            remarkPlugins={[remarkGfm]}>
            {articles.market_news}
          </ReactMarkdown>
      }
    </div>
  );
}