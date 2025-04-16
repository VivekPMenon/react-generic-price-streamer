'use client'

import {useProductBrowserStore} from "@/services/product-browser-data/product-browser-store";
import { Spinner } from "@radix-ui/themes";
import styles from './news.module.scss';
import {NewsArticle} from "@/services/product-browser-data";

interface NewsItemProps {
    article: NewsArticle
}

function NewsArticleComponent({ article }: NewsItemProps) {
    return (
        <div
            key={article.title}
            className="news-item"
        >
            <div className={`${styles['news-contents']}`}>
                <div className="news-title">
                    {article.title}
                </div>
                <div className={`${styles['news-subheading']}`}>
                    <span>{article.date.toLocaleString()}</span>
                    <a className="hyperlink primary"
                       href={article.url}
                       style={{padding: 0}}
                       target={article.title}>{article.source}</a>
                </div>
                <div className="news-description">
                    {article.text}
                </div>
            </div>
        </div>
    );
}

export function BondNews() {
    const { isNewsForBondLoading, bondNews } = useProductBrowserStore();

    let content;
    if (isNewsForBondLoading){
        content = (
            <div className="flex justify-center items-center h-full">
                <Spinner size='3' className={styles['spinner']} />
            </div>
        );
    } else {
        content = (
            <div className="news scrollable-div">
                {
                    bondNews.map(bondNews => (
                        <div
                            className={`${styles['news-article']} `}
                            key={bondNews.title}>
                            <NewsArticleComponent
                                article={bondNews}
                            />
                        </div>
                    ))
                }
            </div>
        )
    }

    return (
        <div className={`${styles['news-articles']}`}>
            <div className='sub-header'>News</div>
            {
                content
            }
        </div>
    );
}