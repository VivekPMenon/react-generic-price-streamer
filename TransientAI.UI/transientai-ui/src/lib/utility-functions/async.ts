export function executeAsync(func: () => void, delay: number = 0) {
    setTimeout(() => {
        func();
    }, delay);
}