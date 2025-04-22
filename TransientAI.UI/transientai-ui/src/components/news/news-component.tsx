'use client'

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
                       target="_blank">{article.source}</a>
                </div>
                <div className="news-description">
                    {article.text}
                </div>
            </div>
        </div>
    );
}

export interface NewsProps {
    heading: string;
    isLoading: boolean;
    news: NewsArticle[];
}

export function NewsComponent({ heading, isLoading, news }: NewsProps) {
    let content;
    if (isLoading){
        content = (
            <div className="flex justify-center items-center h-full">
                <Spinner size='3' className={styles['spinner']} />
            </div>
        );
    } else {
        content = (
            <div className="news scrollable-div">
                {
                    news.map((article: NewsArticle, index: number) => (
                        <div
                            className={`${styles['news-article']} `}
                            key={`${article.title}_${index}`}>
                            <NewsArticleComponent
                                article={article}
                            />
                        </div>
                    ))
                }
            </div>
        )
    }

    return (
        <div className={`${styles['news-articles']}`}>
            <div className='sub-header'>{heading}</div>
            {
                content
            }
        </div>
    );
}