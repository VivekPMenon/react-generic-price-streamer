import styles from "@/components/dancing-dots/dancing-dots.module.scss";

export const DancingDots = () => {
    return (
        <div className={`${styles['dots-container']}`}>
            <div className={`${styles['dot']}`} />
            <div className={`${styles['dot']}`} />
            <div className={`${styles['dot']}`} />
        </div>
    );
};