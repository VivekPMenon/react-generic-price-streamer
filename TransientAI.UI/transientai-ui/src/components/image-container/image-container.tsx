'use client';

import styles from './image-container.module.scss';
import {ImagePopup} from "@/components/image-container/image-popup";

export interface ImageItem {
    url: string;
    title?: string;
    description?: string;
}

type ImageContainerProps = {
    images: Array<ImageItem>;
};

const ImageContainer = (props: ImageContainerProps) => {
    const { images } = props;

    return (
        <div className={styles['image-container']}>
            <ul className={styles['image-section']}>
                { images.map((image) => (
                    <li key={image.url}>
                        <ImagePopup {...image}>
                            <div>
                                <h2>{image.title}</h2>
                                <img src={image.url} alt={image.title ?? image.description} />
                                <div className={`${styles['img-description']}`}>{image.description}</div>
                            </div>
                        </ImagePopup>
                    </li>
                ))}
            </ul>
        </div>
    );
};


export default ImageContainer;