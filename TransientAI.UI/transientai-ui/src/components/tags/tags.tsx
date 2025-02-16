'use client';

import styles from './tags.module.scss';

type TagsProps = {
    header: string;
    tags: Array<string>;
};

const Tags = (props: TagsProps) => {
    const { header, tags } = props;

    return (
        <div className={styles['tag-container']}>
            <h1>{header}</h1>
            <ul className={styles['tags-section']}>
                { tags.map((tag) => (
                    <li key={tag}>
                        {tag}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Tags;