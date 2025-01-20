import { newsDataService } from "@/services/news-data";
import { Article } from "@/services/news-data/model";
import { useEffect, useState } from "react";
import styles from './news.module.scss';

export interface NewsProps {
  onExpandCollapse: (state: boolean) => void;
}

export function News(props: NewsProps) {

  const [articles, setArticles] = useState<Article[]>([]);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  useEffect(() => loadNewsArticles(), []);

  function loadNewsArticles() {
    const loadNewsArticlesAsync = async () => {
      const articles = await newsDataService.getArticles();
      setArticles(articles.slice(0, 15));
    };

    loadNewsArticlesAsync();
  }

  function expandOrCollapsePanel() {
    setIsExpanded(!isExpanded);
    props.onExpandCollapse(!isExpanded);
  }

  return (
    <div className={`${styles['news-articles']} cards widget scrollable-div  ${isExpanded ? styles['expanded']: ''}`}>
      
      <div className='widget-title'>
        Trending News
        {/* <i className='fa-solid fa-expand toggler' onClick={() => expandOrCollapsePanel()}></i> */}
      </div>
      
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
                <a href={article.url} className="inline-block" target="_blank">
                  {article.title}
                </a>
              </div>

              <div className="card-description">
                {article.description}
              </div>
            </div>
          </div>
        ))
      }
    </div>
  );
}