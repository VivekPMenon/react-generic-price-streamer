'use client';

import styles from './image-container.module.scss';
import {ImagePopup} from "@/components/image-container/image-popup";

type ImageContainerProps = {
    images: Array<{image: string, title?: string; description?: string}>;
};

const ImageContainer = (props: ImageContainerProps) => {
    const { images } = props;

    return (
        <div className={styles['image-container']}>
            <ul className={styles['image-section']}>
                { images.map((image) => (
                    <li key={image.image}>
                        <ImagePopup {...image}>
                            <div>
                                <h2>{image.title}</h2>
                                <img src={image.image} alt={image.title}/>
                                <span>{image.description}</span>
                            </div>
                        </ImagePopup>
                    </li>
                ))}
            </ul>
        </div>
    );
};


export default ImageContainer;