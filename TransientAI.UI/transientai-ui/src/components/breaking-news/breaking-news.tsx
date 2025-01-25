import { Article, FinanceArticle, newsDataService } from '@/services/news-data';
import styles from './breaking-news.module.scss';
import { useEffect, useState } from 'react';

export function BreakingNews() {
  // const articles = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14].map(number => {
  //   return {
  //     description: 'shere is a long description for the article',
  //     title: 'here is the title ',
  //     url: 'test'
  //   } as Article;
  // });
  const [articles, setArticles] = useState<FinanceArticle[]>([]);

  useEffect(() => {
    const loadAsync = async () => {
      const articles = await newsDataService.getBreakingNews();
      setArticles(articles);
    };

    loadAsync();
  }, []);

  return (
    <div className={`${styles['breaking-news']} cards scrollable-div`}>
      {/* 
      <div className='sub-header'>Breaking News</div> */}

      {
        articles.map(article => (
          <div className='card'>
            {/* <div className='card-image'>
              <img
                src={article.urlToImage}
                alt={article.title}
              />
            </div> */}

            <div className='card-content'>
              <div className='card-title'>
                <a href={article.source} className="inline-block" target="_blank">
                  {article.headline}
                </a>
              </div>

              <div className="card-description">
                {article.summary}
              </div>
            </div>
          </div>
        ))
      }
    </div>
  );
}