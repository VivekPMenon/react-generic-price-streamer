export function executeAsync(callback: () => void, delay: number = 0) {
    setTimeout(() => {
        callback();
    }, delay);
}

export function throttleRAF<T extends () => void>(callback: T): () => void {
    let requested = false;
    return function (): void {
        if (!requested) {
            requested = true;
            requestAnimationFrame(() => {
                callback();
                requested = false;
            });
        }
    };
}