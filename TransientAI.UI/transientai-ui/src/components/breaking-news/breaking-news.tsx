import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Article, ConsolidatedArticles, FinanceArticle, newsDataService } from '@/services/news-data';
import styles from './breaking-news.module.scss';
import { useEffect, useState } from 'react';

export interface BreakingNewsProps {
  isExpanded: boolean;
}

export function BreakingNews({ isExpanded }: BreakingNewsProps) {
  // const articles = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14].map(number => {
  //   return {
  //     description: 'shere is a long description for the article',
  //     title: 'here is the title ',
  //     url: 'test'
  //   } as Article;
  // });
  const [articles, setArticles] = useState<ConsolidatedArticles>({});

  useEffect(() => {
    const loadAsync = async () => {
      const articles = await newsDataService.getBreakingNews();
      setArticles(articles);
    };

    loadAsync();
  }, []);

  return (
    <div className={`${styles['breaking-news']} scrollable-div ${isExpanded ? styles['expanded'] : ''}`}>
      <div className=''>
        {
          // articles.market_news?.map(article => (
          //   <div className='card'>
          //     {/* <div className='card-image'>
          //     <img
          //       src={article.urlToImage}
          //       alt={article.title}
          //     />
          //   </div> */}

          //     <div className='card-content'>
          //       <div className='card-title'>
          //         <a href={article.source} className="inline-block" target="_blank">
          //           {article.headline}
          //         </a>
          //       </div>

          //       <div className="card-description">
          //         {article.summary}
          //       </div>
          //     </div>
          //   </div>
          // ))
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

      <div className=''>
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
          {articles.earning_updates}
        </ReactMarkdown>
      </div>

    </div>
  );
}