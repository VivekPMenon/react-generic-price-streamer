export function executeAsync(func: () => void) {
    setTimeout(() => {
        func();
    }, 0);
}