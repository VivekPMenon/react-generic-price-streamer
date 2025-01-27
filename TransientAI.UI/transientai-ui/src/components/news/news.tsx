import { newsDataService } from "@/services/news-data";
import { Article, ConsolidatedArticles } from "@/services/news-data/model";
import { useEffect, useState } from "react";
import styles from './news.module.scss';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export interface NewsProps {
  onExpandCollapse: (state: boolean) => void;
}

export function News(props: NewsProps) {

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [articles, setArticles] = useState<ConsolidatedArticles>({});

  useEffect(() => {
    const loadAsync = async () => {
      const articles = await newsDataService.getBreakingNews();
      setArticles(articles);
    };

    loadAsync();
  }, []);

  function expandOrCollapsePanel() {
    setIsExpanded(!isExpanded);
    props.onExpandCollapse(!isExpanded);
  }

  return (
    <div className={`${styles['news-articles']} scrollable-div`}>

      {
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