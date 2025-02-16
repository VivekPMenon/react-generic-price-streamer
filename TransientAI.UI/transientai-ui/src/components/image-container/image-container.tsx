'use client';

import styles from './image-container.module.scss';
import {ImagePopup} from "@/components/image-container/image-popup";

type ImageContainerProps = {
    images: Array<{image: string, description?: string}>;
};

const ImageContainer = (props: ImageContainerProps) => {
    const { images } = props;

    return (
        <div className={styles['image-container']}>
            <ul className={styles['image-section']}>
                { images.map((image) => (
                    <li key={image.image}>
                        <ImagePopup image={image.image} description={image.description}>
                            <img src={image.image} />
                        </ImagePopup>
                    </li>
                ))}
            </ul>
        </div>
    );
};


export default ImageContainer;